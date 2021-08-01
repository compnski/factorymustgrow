package main

import (
	"io/ioutil"
	"log"
	"os"
	"regexp"
	"strconv"
	"strings"
	"text/template"
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

//var parseCssPattern = regexp.MustCompile(`(?:\.([-a-zA-Z0-9]+) {.*? background-position: -?(\d+)px -?(\d+)px; })+`)

var (
	unlockedItemGroup  = `(?:<div class="item" id="item_(.*?)".+?><\/div>)?`
	unlockedBonusGroup = `(?:<div class="bonus" data-title="(.*?)"><\/div>)?`
	techInfo           = `<div id="(.+?)" class="tech L(.+?)" style=".+?" data-prereqs="(.*?)" data-title="(.+?)" data-ingredients="(.+?)"`
	imageInfo          = `<img class="pic" src="graphics/technology/(.+?).png" \/>`
)
var parseHTMLPattern = regexp.MustCompile(techInfo + `.+?>` + imageInfo + `.+?>` +
	strings.Repeat(unlockedItemGroup, 10) +
	strings.Repeat(unlockedBonusGroup, 10) +
	`</div>`)

func parseFloatOrZero(s string) float32 {
	n, _ := strconv.ParseFloat(s, 32)
	return float32(n)
}

func listOfPairsToEntityStackAndTime(pairs string) (ret []EntityStack, researchTime, productionRequired float32) {
	splitPairs := strings.Split(pairs, ",")
	for i := 0; i < len(splitPairs); i += 2 {
		if splitPairs[i] == "time" {
			researchTime = parseFloatOrZero(splitPairs[i+1])
		} else {
			productionRequired = parseFloatOrZero(splitPairs[i+1])
			ret = append(ret, EntityStack{Entity: splitPairs[i],
				Count: 1})
		}
	}
	return
}

func main() {
	if len(os.Args) < 2 {
		log.Fatalf("usage: %s <input filename>\n", os.Args[0])
	}
	css, err := ioutil.ReadFile(os.Args[1])
	if err != nil {
		log.Fatal(err)
	}
	log.Print(techInfo + `.+?>` +
		strings.Repeat(unlockedItemGroup, 10) +
		strings.Repeat(unlockedBonusGroup, 10) +
		`.+?</div>`)

	var techInfoList []TechInfo
	for _, matchInfo := range parseHTMLPattern.FindAllStringSubmatch(string(css), -1) {
		ingredients, researchTime, productionRequired := listOfPairsToEntityStackAndTime(matchInfo[5])
		tech := TechInfo{
			ID:                              matchInfo[1],
			Name:                            matchInfo[4],
			Row:                             parseFloatOrZero(matchInfo[2]),
			Icon:                            matchInfo[6],
			Ingredients:                     ingredients,
			Prereqs:                         strings.Split(matchInfo[3], ","),
			Unlocks:                         matchInfo[7:17],
			Bonuses:                         matchInfo[17:27],
			DurationSeconds:                 researchTime,
			ProductionPerTick:               1 / researchTime,
			ProductionRequiredForCompletion: productionRequired,
		}
		if len(tech.Prereqs) == 1 && tech.Prereqs[0] == "" {
			tech.Prereqs = []string{}
		}
		techInfoList = append(techInfoList, tech)
		log.Printf("%+v", matchInfo[1:])
	}
	techTpl.Execute(os.Stdout, techInfoList)
}
