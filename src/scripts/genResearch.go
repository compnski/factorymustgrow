package main

import (
	"bytes"
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"strings"
	"text/template"

	"golang.org/x/net/html"
)

type EntityStack struct {
	Count  float32
	Entity string
}

type TechInfo struct {
	ID                              string
	Name                            string
	Icon                            string
	Ingredients                     []EntityStack
	ProductionRequiredForCompletion float32
	Prereqs                         []string
	Unlocks                         []string
	Row                             float32
	Bonuses                         []string
	DurationSeconds                 float32
	ProductionPerTick               float32
}

const techTplTxt = `
{{define "EntityStack"}}{Entity: "{{.Entity}}", Count: {{.Count}}}{{end}}
import { Research } from "../types"

export function GetResearch(name:string):Research {
  return ResearchMap.get(name)!;
}

export const ResearchMap:Map<string,Research> = new Map([
{{range .}}
["{{.ID}}", {
  Id: "{{.ID}}",
  Name: "{{.Name}}",
  Icon: "{{.Icon}}",
  Input: [{{- range .Ingredients -}}
    {{template "EntityStack" .}},
   {{end -}}],
  ProductionRequiredForCompletion: {{.ProductionRequiredForCompletion}},
  ProductionPerTick:{{.ProductionPerTick}},
  DurationSeconds:{{.DurationSeconds}},
  Row: {{.Row}},
  Prereqs: new Set([{{range .Prereqs -}}
    "{{- . -}}",
   {{- end}}]),
  Unlocks: [{{range .Unlocks -}}
    {{if .}}"{{.}}",{{end}}
   {{- end -}}],
  Effects: [{{range .Bonuses}}
    {{- if .}}"{{.}}",{{end -}}
   {{end}}],
}],
{{end}}
])
`

var techTpl = template.Must(template.New("svg").Parse(techTplTxt))

func parseFloatOrZero(s string) float32 {
	n, _ := strconv.ParseFloat(s, 32)
	return float32(n)
}

func listOfPairsToEntityStackAndTime(pairs string) (ret []EntityStack, researchTime, productionRequired float32) {
	splitPairs := strings.Split(pairs, ",")
	for i := 1; i < len(splitPairs); i += 2 {
		if splitPairs[i-1] == "time" {
			researchTime = parseFloatOrZero(splitPairs[i])
		} else {
			productionRequired = parseFloatOrZero(splitPairs[i])
			ret = append(ret, EntityStack{Entity: splitPairs[i-1],
				Count: 1})
		}
	}
	return
}

func attributeValue(key string, node *html.Node) string {
	for _, attr := range node.Attr {
		if attr.Key == key {
			return attr.Val
		}
	}
	return ""
}

func childAttributeValueList(key string, node *html.Node) (titles []string) {
	for child := node; child != nil; child = child.NextSibling {
		var title = attributeValue(key, child)
		if title != "" {
			titles = append(titles, title)
		}
	}
	return
}

func copyNodeValuesToTech(tech *TechInfo, node *html.Node) {
	ingredients, researchTime, productionRequired := listOfPairsToEntityStackAndTime(attributeValue("data-ingredients", node))
	if tech.ID == "" {
		tech.ID = attributeValue("id", node)
	}

	if tech.Name == "" {
		tech.Name = attributeValue("data-title", node)
	}
	tech.Prereqs = strings.Split(attributeValue("data-prereqs", node), ",")

	if len(tech.Ingredients) == 0 {
		tech.Ingredients = ingredients
		tech.DurationSeconds = researchTime
		tech.ProductionPerTick = 1 / researchTime
		tech.ProductionRequiredForCompletion = productionRequired
	}
	classData := strings.Split(attributeValue("class", node), " ")
	if len(classData) > 1 {
		tech.Row = parseFloatOrZero(strings.ReplaceAll(classData[1], "L", ""))
	}

}

func main() {
	if len(os.Args) < 2 {
		log.Fatalf("usage: %s <input filename>\n", os.Args[0])
	}
	css, err := ioutil.ReadFile(os.Args[1])
	if err != nil {
		log.Fatal(err)
	}

	var techInfoList []TechInfo

	node, err := html.ParseFragment(bytes.NewReader(css), nil)
	var dataDiv = node[0].LastChild.FirstChild
	for dataDiv != nil {
		tech := TechInfo{
			Prereqs: []string{},
		}

		idx := 0
		if attributeValue("data-ingredients", dataDiv) != "" || attributeValue("id", dataDiv) == "start" {
			copyNodeValuesToTech(&tech, dataDiv)
		}
		for child := dataDiv.FirstChild; child != nil; child = child.NextSibling {
			if child != nil {
				switch attributeValue("class", child) {
				case "pic":
					tech.Icon = strings.ReplaceAll(strings.ReplaceAll(attributeValue("src", child), "graphics/technology/", ""), ".png", "")
				case "items":
					tech.Bonuses = childAttributeValueList("data-title", child.FirstChild)
					tech.Unlocks = childAttributeValueList("id", child.FirstChild)
				case "item":
					tech.Unlocks = append(tech.Unlocks, attributeValue("id", child))

				case "bonus":
					tech.Bonuses = append(tech.Bonuses, attributeValue("data-title", child))
				}
			}
			idx++
		}
		if tech.ID == "" {
			if attributeValue("id", dataDiv) == "start" {
				html.Render(os.Stderr, dataDiv)
			}
		} else {
			if len(tech.Prereqs) == 1 && tech.Prereqs[0] == "" {
				tech.Prereqs = []string{}
			}
			if len(tech.Unlocks) == 0 && strings.HasSuffix(tech.ID, "science-pack") {
				tech.Unlocks = []string{tech.ID}
			}
			for idx, unlock := range tech.Unlocks {
				tech.Unlocks[idx] = strings.ReplaceAll(unlock, "item_", "")
			}

			techInfoList = append(techInfoList, tech)
		}

		dataDiv = dataDiv.NextSibling
	}

	techTpl.Execute(os.Stdout, techInfoList)
}
