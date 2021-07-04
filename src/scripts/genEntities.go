package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"
	"text/template"
)

type RecipeJSON struct {
	ID     string
	Name   string
	Recipe struct {
		Time        float32
		Yield       float32
		Ingredients []EntityStack
	}
}

func (r RecipeJSON) AsEntity() Entity {
	return Entity{
		Name:                 r.Name,
		ID:                   r.ID,
		StackSize:            50,
		StorageUpgradeType:   "Solid",
		ResearchUpgradeItems: []EntityStack{},
	}
}

func GuessProducerType(name string) string {
	if strings.Contains(name, "ore") {
		return "Miner"
	}
	return "Assembler"
}

func (r RecipeJSON) AsRecipe() Recipe {
	return Recipe{
		Name:            r.Name,
		ID:              r.ID,
		ProducerType:    GuessProducerType(r.Name),
		DurationSeconds: r.Recipe.Time,
		Input:           r.Recipe.Ingredients,
		Output: []EntityStack{{
			Entity: r.ID,
			Count:  r.Recipe.Yield,
		}},
	}
}

type Recipe struct {
	Name            string
	ID              string
	ProducerType    string
	DurationSeconds float32
	Input           []EntityStack
	Output          []EntityStack
}

type EntityStack struct {
	Entity string  `json:"id"`
	Count  float32 `json:"amount"`
}

type Entity struct {
	Name                 string
	ID                   string
	StackSize            int
	StorageUpgradeType   string
	ResearchUpgradeItems []EntityStack
}

const entityTplTxt = `"{{.ID}}": {
  Name: "{{.Name}}",
  Id: "{{.ID}}",
  Icon: "{{.ID}}",
  StackSize: {{.StackSize}},
  StorageUpgradeType: "{{.StorageUpgradeType}}",
  ResearchUpgradeItems: [],
},
`

const recipeTplTxt = `{{define "EntityStack"}}{
  Entity: "{{.Entity}}",
  Count: {{.Count}},
  }{{end}}
"{{.ID}}": {
  Name: "{{.Name}}",
  Id: "{{.ID}}",
  Icon: "{{.ID}}",
  DurationSeconds:{{.DurationSeconds}},
  ProducerType: "{{.ProducerType}}",
  Input: [{{range .Input}}
    {{template "EntityStack" .}},
   {{end}}],
  Output: [{{range .Output}}
    {{template "EntityStack" .}},
   {{end}}],
},
`

const headerTxt = `import {Recipe, Entity} from "../types"
import { Map } from "immutable";

export function entity(name:string):Entity {
  return Entities.get(name)!;
}

export function recipe(name:string):Recipe {
  return Recipes.get(name)!;
}
`

func main() {
	if len(os.Args) < 2 {
		log.Fatalf("usage: %s <output filename>\n", os.Args[0])
	}
	var jsonRecipes = []RecipeJSON{}
	var recipes = []Recipe{}
	content, err := ioutil.ReadFile("recipes.json")
	if err != nil {
		log.Fatal(err)
	}
	json.Unmarshal(content, &jsonRecipes)
	var entities = map[string]Entity{}
	for _, r := range jsonRecipes {
		if _, exists := entities[r.ID]; !exists {
			entities[r.ID] = r.AsEntity()
		}
		recipes = append(recipes, r.AsRecipe())
	}

	entityTpl := template.Must(template.New("entity").Parse(entityTplTxt))
	recipeTpl := template.Must(template.New("recipe").Parse(recipeTplTxt))

	outFile, err := os.Create(os.Args[1])
	defer outFile.Close()

	if err != nil {
		panic(err)
	}

	fmt.Fprintf(outFile, headerTxt)

	fmt.Fprintf(outFile, "export const Entities:Map<string,Entity> = Map({\n")
	for _, e := range entities {
		err := entityTpl.Execute(outFile, e)
		if err != nil {
			panic(err)
		}
	}
	fmt.Fprintf(outFile, "});\n")

	fmt.Fprintf(outFile, "\n\nexport const Recipes:Map<string, Recipe> = Map({\n")
	for _, r := range recipes {
		err := recipeTpl.Execute(outFile, r)
		if err != nil {
			panic(err)
		}
	}
	fmt.Fprintf(outFile, "});\n")

}
