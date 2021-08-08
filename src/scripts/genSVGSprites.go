package main

import (
	"io/ioutil"
	"log"
	"os"
	"regexp"
	"text/template"
)

type SpriteInfo struct {
	Width       int
	Height      int
	SheetWidth  int
	SheetHeight int
	Name        string
	X           string
	Y           string
}

// const svgTplTxt = `
// {{- define "Symbol" -}}
//   <symbol id="{{.Name}}" viewBox="{{.X}} {{.Y}} {{.Width}} {{.Height}}" width="{{.Width}}" height="{{.Height}}">
//     <image width="{{.SheetWidth}}" height="{{.SheetHeight}}" href="https://user-images.githubusercontent.com/966048/82839453-1cb57500-9ed8-11ea-937f-458d9e57dd53.png" />
//   </symbol>
// {{- end -}}
// <svg className="mainBusHeader">
// {{range .}}{{template "Symbol" .}}
// {{end -}}
// </svg>`

const svgTplTxt = `
{{- define "Symbol" -}}
  ["{{.Name}}",(<symbol id="{{.Name}}" viewBox="{{.X}} {{.Y}} {{.Width}} {{.Height}}" width="{{.Width}}" height="{{.Height}}">
    <image width="{{.SheetWidth}}" height="{{.SheetHeight}}" href={svgIcons} x={0} y={0}/>
  </symbol>)],
{{- end -}}

import svgIcons from "../icons.png";
const IconSymbols = new Map([{{range .}}{{template "Symbol" .}}{{end -}}])

export const Icon = (name:string):JSX.Element=> {
const icon = IconSymbols.get(name)
if (!icon) throw new Error("No icon defined for " + name)
return icon
}
`

var svgTpl = template.Must(template.New("svg").Parse(svgTplTxt))

//.wooden-chest { width: 64px; height: 64px; background-position: 0px 0px; }
const (
	spriteSheetHeight = 960
	spriteSheetWidth  = 1024
	spriteHeight      = 64
	spriteWidth       = 64
)

var parseCssPattern = regexp.MustCompile(`(?s)(?:\.([-a-zA-Z0-9]+) {.*? background-position: -?(\d+)px -?(\d+)px.*?})+`)

func main() {
	if len(os.Args) < 2 {
		log.Fatalf("usage: %s <input filename>\n", os.Args[0])
	}
	css, err := ioutil.ReadFile(os.Args[1])
	if err != nil {
		log.Fatal(err)
	}

	var spriteInfoList []SpriteInfo
	for _, matchInfo := range parseCssPattern.FindAllStringSubmatch(string(css), -1) {
		spriteInfoList = append(spriteInfoList, SpriteInfo{
			Width:       spriteWidth,
			Height:      spriteHeight,
			SheetWidth:  spriteSheetWidth,
			SheetHeight: spriteSheetHeight,
			X:           matchInfo[2],
			Y:           matchInfo[3],
			Name:        matchInfo[1],
		})
	}
	svgTpl.Execute(os.Stdout, spriteInfoList)
}
