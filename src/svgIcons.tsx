import svgIcons from "./icon_sprite.png";
const IconSymbols = new Map([
  [
    "wooden-chest",
    <symbol id="wooden-chest" viewBox="0 0 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "iron-chest",
    <symbol id="iron-chest" viewBox="64 0 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "steel-chest",
    <symbol id="steel-chest" viewBox="128 0 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "storage-tank",
    <symbol id="storage-tank" viewBox="192 0 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "transport-belt",
    <symbol id="transport-belt" viewBox="256 0 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "fast-transport-belt",
    <symbol
      id="fast-transport-belt"
      viewBox="320 0 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "express-transport-belt",
    <symbol
      id="express-transport-belt"
      viewBox="384 0 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "underground-belt",
    <symbol id="underground-belt" viewBox="448 0 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "fast-underground-belt",
    <symbol
      id="fast-underground-belt"
      viewBox="512 0 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "express-underground-belt",
    <symbol
      id="express-underground-belt"
      viewBox="576 0 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "splitter",
    <symbol id="splitter" viewBox="640 0 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "fast-splitter",
    <symbol id="fast-splitter" viewBox="704 0 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "express-splitter",
    <symbol id="express-splitter" viewBox="768 0 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "burner-inserter",
    <symbol id="burner-inserter" viewBox="832 0 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "inserter",
    <symbol id="inserter" viewBox="896 0 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "long-handed-inserter",
    <symbol
      id="long-handed-inserter"
      viewBox="960 0 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "fast-inserter",
    <symbol id="fast-inserter" viewBox="0 64 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "filter-inserter",
    <symbol id="filter-inserter" viewBox="64 64 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "stack-inserter",
    <symbol id="stack-inserter" viewBox="128 64 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "stack-filter-inserter",
    <symbol
      id="stack-filter-inserter"
      viewBox="192 64 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "small-electric-pole",
    <symbol
      id="small-electric-pole"
      viewBox="256 64 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "medium-electric-pole",
    <symbol
      id="medium-electric-pole"
      viewBox="320 64 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "big-electric-pole",
    <symbol
      id="big-electric-pole"
      viewBox="384 64 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "substation",
    <symbol id="substation" viewBox="448 64 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "pipe",
    <symbol id="pipe" viewBox="512 64 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "pipe-to-ground",
    <symbol id="pipe-to-ground" viewBox="576 64 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "pump",
    <symbol id="pump" viewBox="640 64 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "rail",
    <symbol id="rail" viewBox="704 64 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "train-stop",
    <symbol id="train-stop" viewBox="768 64 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "rail-signal",
    <symbol id="rail-signal" viewBox="832 64 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "rail-chain-signal",
    <symbol
      id="rail-chain-signal"
      viewBox="896 64 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "locomotive",
    <symbol id="locomotive" viewBox="960 64 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "cargo-wagon",
    <symbol id="cargo-wagon" viewBox="0 128 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "fluid-wagon",
    <symbol id="fluid-wagon" viewBox="64 128 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "artillery-wagon",
    <symbol id="artillery-wagon" viewBox="128 128 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "car",
    <symbol id="car" viewBox="192 128 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "tank",
    <symbol id="tank" viewBox="256 128 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "logistic-robot",
    <symbol id="logistic-robot" viewBox="320 128 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "construction-robot",
    <symbol
      id="construction-robot"
      viewBox="384 128 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "logistic-chest-active-provider",
    <symbol
      id="logistic-chest-active-provider"
      viewBox="448 128 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "logistic-chest-passive-provider",
    <symbol
      id="logistic-chest-passive-provider"
      viewBox="512 128 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "logistic-chest-storage",
    <symbol
      id="logistic-chest-storage"
      viewBox="576 128 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "logistic-chest-buffer",
    <symbol
      id="logistic-chest-buffer"
      viewBox="640 128 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "logistic-chest-requester",
    <symbol
      id="logistic-chest-requester"
      viewBox="704 128 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "roboport",
    <symbol id="roboport" viewBox="768 128 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "small-lamp",
    <symbol id="small-lamp" viewBox="832 128 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "red-wire",
    <symbol id="red-wire" viewBox="896 128 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "green-wire",
    <symbol id="green-wire" viewBox="960 128 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "arithmetic-combinator",
    <symbol
      id="arithmetic-combinator"
      viewBox="0 192 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "decider-combinator",
    <symbol
      id="decider-combinator"
      viewBox="64 192 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "constant-combinator",
    <symbol
      id="constant-combinator"
      viewBox="128 192 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "power-switch",
    <symbol id="power-switch" viewBox="192 192 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "programmable-speaker",
    <symbol
      id="programmable-speaker"
      viewBox="256 192 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "stone-brick",
    <symbol id="stone-brick" viewBox="320 192 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "concrete",
    <symbol id="concrete" viewBox="384 192 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "hazard-concrete",
    <symbol id="hazard-concrete" viewBox="448 192 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "refined-concrete",
    <symbol
      id="refined-concrete"
      viewBox="512 192 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "refined-hazard-concrete",
    <symbol
      id="refined-hazard-concrete"
      viewBox="576 192 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "landfill",
    <symbol id="landfill" viewBox="640 192 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "cliff-explosives",
    <symbol
      id="cliff-explosives"
      viewBox="704 192 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "repair-pack",
    <symbol id="repair-pack" viewBox="768 192 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "boiler",
    <symbol id="boiler" viewBox="832 192 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "steam-engine",
    <symbol id="steam-engine" viewBox="896 192 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "solar-panel",
    <symbol id="solar-panel" viewBox="960 192 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "accumulator",
    <symbol id="accumulator" viewBox="0 256 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "nuclear-reactor",
    <symbol id="nuclear-reactor" viewBox="64 256 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "heat-pipe",
    <symbol id="heat-pipe" viewBox="128 256 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "heat-exchanger",
    <symbol id="heat-exchanger" viewBox="192 256 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "steam-turbine",
    <symbol id="steam-turbine" viewBox="256 256 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "burner-mining-drill",
    <symbol
      id="burner-mining-drill"
      viewBox="320 256 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "electric-mining-drill",
    <symbol
      id="electric-mining-drill"
      viewBox="384 256 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "offshore-pump",
    <symbol id="offshore-pump" viewBox="448 256 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "pumpjack",
    <symbol id="pumpjack" viewBox="512 256 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "stone-furnace",
    <symbol id="stone-furnace" viewBox="576 256 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "steel-furnace",
    <symbol id="steel-furnace" viewBox="640 256 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "electric-furnace",
    <symbol
      id="electric-furnace"
      viewBox="704 256 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "assembling-machine-1",
    <symbol
      id="assembling-machine-1"
      viewBox="768 256 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "assembling-machine-2",
    <symbol
      id="assembling-machine-2"
      viewBox="832 256 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "assembling-machine-3",
    <symbol
      id="assembling-machine-3"
      viewBox="896 256 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "oil-refinery",
    <symbol id="oil-refinery" viewBox="960 256 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "chemical-plant",
    <symbol id="chemical-plant" viewBox="0 320 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "centrifuge",
    <symbol id="centrifuge" viewBox="64 320 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "lab",
    <symbol id="lab" viewBox="128 320 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "beacon",
    <symbol id="beacon" viewBox="192 320 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "speed-module",
    <symbol id="speed-module" viewBox="256 320 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "speed-module-2",
    <symbol id="speed-module-2" viewBox="320 320 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "speed-module-3",
    <symbol id="speed-module-3" viewBox="384 320 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "effectivity-module",
    <symbol
      id="effectivity-module"
      viewBox="448 320 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "effectivity-module-2",
    <symbol
      id="effectivity-module-2"
      viewBox="512 320 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "effectivity-module-3",
    <symbol
      id="effectivity-module-3"
      viewBox="576 320 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "productivity-module",
    <symbol
      id="productivity-module"
      viewBox="640 320 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "productivity-module-2",
    <symbol
      id="productivity-module-2"
      viewBox="704 320 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "productivity-module-3",
    <symbol
      id="productivity-module-3"
      viewBox="768 320 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "sulfuric-acid",
    <symbol id="sulfuric-acid" viewBox="832 320 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "basic-oil-processing",
    <symbol
      id="basic-oil-processing"
      viewBox="896 320 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "advanced-oil-processing",
    <symbol
      id="advanced-oil-processing"
      viewBox="960 320 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "coal-liquefaction",
    <symbol id="coal-liquefaction" viewBox="0 384 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "heavy-oil-cracking",
    <symbol
      id="heavy-oil-cracking"
      viewBox="64 384 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "light-oil-cracking",
    <symbol
      id="light-oil-cracking"
      viewBox="128 384 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "solid-fuel-from-light-oil",
    <symbol
      id="solid-fuel-from-light-oil"
      viewBox="192 384 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "solid-fuel-from-petroleum-gas",
    <symbol
      id="solid-fuel-from-petroleum-gas"
      viewBox="256 384 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "solid-fuel-from-heavy-oil",
    <symbol
      id="solid-fuel-from-heavy-oil"
      viewBox="320 384 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "lubricant",
    <symbol id="lubricant" viewBox="384 384 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "iron-plate",
    <symbol id="iron-plate" viewBox="448 384 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "copper-plate",
    <symbol id="copper-plate" viewBox="512 384 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "steel-plate",
    <symbol id="steel-plate" viewBox="576 384 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "plastic-bar",
    <symbol id="plastic-bar" viewBox="640 384 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "sulfur",
    <symbol id="sulfur" viewBox="704 384 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "battery",
    <symbol id="battery" viewBox="768 384 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "explosives",
    <symbol id="explosives" viewBox="832 384 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "uranium-processing",
    <symbol
      id="uranium-processing"
      viewBox="896 384 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "fill-crude-oil-barrel",
    <symbol
      id="fill-crude-oil-barrel"
      viewBox="960 384 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "fill-heavy-oil-barrel",
    <symbol
      id="fill-heavy-oil-barrel"
      viewBox="0 448 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "fill-light-oil-barrel",
    <symbol
      id="fill-light-oil-barrel"
      viewBox="64 448 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "fill-lubricant-barrel",
    <symbol
      id="fill-lubricant-barrel"
      viewBox="128 448 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "fill-petroleum-gas-barrel",
    <symbol
      id="fill-petroleum-gas-barrel"
      viewBox="192 448 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "fill-sulfuric-acid-barrel",
    <symbol
      id="fill-sulfuric-acid-barrel"
      viewBox="256 448 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "fill-water-barrel",
    <symbol
      id="fill-water-barrel"
      viewBox="320 448 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "empty-crude-oil-barrel",
    <symbol
      id="empty-crude-oil-barrel"
      viewBox="384 448 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "empty-heavy-oil-barrel",
    <symbol
      id="empty-heavy-oil-barrel"
      viewBox="448 448 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "empty-light-oil-barrel",
    <symbol
      id="empty-light-oil-barrel"
      viewBox="512 448 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "empty-lubricant-barrel",
    <symbol
      id="empty-lubricant-barrel"
      viewBox="576 448 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "empty-petroleum-gas-barrel",
    <symbol
      id="empty-petroleum-gas-barrel"
      viewBox="640 448 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "empty-sulfuric-acid-barrel",
    <symbol
      id="empty-sulfuric-acid-barrel"
      viewBox="704 448 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "empty-water-barrel",
    <symbol
      id="empty-water-barrel"
      viewBox="768 448 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "copper-cable",
    <symbol id="copper-cable" viewBox="832 448 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "iron-stick",
    <symbol id="iron-stick" viewBox="896 448 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "iron-gear-wheel",
    <symbol id="iron-gear-wheel" viewBox="960 448 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "empty-barrel",
    <symbol id="empty-barrel" viewBox="0 512 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "electronic-circuit",
    <symbol
      id="electronic-circuit"
      viewBox="64 512 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "advanced-circuit",
    <symbol
      id="advanced-circuit"
      viewBox="128 512 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "processing-unit",
    <symbol id="processing-unit" viewBox="192 512 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "engine-unit",
    <symbol id="engine-unit" viewBox="256 512 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "electric-engine-unit",
    <symbol
      id="electric-engine-unit"
      viewBox="320 512 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "flying-robot-frame",
    <symbol
      id="flying-robot-frame"
      viewBox="384 512 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "satellite",
    <symbol id="satellite" viewBox="448 512 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "rocket-control-unit",
    <symbol
      id="rocket-control-unit"
      viewBox="512 512 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "low-density-structure",
    <symbol
      id="low-density-structure"
      viewBox="576 512 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "rocket-fuel",
    <symbol id="rocket-fuel" viewBox="640 512 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "nuclear-fuel",
    <symbol id="nuclear-fuel" viewBox="704 512 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "uranium-fuel-cell",
    <symbol
      id="uranium-fuel-cell"
      viewBox="768 512 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "nuclear-fuel-reprocessing",
    <symbol
      id="nuclear-fuel-reprocessing"
      viewBox="832 512 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "kovarex-enrichment-process",
    <symbol
      id="kovarex-enrichment-process"
      viewBox="896 512 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "automation-science-pack",
    <symbol
      id="automation-science-pack"
      viewBox="960 512 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "logistic-science-pack",
    <symbol
      id="logistic-science-pack"
      viewBox="0 576 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "military-science-pack",
    <symbol
      id="military-science-pack"
      viewBox="64 576 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "chemical-science-pack",
    <symbol
      id="chemical-science-pack"
      viewBox="128 576 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "production-science-pack",
    <symbol
      id="production-science-pack"
      viewBox="192 576 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "utility-science-pack",
    <symbol
      id="utility-science-pack"
      viewBox="256 576 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "pistol",
    <symbol id="pistol" viewBox="320 576 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "submachine-gun",
    <symbol id="submachine-gun" viewBox="384 576 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "shotgun",
    <symbol id="shotgun" viewBox="448 576 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "combat-shotgun",
    <symbol id="combat-shotgun" viewBox="512 576 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "rocket-launcher",
    <symbol id="rocket-launcher" viewBox="576 576 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "flamethrower",
    <symbol id="flamethrower" viewBox="640 576 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "land-mine",
    <symbol id="land-mine" viewBox="704 576 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "firearm-magazine",
    <symbol
      id="firearm-magazine"
      viewBox="768 576 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "piercing-rounds-magazine",
    <symbol
      id="piercing-rounds-magazine"
      viewBox="832 576 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "uranium-rounds-magazine",
    <symbol
      id="uranium-rounds-magazine"
      viewBox="896 576 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "shotgun-shell",
    <symbol id="shotgun-shell" viewBox="960 576 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "piercing-shotgun-shell",
    <symbol
      id="piercing-shotgun-shell"
      viewBox="0 640 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "cannon-shell",
    <symbol id="cannon-shell" viewBox="64 640 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "explosive-cannon-shell",
    <symbol
      id="explosive-cannon-shell"
      viewBox="128 640 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "uranium-cannon-shell",
    <symbol
      id="uranium-cannon-shell"
      viewBox="192 640 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "explosive-uranium-cannon-shell",
    <symbol
      id="explosive-uranium-cannon-shell"
      viewBox="256 640 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "artillery-shell",
    <symbol id="artillery-shell" viewBox="320 640 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "rocket",
    <symbol id="rocket" viewBox="384 640 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "explosive-rocket",
    <symbol
      id="explosive-rocket"
      viewBox="448 640 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "atomic-bomb",
    <symbol id="atomic-bomb" viewBox="512 640 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "flamethrower-ammo",
    <symbol
      id="flamethrower-ammo"
      viewBox="576 640 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "grenade",
    <symbol id="grenade" viewBox="640 640 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "cluster-grenade",
    <symbol id="cluster-grenade" viewBox="704 640 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "poison-capsule",
    <symbol id="poison-capsule" viewBox="768 640 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "slowdown-capsule",
    <symbol
      id="slowdown-capsule"
      viewBox="832 640 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "defender-capsule",
    <symbol
      id="defender-capsule"
      viewBox="896 640 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "distractor-capsule",
    <symbol
      id="distractor-capsule"
      viewBox="960 640 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "destroyer-capsule",
    <symbol id="destroyer-capsule" viewBox="0 704 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "discharge-defense-remote",
    <symbol
      id="discharge-defense-remote"
      viewBox="64 704 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "artillery-targeting-remote",
    <symbol
      id="artillery-targeting-remote"
      viewBox="128 704 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "light-armor",
    <symbol id="light-armor" viewBox="192 704 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "heavy-armor",
    <symbol id="heavy-armor" viewBox="256 704 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "modular-armor",
    <symbol id="modular-armor" viewBox="320 704 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "power-armor",
    <symbol id="power-armor" viewBox="384 704 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "power-armor-mk2",
    <symbol id="power-armor-mk2" viewBox="448 704 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "solar-panel-equipment",
    <symbol
      id="solar-panel-equipment"
      viewBox="512 704 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "fusion-reactor-equipment",
    <symbol
      id="fusion-reactor-equipment"
      viewBox="576 704 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "energy-shield-equipment",
    <symbol
      id="energy-shield-equipment"
      viewBox="640 704 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "energy-shield-mk2-equipment",
    <symbol
      id="energy-shield-mk2-equipment"
      viewBox="704 704 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "battery-equipment",
    <symbol
      id="battery-equipment"
      viewBox="768 704 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "battery-mk2-equipment",
    <symbol
      id="battery-mk2-equipment"
      viewBox="832 704 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "personal-laser-defense-equipment",
    <symbol
      id="personal-laser-defense-equipment"
      viewBox="896 704 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "discharge-defense-equipment",
    <symbol
      id="discharge-defense-equipment"
      viewBox="960 704 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "belt-immunity-equipment",
    <symbol
      id="belt-immunity-equipment"
      viewBox="0 768 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "exoskeleton-equipment",
    <symbol
      id="exoskeleton-equipment"
      viewBox="64 768 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "personal-roboport-equipment",
    <symbol
      id="personal-roboport-equipment"
      viewBox="128 768 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "personal-roboport-mk2-equipment",
    <symbol
      id="personal-roboport-mk2-equipment"
      viewBox="192 768 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "night-vision-equipment",
    <symbol
      id="night-vision-equipment"
      viewBox="256 768 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "stone-wall",
    <symbol id="stone-wall" viewBox="320 768 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "gate",
    <symbol id="gate" viewBox="384 768 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "gun-turret",
    <symbol id="gun-turret" viewBox="448 768 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "laser-turret",
    <symbol id="laser-turret" viewBox="512 768 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "flamethrower-turret",
    <symbol
      id="flamethrower-turret"
      viewBox="576 768 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "artillery-turret",
    <symbol
      id="artillery-turret"
      viewBox="640 768 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "radar",
    <symbol id="radar" viewBox="704 768 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "rocket-silo",
    <symbol id="rocket-silo" viewBox="768 768 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "wood",
    <symbol id="wood" viewBox="832 768 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "coal",
    <symbol id="coal" viewBox="896 768 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "stone",
    <symbol id="stone" viewBox="960 768 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "iron-ore",
    <symbol id="iron-ore" viewBox="0 832 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "copper-ore",
    <symbol id="copper-ore" viewBox="64 832 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "uranium-ore",
    <symbol id="uranium-ore" viewBox="128 832 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "raw-fish",
    <symbol id="raw-fish" viewBox="192 832 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "solid-fuel",
    <symbol id="solid-fuel" viewBox="256 832 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "crude-oil-barrel",
    <symbol
      id="crude-oil-barrel"
      viewBox="320 832 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "heavy-oil-barrel",
    <symbol
      id="heavy-oil-barrel"
      viewBox="384 832 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "light-oil-barrel",
    <symbol
      id="light-oil-barrel"
      viewBox="448 832 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "lubricant-barrel",
    <symbol
      id="lubricant-barrel"
      viewBox="512 832 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "petroleum-gas-barrel",
    <symbol
      id="petroleum-gas-barrel"
      viewBox="576 832 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "sulfuric-acid-barrel",
    <symbol
      id="sulfuric-acid-barrel"
      viewBox="640 832 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "water-barrel",
    <symbol id="water-barrel" viewBox="704 832 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "uranium-235",
    <symbol id="uranium-235" viewBox="768 832 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "uranium-238",
    <symbol id="uranium-238" viewBox="832 832 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "used-up-uranium-fuel-cell",
    <symbol
      id="used-up-uranium-fuel-cell"
      viewBox="896 832 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "space-science-pack",
    <symbol
      id="space-science-pack"
      viewBox="960 832 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "water",
    <symbol id="water" viewBox="0 896 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "crude-oil",
    <symbol id="crude-oil" viewBox="64 896 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "steam",
    <symbol id="steam" viewBox="128 896 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "heavy-oil",
    <symbol id="heavy-oil" viewBox="192 896 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "light-oil",
    <symbol id="light-oil" viewBox="256 896 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "petroleum-gas",
    <symbol id="petroleum-gas" viewBox="320 896 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "module",
    <symbol id="module" viewBox="384 896 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "time",
    <symbol id="time" viewBox="448 896 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "logistics",
    <symbol id="logistics" viewBox="0 960 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "production",
    <symbol id="production" viewBox="128 960 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "combat",
    <symbol id="combat" viewBox="256 960 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "intermediate-products",
    <symbol
      id="intermediate-products"
      viewBox="384 960 64 64"
      width="64"
      height="64"
    >
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
  [
    "fluids",
    <symbol id="fluids" viewBox="512 960 64 64" width="64" height="64">
      <image width="1024" height="1088" href={svgIcons} x={0} y={0} />
    </symbol>,
  ],
]);

export const Icon = (name: string): JSX.Element => {
  const icon = IconSymbols.get(name);
  if (!icon) throw new Error("No icon defined for " + name);
  return icon;
};
