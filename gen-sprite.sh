glue-sprite data/technology src

jq -r '.icons[] | "." + .id, {width:"64px",height:"64px","background-position": .position} ' < data/data.json | sed "s/,/;/"  | sed 's/"//g'> src/icons.scss
go run src/scripts/genSVGSprites.go src/icons.scss > src/gen/svgIcons.tsx
