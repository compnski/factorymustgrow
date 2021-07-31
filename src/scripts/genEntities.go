package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"text/template"
)

type FileJSON struct {
	Items   []ItemJSON
	Recipes []RecipeJSON
}

type ItemJSON struct {
	Category string
	ID       string
	Name     string
	Stack    float32
	Row      float32
	Col      float32
}

type RecipeJSON struct {
	ID        string
	In        map[string]float32
	Producers []string
	Time      float32
	Out       map[string]float32
}

func (r ItemJSON) AsEntity() Entity {
	return Entity{
		Name:                 r.Name,
		ID:                   r.ID,
		StackSize:            r.Stack,
		StorageUpgradeType:   "Solid",
		ResearchUpgradeItems: []EntityStack{},
	}
}

func GuessProducerType(firstProducer string) string {
	switch firstProducer {
	case "assembling-machine-1", "assembling-machine-2", "assembling-machine-3":
		return "Assembler"
	case "electric-mining-drill":
		return "Miner"
	case "electric-furnace":
		return "Smelter"
	case "chemical-plant":
		return "ChemPlant"
	case "oil-refinery":
		return "Refinery"
	case "centrifuge":
		return "Centrifuge"
	case "pumpjack":
		return "Pumpjack"
	case "offshore-pump":
		return "WaterPump"
	case "boiler":
		return "Boiler"
	default:
		panic("Unknown producer: " + firstProducer)
	}
}

func (r RecipeJSON) AsRecipe() Recipe {
	// Extractor recipe
	if len(r.Out) == 0 {
		r.Out = map[string]float32{r.ID: 1}
	}
	if len(r.In) == 0 {
		r.In = map[string]float32{r.ID: 1}
	}
	return Recipe{
		ID:                r.ID,
		ProducerType:      GuessProducerType(r.Producers[0]),
		DurationSeconds:   r.Time,
		ProductionPerTick: 1 / r.Time,
		Input:             mapToEntityStacks(r.In),
		Output:            mapToEntityStacks(r.Out),
	}
}

func mapToEntityStacks(m map[string]float32) (ret []EntityStack) {
	for key, val := range m {
		ret = append(ret, EntityStack{Entity: key, Count: val})
	}
	return
}

type Recipe struct {
	ID                string
	ProducerType      string
	DurationSeconds   float32
	Input             []EntityStack
	Output            []EntityStack
	ProductionPerTick float32
}

type EntityStack struct {
	Entity string  `json:"id"`
	Count  float32 `json:"amount"`
}

type Entity struct {
	Name                 string
	ID                   string
	StackSize            float32
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
  Id: "{{.ID}}",
  Icon: "{{.ID}}",
  DurationSeconds:{{.DurationSeconds}},
  ProductionPerTick:{{.ProductionPerTick}},
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

export function GetEntity(name:string):Entity {
  return Entities.get(name)!;
}

export function GetRecipe(name:string):Recipe {
  return Recipes.get(name)!;
}
`

func main() {
	if len(os.Args) < 2 {
		log.Fatalf("usage: %s <output filename>\n", os.Args[0])
	}
	var parsedJson = FileJSON{}
	var recipes = []Recipe{}
	content, err := ioutil.ReadFile("recipes.json")
	if err != nil {
		log.Fatal(err)
	}
	json.Unmarshal(content, &parsedJson)
	var entities = map[string]Entity{}
	for _, i := range parsedJson.Items {
		if _, exists := entities[i.ID]; !exists {
			entities[i.ID] = i.AsEntity()
		}
	}
	for _, r := range parsedJson.Recipes {
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
