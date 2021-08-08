package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"text/template"

	"gopkg.in/yaml.v2"
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
	In        yaml.MapSlice //map[string]float32
	Producers []string
	Time      float32
	Out       yaml.MapSlice // map[string]float32
}

func (r ItemJSON) AsEntity() Entity {
	return Entity{
		Name:      r.Name,
		ID:        r.ID,
		StackSize: r.Stack,
		Row:       r.Row,
		Col:       r.Col,
		Category:  r.Category,
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
	case "rocket-silo":
		return "RocketSilo"
	default:
		panic("Unknown producer: " + firstProducer)
	}
}

func (r RecipeJSON) AsRecipe() Recipe {
	// Extractor recipe
	if len(r.Out) == 0 {
		r.Out = yaml.MapSlice{{Key: r.ID, Value: float64(1)}}
	}
	if len(r.In) == 0 {
		r.In = yaml.MapSlice{{Key: r.ID, Value: float64(1)}} //map[string]float32{r.ID: 1}
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

func mapToEntityStacks(m yaml.MapSlice) (ret []EntityStack) {
	for _, val := range m {
		switch count := val.Value.(type) {
		case int:
			ret = append(ret, EntityStack{Entity: val.Key.(string), Count: float64(count)})
		case float64:
			ret = append(ret, EntityStack{Entity: val.Key.(string), Count: count})
		}

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
	Count  float64 `json:"amount"`
}

type Entity struct {
	Name      string
	ID        string
	StackSize float32
	Category  string
	Row       float32
	Col       float32
}

const entityTplTxt = `"{{.ID}}": {
  Name: "{{.Name}}",
  Id: "{{.ID}}",
  Icon: "{{.ID}}",
  StackSize: {{.StackSize}},
  Category: "{{.Category}}",
  Row: {{.Row}},
  Col: {{.Col}},
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
	yaml.Unmarshal(content, &parsedJson)
	var (
		entities  = map[string]Entity{}
		entityIDs = []string{}
	)

	for _, i := range parsedJson.Items {
		if _, exists := entities[i.ID]; !exists {
			entities[i.ID] = i.AsEntity()
			entityIDs = append(entityIDs, i.ID)
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
	for _, entId := range entityIDs {
		e := entities[entId]
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
