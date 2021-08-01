import { Recipe, Entity } from "../types";
import { Map } from "immutable";

export function GetEntity(name: string): Entity {
  return Entities.get(name)!;
}

export function GetRecipe(name: string): Recipe {
  return Recipes.get(name)!;
}
export const Entities: Map<string, Entity> = Map({
  "wooden-chest": {
    Name: "Wooden chest",
    Id: "wooden-chest",
    Icon: "wooden-chest",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "iron-chest": {
    Name: "Iron chest",
    Id: "iron-chest",
    Icon: "iron-chest",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "steel-chest": {
    Name: "Steel chest",
    Id: "steel-chest",
    Icon: "steel-chest",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "storage-tank": {
    Name: "Storage tank",
    Id: "storage-tank",
    Icon: "storage-tank",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "transport-belt": {
    Name: "Transport belt",
    Id: "transport-belt",
    Icon: "transport-belt",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "fast-transport-belt": {
    Name: "Fast transport belt",
    Id: "fast-transport-belt",
    Icon: "fast-transport-belt",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "express-transport-belt": {
    Name: "Express transport belt",
    Id: "express-transport-belt",
    Icon: "express-transport-belt",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "underground-belt": {
    Name: "Underground belt",
    Id: "underground-belt",
    Icon: "underground-belt",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "fast-underground-belt": {
    Name: "Fast underground belt",
    Id: "fast-underground-belt",
    Icon: "fast-underground-belt",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "express-underground-belt": {
    Name: "Express underground belt",
    Id: "express-underground-belt",
    Icon: "express-underground-belt",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  splitter: {
    Name: "Splitter",
    Id: "splitter",
    Icon: "splitter",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "fast-splitter": {
    Name: "Fast splitter",
    Id: "fast-splitter",
    Icon: "fast-splitter",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "express-splitter": {
    Name: "Express splitter",
    Id: "express-splitter",
    Icon: "express-splitter",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "burner-inserter": {
    Name: "Burner inserter",
    Id: "burner-inserter",
    Icon: "burner-inserter",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  inserter: {
    Name: "Inserter",
    Id: "inserter",
    Icon: "inserter",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "long-handed-inserter": {
    Name: "Long handed inserter",
    Id: "long-handed-inserter",
    Icon: "long-handed-inserter",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "fast-inserter": {
    Name: "Fast inserter",
    Id: "fast-inserter",
    Icon: "fast-inserter",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "filter-inserter": {
    Name: "Filter inserter",
    Id: "filter-inserter",
    Icon: "filter-inserter",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "stack-inserter": {
    Name: "Stack inserter",
    Id: "stack-inserter",
    Icon: "stack-inserter",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "stack-filter-inserter": {
    Name: "Stack filter inserter",
    Id: "stack-filter-inserter",
    Icon: "stack-filter-inserter",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "small-electric-pole": {
    Name: "Small electric pole",
    Id: "small-electric-pole",
    Icon: "small-electric-pole",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "medium-electric-pole": {
    Name: "Medium electric pole",
    Id: "medium-electric-pole",
    Icon: "medium-electric-pole",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "big-electric-pole": {
    Name: "Big electric pole",
    Id: "big-electric-pole",
    Icon: "big-electric-pole",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  substation: {
    Name: "Substation",
    Id: "substation",
    Icon: "substation",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  pipe: {
    Name: "Pipe",
    Id: "pipe",
    Icon: "pipe",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "pipe-to-ground": {
    Name: "Pipe to ground",
    Id: "pipe-to-ground",
    Icon: "pipe-to-ground",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  pump: {
    Name: "Pump",
    Id: "pump",
    Icon: "pump",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  rail: {
    Name: "Rail",
    Id: "rail",
    Icon: "rail",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "train-stop": {
    Name: "Train stop",
    Id: "train-stop",
    Icon: "train-stop",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "rail-signal": {
    Name: "Rail signal",
    Id: "rail-signal",
    Icon: "rail-signal",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "rail-chain-signal": {
    Name: "Rail chain signal",
    Id: "rail-chain-signal",
    Icon: "rail-chain-signal",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  locomotive: {
    Name: "Locomotive",
    Id: "locomotive",
    Icon: "locomotive",
    StackSize: 5,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "cargo-wagon": {
    Name: "Cargo wagon",
    Id: "cargo-wagon",
    Icon: "cargo-wagon",
    StackSize: 5,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "fluid-wagon": {
    Name: "Fluid wagon",
    Id: "fluid-wagon",
    Icon: "fluid-wagon",
    StackSize: 5,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "artillery-wagon": {
    Name: "Artillery wagon",
    Id: "artillery-wagon",
    Icon: "artillery-wagon",
    StackSize: 5,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  car: {
    Name: "Car",
    Id: "car",
    Icon: "car",
    StackSize: 1,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  tank: {
    Name: "Tank",
    Id: "tank",
    Icon: "tank",
    StackSize: 1,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "logistic-robot": {
    Name: "Logistic robot",
    Id: "logistic-robot",
    Icon: "logistic-robot",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "construction-robot": {
    Name: "Construction robot",
    Id: "construction-robot",
    Icon: "construction-robot",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "logistic-chest-active-provider": {
    Name: "Active provider chest",
    Id: "logistic-chest-active-provider",
    Icon: "logistic-chest-active-provider",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "logistic-chest-passive-provider": {
    Name: "Passive provider chest",
    Id: "logistic-chest-passive-provider",
    Icon: "logistic-chest-passive-provider",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "logistic-chest-storage": {
    Name: "Storage chest",
    Id: "logistic-chest-storage",
    Icon: "logistic-chest-storage",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "logistic-chest-buffer": {
    Name: "Buffer chest",
    Id: "logistic-chest-buffer",
    Icon: "logistic-chest-buffer",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "logistic-chest-requester": {
    Name: "Requester chest",
    Id: "logistic-chest-requester",
    Icon: "logistic-chest-requester",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  roboport: {
    Name: "Roboport",
    Id: "roboport",
    Icon: "roboport",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "small-lamp": {
    Name: "Lamp",
    Id: "small-lamp",
    Icon: "small-lamp",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "red-wire": {
    Name: "Red wire",
    Id: "red-wire",
    Icon: "red-wire",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "green-wire": {
    Name: "Green wire",
    Id: "green-wire",
    Icon: "green-wire",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "arithmetic-combinator": {
    Name: "Arithmetic combinator",
    Id: "arithmetic-combinator",
    Icon: "arithmetic-combinator",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "decider-combinator": {
    Name: "Decider combinator",
    Id: "decider-combinator",
    Icon: "decider-combinator",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "constant-combinator": {
    Name: "Constant combinator",
    Id: "constant-combinator",
    Icon: "constant-combinator",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "power-switch": {
    Name: "Power switch",
    Id: "power-switch",
    Icon: "power-switch",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "programmable-speaker": {
    Name: "Programmable speaker",
    Id: "programmable-speaker",
    Icon: "programmable-speaker",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "stone-brick": {
    Name: "Stone brick",
    Id: "stone-brick",
    Icon: "stone-brick",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  concrete: {
    Name: "Concrete",
    Id: "concrete",
    Icon: "concrete",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "hazard-concrete": {
    Name: "Hazard concrete",
    Id: "hazard-concrete",
    Icon: "hazard-concrete",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "refined-concrete": {
    Name: "Refined concrete",
    Id: "refined-concrete",
    Icon: "refined-concrete",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "refined-hazard-concrete": {
    Name: "Refined hazard concrete",
    Id: "refined-hazard-concrete",
    Icon: "refined-hazard-concrete",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  landfill: {
    Name: "Landfill",
    Id: "landfill",
    Icon: "landfill",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "cliff-explosives": {
    Name: "Cliff explosives",
    Id: "cliff-explosives",
    Icon: "cliff-explosives",
    StackSize: 20,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "repair-pack": {
    Name: "Repair pack",
    Id: "repair-pack",
    Icon: "repair-pack",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  boiler: {
    Name: "Boiler",
    Id: "boiler",
    Icon: "boiler",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "steam-engine": {
    Name: "Steam engine",
    Id: "steam-engine",
    Icon: "steam-engine",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "solar-panel": {
    Name: "Solar panel",
    Id: "solar-panel",
    Icon: "solar-panel",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  accumulator: {
    Name: "Accumulator",
    Id: "accumulator",
    Icon: "accumulator",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "nuclear-reactor": {
    Name: "Nuclear reactor",
    Id: "nuclear-reactor",
    Icon: "nuclear-reactor",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "heat-pipe": {
    Name: "Heat pipe",
    Id: "heat-pipe",
    Icon: "heat-pipe",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "heat-exchanger": {
    Name: "Heat exchanger",
    Id: "heat-exchanger",
    Icon: "heat-exchanger",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "steam-turbine": {
    Name: "Steam turbine",
    Id: "steam-turbine",
    Icon: "steam-turbine",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "burner-mining-drill": {
    Name: "Burner mining drill",
    Id: "burner-mining-drill",
    Icon: "burner-mining-drill",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "electric-mining-drill": {
    Name: "Electric mining drill",
    Id: "electric-mining-drill",
    Icon: "electric-mining-drill",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "offshore-pump": {
    Name: "Offshore pump",
    Id: "offshore-pump",
    Icon: "offshore-pump",
    StackSize: 20,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  pumpjack: {
    Name: "Pumpjack",
    Id: "pumpjack",
    Icon: "pumpjack",
    StackSize: 20,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "stone-furnace": {
    Name: "Stone furnace",
    Id: "stone-furnace",
    Icon: "stone-furnace",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "steel-furnace": {
    Name: "Steel furnace",
    Id: "steel-furnace",
    Icon: "steel-furnace",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "electric-furnace": {
    Name: "Electric furnace",
    Id: "electric-furnace",
    Icon: "electric-furnace",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "assembling-machine-1": {
    Name: "Assembling machine 1",
    Id: "assembling-machine-1",
    Icon: "assembling-machine-1",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "assembling-machine-2": {
    Name: "Assembling machine 2",
    Id: "assembling-machine-2",
    Icon: "assembling-machine-2",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "assembling-machine-3": {
    Name: "Assembling machine 3",
    Id: "assembling-machine-3",
    Icon: "assembling-machine-3",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "oil-refinery": {
    Name: "Oil refinery",
    Id: "oil-refinery",
    Icon: "oil-refinery",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "chemical-plant": {
    Name: "Chemical plant",
    Id: "chemical-plant",
    Icon: "chemical-plant",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  centrifuge: {
    Name: "Centrifuge",
    Id: "centrifuge",
    Icon: "centrifuge",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  lab: {
    Name: "Lab",
    Id: "lab",
    Icon: "lab",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  beacon: {
    Name: "Beacon",
    Id: "beacon",
    Icon: "beacon",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "speed-module": {
    Name: "Speed module",
    Id: "speed-module",
    Icon: "speed-module",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "speed-module-2": {
    Name: "Speed module 2",
    Id: "speed-module-2",
    Icon: "speed-module-2",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "speed-module-3": {
    Name: "Speed module 3",
    Id: "speed-module-3",
    Icon: "speed-module-3",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "effectivity-module": {
    Name: "Efficiency module",
    Id: "effectivity-module",
    Icon: "effectivity-module",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "effectivity-module-2": {
    Name: "Efficiency module 2",
    Id: "effectivity-module-2",
    Icon: "effectivity-module-2",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "effectivity-module-3": {
    Name: "Efficiency module 3",
    Id: "effectivity-module-3",
    Icon: "effectivity-module-3",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "productivity-module": {
    Name: "Productivity module",
    Id: "productivity-module",
    Icon: "productivity-module",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "productivity-module-2": {
    Name: "Productivity module 2",
    Id: "productivity-module-2",
    Icon: "productivity-module-2",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "productivity-module-3": {
    Name: "Productivity module 3",
    Id: "productivity-module-3",
    Icon: "productivity-module-3",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  wood: {
    Name: "Wood",
    Id: "wood",
    Icon: "wood",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  coal: {
    Name: "Coal",
    Id: "coal",
    Icon: "coal",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  stone: {
    Name: "Stone",
    Id: "stone",
    Icon: "stone",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "iron-ore": {
    Name: "Iron ore",
    Id: "iron-ore",
    Icon: "iron-ore",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "copper-ore": {
    Name: "Copper ore",
    Id: "copper-ore",
    Icon: "copper-ore",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "uranium-ore": {
    Name: "Uranium ore",
    Id: "uranium-ore",
    Icon: "uranium-ore",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "raw-fish": {
    Name: "Raw fish",
    Id: "raw-fish",
    Icon: "raw-fish",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "iron-plate": {
    Name: "Iron plate",
    Id: "iron-plate",
    Icon: "iron-plate",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "copper-plate": {
    Name: "Copper plate",
    Id: "copper-plate",
    Icon: "copper-plate",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "solid-fuel": {
    Name: "Solid fuel",
    Id: "solid-fuel",
    Icon: "solid-fuel",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "steel-plate": {
    Name: "Steel plate",
    Id: "steel-plate",
    Icon: "steel-plate",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "plastic-bar": {
    Name: "Plastic bar",
    Id: "plastic-bar",
    Icon: "plastic-bar",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  sulfur: {
    Name: "Sulfur",
    Id: "sulfur",
    Icon: "sulfur",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  battery: {
    Name: "Battery",
    Id: "battery",
    Icon: "battery",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  explosives: {
    Name: "Explosives",
    Id: "explosives",
    Icon: "explosives",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "crude-oil-barrel": {
    Name: "Crude oil barrel",
    Id: "crude-oil-barrel",
    Icon: "crude-oil-barrel",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "heavy-oil-barrel": {
    Name: "Heavy oil barrel",
    Id: "heavy-oil-barrel",
    Icon: "heavy-oil-barrel",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "light-oil-barrel": {
    Name: "Light oil barrel",
    Id: "light-oil-barrel",
    Icon: "light-oil-barrel",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "lubricant-barrel": {
    Name: "Lubricant barrel",
    Id: "lubricant-barrel",
    Icon: "lubricant-barrel",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "petroleum-gas-barrel": {
    Name: "Petroleum gas barrel",
    Id: "petroleum-gas-barrel",
    Icon: "petroleum-gas-barrel",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "sulfuric-acid-barrel": {
    Name: "Sulfuric acid barrel",
    Id: "sulfuric-acid-barrel",
    Icon: "sulfuric-acid-barrel",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "water-barrel": {
    Name: "Water barrel",
    Id: "water-barrel",
    Icon: "water-barrel",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "copper-cable": {
    Name: "Copper cable",
    Id: "copper-cable",
    Icon: "copper-cable",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "iron-stick": {
    Name: "Iron stick",
    Id: "iron-stick",
    Icon: "iron-stick",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "iron-gear-wheel": {
    Name: "Iron gear wheel",
    Id: "iron-gear-wheel",
    Icon: "iron-gear-wheel",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "empty-barrel": {
    Name: "Empty barrel",
    Id: "empty-barrel",
    Icon: "empty-barrel",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "electronic-circuit": {
    Name: "Electronic circuit",
    Id: "electronic-circuit",
    Icon: "electronic-circuit",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "advanced-circuit": {
    Name: "Advanced circuit",
    Id: "advanced-circuit",
    Icon: "advanced-circuit",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "processing-unit": {
    Name: "Processing unit",
    Id: "processing-unit",
    Icon: "processing-unit",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "engine-unit": {
    Name: "Engine unit",
    Id: "engine-unit",
    Icon: "engine-unit",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "electric-engine-unit": {
    Name: "Electric engine unit",
    Id: "electric-engine-unit",
    Icon: "electric-engine-unit",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "flying-robot-frame": {
    Name: "Flying robot frame",
    Id: "flying-robot-frame",
    Icon: "flying-robot-frame",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  satellite: {
    Name: "Satellite",
    Id: "satellite",
    Icon: "satellite",
    StackSize: 1,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "rocket-control-unit": {
    Name: "Rocket control unit",
    Id: "rocket-control-unit",
    Icon: "rocket-control-unit",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "low-density-structure": {
    Name: "Low density structure",
    Id: "low-density-structure",
    Icon: "low-density-structure",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "rocket-fuel": {
    Name: "Rocket fuel",
    Id: "rocket-fuel",
    Icon: "rocket-fuel",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "nuclear-fuel": {
    Name: "Nuclear fuel",
    Id: "nuclear-fuel",
    Icon: "nuclear-fuel",
    StackSize: 1,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "uranium-235": {
    Name: "Uranium-235",
    Id: "uranium-235",
    Icon: "uranium-235",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "uranium-238": {
    Name: "Uranium-238",
    Id: "uranium-238",
    Icon: "uranium-238",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "uranium-fuel-cell": {
    Name: "Uranium fuel cell",
    Id: "uranium-fuel-cell",
    Icon: "uranium-fuel-cell",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "used-up-uranium-fuel-cell": {
    Name: "Used up uranium fuel cell",
    Id: "used-up-uranium-fuel-cell",
    Icon: "used-up-uranium-fuel-cell",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "automation-science-pack": {
    Name: "Automation science pack",
    Id: "automation-science-pack",
    Icon: "automation-science-pack",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "logistic-science-pack": {
    Name: "Logistic science pack",
    Id: "logistic-science-pack",
    Icon: "logistic-science-pack",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "military-science-pack": {
    Name: "Military science pack",
    Id: "military-science-pack",
    Icon: "military-science-pack",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "chemical-science-pack": {
    Name: "Chemical science pack",
    Id: "chemical-science-pack",
    Icon: "chemical-science-pack",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "production-science-pack": {
    Name: "Production science pack",
    Id: "production-science-pack",
    Icon: "production-science-pack",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "utility-science-pack": {
    Name: "Utility science pack",
    Id: "utility-science-pack",
    Icon: "utility-science-pack",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "space-science-pack": {
    Name: "Space science pack",
    Id: "space-science-pack",
    Icon: "space-science-pack",
    StackSize: 2000,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  pistol: {
    Name: "Pistol",
    Id: "pistol",
    Icon: "pistol",
    StackSize: 5,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "submachine-gun": {
    Name: "Submachine gun",
    Id: "submachine-gun",
    Icon: "submachine-gun",
    StackSize: 5,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  shotgun: {
    Name: "Shotgun",
    Id: "shotgun",
    Icon: "shotgun",
    StackSize: 5,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "combat-shotgun": {
    Name: "Combat shotgun",
    Id: "combat-shotgun",
    Icon: "combat-shotgun",
    StackSize: 5,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "rocket-launcher": {
    Name: "Rocket launcher",
    Id: "rocket-launcher",
    Icon: "rocket-launcher",
    StackSize: 5,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  flamethrower: {
    Name: "Flamethrower",
    Id: "flamethrower",
    Icon: "flamethrower",
    StackSize: 5,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "land-mine": {
    Name: "Land mine",
    Id: "land-mine",
    Icon: "land-mine",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "firearm-magazine": {
    Name: "Firearm magazine",
    Id: "firearm-magazine",
    Icon: "firearm-magazine",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "piercing-rounds-magazine": {
    Name: "Piercing rounds magazine",
    Id: "piercing-rounds-magazine",
    Icon: "piercing-rounds-magazine",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "uranium-rounds-magazine": {
    Name: "Uranium rounds magazine",
    Id: "uranium-rounds-magazine",
    Icon: "uranium-rounds-magazine",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "shotgun-shell": {
    Name: "Shotgun shells",
    Id: "shotgun-shell",
    Icon: "shotgun-shell",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "piercing-shotgun-shell": {
    Name: "Piercing shotgun shells",
    Id: "piercing-shotgun-shell",
    Icon: "piercing-shotgun-shell",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "cannon-shell": {
    Name: "Cannon shell",
    Id: "cannon-shell",
    Icon: "cannon-shell",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "explosive-cannon-shell": {
    Name: "Explosive cannon shell",
    Id: "explosive-cannon-shell",
    Icon: "explosive-cannon-shell",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "uranium-cannon-shell": {
    Name: "Uranium cannon shell",
    Id: "uranium-cannon-shell",
    Icon: "uranium-cannon-shell",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "explosive-uranium-cannon-shell": {
    Name: "Explosive uranium cannon shell",
    Id: "explosive-uranium-cannon-shell",
    Icon: "explosive-uranium-cannon-shell",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "artillery-shell": {
    Name: "Artillery shell",
    Id: "artillery-shell",
    Icon: "artillery-shell",
    StackSize: 1,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  rocket: {
    Name: "Rocket",
    Id: "rocket",
    Icon: "rocket",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "explosive-rocket": {
    Name: "Explosive rocket",
    Id: "explosive-rocket",
    Icon: "explosive-rocket",
    StackSize: 200,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "atomic-bomb": {
    Name: "Atomic bomb",
    Id: "atomic-bomb",
    Icon: "atomic-bomb",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "flamethrower-ammo": {
    Name: "Flamethrower ammo",
    Id: "flamethrower-ammo",
    Icon: "flamethrower-ammo",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  grenade: {
    Name: "Grenade",
    Id: "grenade",
    Icon: "grenade",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "cluster-grenade": {
    Name: "Cluster grenade",
    Id: "cluster-grenade",
    Icon: "cluster-grenade",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "poison-capsule": {
    Name: "Poison capsule",
    Id: "poison-capsule",
    Icon: "poison-capsule",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "slowdown-capsule": {
    Name: "Slowdown capsule",
    Id: "slowdown-capsule",
    Icon: "slowdown-capsule",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "defender-capsule": {
    Name: "Defender capsule",
    Id: "defender-capsule",
    Icon: "defender-capsule",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "distractor-capsule": {
    Name: "Distractor capsule",
    Id: "distractor-capsule",
    Icon: "distractor-capsule",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "destroyer-capsule": {
    Name: "Destroyer capsule",
    Id: "destroyer-capsule",
    Icon: "destroyer-capsule",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "discharge-defense-remote": {
    Name: "Discharge defense remote",
    Id: "discharge-defense-remote",
    Icon: "discharge-defense-remote",
    StackSize: 1,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "artillery-targeting-remote": {
    Name: "Artillery targeting remote",
    Id: "artillery-targeting-remote",
    Icon: "artillery-targeting-remote",
    StackSize: 1,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "light-armor": {
    Name: "Light armor",
    Id: "light-armor",
    Icon: "light-armor",
    StackSize: 1,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "heavy-armor": {
    Name: "Heavy armor",
    Id: "heavy-armor",
    Icon: "heavy-armor",
    StackSize: 1,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "modular-armor": {
    Name: "Modular armor",
    Id: "modular-armor",
    Icon: "modular-armor",
    StackSize: 1,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "power-armor": {
    Name: "Power armor",
    Id: "power-armor",
    Icon: "power-armor",
    StackSize: 1,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "power-armor-mk2": {
    Name: "Power armor MK2",
    Id: "power-armor-mk2",
    Icon: "power-armor-mk2",
    StackSize: 1,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "solar-panel-equipment": {
    Name: "Portable solar panel",
    Id: "solar-panel-equipment",
    Icon: "solar-panel-equipment",
    StackSize: 20,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "fusion-reactor-equipment": {
    Name: "Portable fusion reactor",
    Id: "fusion-reactor-equipment",
    Icon: "fusion-reactor-equipment",
    StackSize: 20,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "energy-shield-equipment": {
    Name: "Energy shield",
    Id: "energy-shield-equipment",
    Icon: "energy-shield-equipment",
    StackSize: 20,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "energy-shield-mk2-equipment": {
    Name: "Energy shield MK2",
    Id: "energy-shield-mk2-equipment",
    Icon: "energy-shield-mk2-equipment",
    StackSize: 20,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "battery-equipment": {
    Name: "Personal battery",
    Id: "battery-equipment",
    Icon: "battery-equipment",
    StackSize: 20,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "battery-mk2-equipment": {
    Name: "Personal battery MK2",
    Id: "battery-mk2-equipment",
    Icon: "battery-mk2-equipment",
    StackSize: 20,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "personal-laser-defense-equipment": {
    Name: "Personal laser defense",
    Id: "personal-laser-defense-equipment",
    Icon: "personal-laser-defense-equipment",
    StackSize: 20,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "discharge-defense-equipment": {
    Name: "Discharge defense",
    Id: "discharge-defense-equipment",
    Icon: "discharge-defense-equipment",
    StackSize: 20,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "belt-immunity-equipment": {
    Name: "Belt immunity equipment",
    Id: "belt-immunity-equipment",
    Icon: "belt-immunity-equipment",
    StackSize: 20,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "exoskeleton-equipment": {
    Name: "Exoskeleton",
    Id: "exoskeleton-equipment",
    Icon: "exoskeleton-equipment",
    StackSize: 20,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "personal-roboport-equipment": {
    Name: "Personal roboport",
    Id: "personal-roboport-equipment",
    Icon: "personal-roboport-equipment",
    StackSize: 20,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "personal-roboport-mk2-equipment": {
    Name: "Personal roboport MK2",
    Id: "personal-roboport-mk2-equipment",
    Icon: "personal-roboport-mk2-equipment",
    StackSize: 20,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "night-vision-equipment": {
    Name: "Nightvision",
    Id: "night-vision-equipment",
    Icon: "night-vision-equipment",
    StackSize: 20,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "stone-wall": {
    Name: "Wall",
    Id: "stone-wall",
    Icon: "stone-wall",
    StackSize: 100,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  gate: {
    Name: "Gate",
    Id: "gate",
    Icon: "gate",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "gun-turret": {
    Name: "Gun turret",
    Id: "gun-turret",
    Icon: "gun-turret",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "laser-turret": {
    Name: "Laser turret",
    Id: "laser-turret",
    Icon: "laser-turret",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "flamethrower-turret": {
    Name: "Flamethrower turret",
    Id: "flamethrower-turret",
    Icon: "flamethrower-turret",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "artillery-turret": {
    Name: "Artillery turret",
    Id: "artillery-turret",
    Icon: "artillery-turret",
    StackSize: 10,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  radar: {
    Name: "Radar",
    Id: "radar",
    Icon: "radar",
    StackSize: 50,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "rocket-silo": {
    Name: "Rocket silo",
    Id: "rocket-silo",
    Icon: "rocket-silo",
    StackSize: 1,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  water: {
    Name: "Water",
    Id: "water",
    Icon: "water",
    StackSize: 0,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "crude-oil": {
    Name: "Crude oil",
    Id: "crude-oil",
    Icon: "crude-oil",
    StackSize: 0,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  steam: {
    Name: "Steam",
    Id: "steam",
    Icon: "steam",
    StackSize: 0,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "heavy-oil": {
    Name: "Heavy oil",
    Id: "heavy-oil",
    Icon: "heavy-oil",
    StackSize: 0,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "light-oil": {
    Name: "Light oil",
    Id: "light-oil",
    Icon: "light-oil",
    StackSize: 0,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "petroleum-gas": {
    Name: "Petroleum gas",
    Id: "petroleum-gas",
    Icon: "petroleum-gas",
    StackSize: 0,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  "sulfuric-acid": {
    Name: "Sulfuric acid",
    Id: "sulfuric-acid",
    Icon: "sulfuric-acid",
    StackSize: 0,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
  lubricant: {
    Name: "Lubricant",
    Id: "lubricant",
    Icon: "lubricant",
    StackSize: 0,
    StorageUpgradeType: "Solid",
    ResearchUpgradeItems: [],
  },
});

export const Recipes: Map<string, Recipe> = Map({
  "wooden-chest": {
    Id: "wooden-chest",
    Icon: "wooden-chest",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "wood",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "wooden-chest",
        Count: 1,
      },
    ],
  },

  "iron-chest": {
    Id: "iron-chest",
    Icon: "iron-chest",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-plate",
        Count: 8,
      },
    ],
    Output: [
      {
        Entity: "iron-chest",
        Count: 1,
      },
    ],
  },

  "steel-chest": {
    Id: "steel-chest",
    Icon: "steel-chest",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "steel-plate",
        Count: 8,
      },
    ],
    Output: [
      {
        Entity: "steel-chest",
        Count: 1,
      },
    ],
  },

  "storage-tank": {
    Id: "storage-tank",
    Icon: "storage-tank",
    DurationSeconds: 3,
    ProductionPerTick: 0.33333334,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-plate",
        Count: 20,
      },

      {
        Entity: "steel-plate",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "storage-tank",
        Count: 1,
      },
    ],
  },

  "transport-belt": {
    Id: "transport-belt",
    Icon: "transport-belt",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-gear-wheel",
        Count: 1,
      },

      {
        Entity: "iron-plate",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "transport-belt",
        Count: 2,
      },
    ],
  },

  "fast-transport-belt": {
    Id: "fast-transport-belt",
    Icon: "fast-transport-belt",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-gear-wheel",
        Count: 5,
      },

      {
        Entity: "transport-belt",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "fast-transport-belt",
        Count: 1,
      },
    ],
  },

  "express-transport-belt": {
    Id: "express-transport-belt",
    Icon: "express-transport-belt",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "fast-transport-belt",
        Count: 1,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 10,
      },

      {
        Entity: "lubricant",
        Count: 20,
      },
    ],
    Output: [
      {
        Entity: "express-transport-belt",
        Count: 1,
      },
    ],
  },

  "underground-belt": {
    Id: "underground-belt",
    Icon: "underground-belt",
    DurationSeconds: 1,
    ProductionPerTick: 1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-plate",
        Count: 10,
      },

      {
        Entity: "transport-belt",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "underground-belt",
        Count: 2,
      },
    ],
  },

  "fast-underground-belt": {
    Id: "fast-underground-belt",
    Icon: "fast-underground-belt",
    DurationSeconds: 2,
    ProductionPerTick: 0.5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-gear-wheel",
        Count: 40,
      },

      {
        Entity: "underground-belt",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "fast-underground-belt",
        Count: 2,
      },
    ],
  },

  "express-underground-belt": {
    Id: "express-underground-belt",
    Icon: "express-underground-belt",
    DurationSeconds: 2,
    ProductionPerTick: 0.5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "fast-underground-belt",
        Count: 2,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 80,
      },

      {
        Entity: "lubricant",
        Count: 40,
      },
    ],
    Output: [
      {
        Entity: "express-underground-belt",
        Count: 2,
      },
    ],
  },

  splitter: {
    Id: "splitter",
    Icon: "splitter",
    DurationSeconds: 1,
    ProductionPerTick: 1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 5,
      },

      {
        Entity: "iron-plate",
        Count: 5,
      },

      {
        Entity: "transport-belt",
        Count: 4,
      },
    ],
    Output: [
      {
        Entity: "splitter",
        Count: 1,
      },
    ],
  },

  "fast-splitter": {
    Id: "fast-splitter",
    Icon: "fast-splitter",
    DurationSeconds: 2,
    ProductionPerTick: 0.5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 10,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 10,
      },

      {
        Entity: "splitter",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "fast-splitter",
        Count: 1,
      },
    ],
  },

  "express-splitter": {
    Id: "express-splitter",
    Icon: "express-splitter",
    DurationSeconds: 2,
    ProductionPerTick: 0.5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 10,
      },

      {
        Entity: "fast-splitter",
        Count: 1,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 10,
      },

      {
        Entity: "lubricant",
        Count: 80,
      },
    ],
    Output: [
      {
        Entity: "express-splitter",
        Count: 1,
      },
    ],
  },

  "burner-inserter": {
    Id: "burner-inserter",
    Icon: "burner-inserter",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-gear-wheel",
        Count: 1,
      },

      {
        Entity: "iron-plate",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "burner-inserter",
        Count: 1,
      },
    ],
  },

  inserter: {
    Id: "inserter",
    Icon: "inserter",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 1,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 1,
      },

      {
        Entity: "iron-plate",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "inserter",
        Count: 1,
      },
    ],
  },

  "long-handed-inserter": {
    Id: "long-handed-inserter",
    Icon: "long-handed-inserter",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "inserter",
        Count: 1,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 1,
      },

      {
        Entity: "iron-plate",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "long-handed-inserter",
        Count: 1,
      },
    ],
  },

  "fast-inserter": {
    Id: "fast-inserter",
    Icon: "fast-inserter",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 2,
      },

      {
        Entity: "inserter",
        Count: 1,
      },

      {
        Entity: "iron-plate",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "fast-inserter",
        Count: 1,
      },
    ],
  },

  "filter-inserter": {
    Id: "filter-inserter",
    Icon: "filter-inserter",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 4,
      },

      {
        Entity: "fast-inserter",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "filter-inserter",
        Count: 1,
      },
    ],
  },

  "stack-inserter": {
    Id: "stack-inserter",
    Icon: "stack-inserter",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 1,
      },

      {
        Entity: "electronic-circuit",
        Count: 15,
      },

      {
        Entity: "fast-inserter",
        Count: 1,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 15,
      },
    ],
    Output: [
      {
        Entity: "stack-inserter",
        Count: 1,
      },
    ],
  },

  "stack-filter-inserter": {
    Id: "stack-filter-inserter",
    Icon: "stack-filter-inserter",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 5,
      },

      {
        Entity: "stack-inserter",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "stack-filter-inserter",
        Count: 1,
      },
    ],
  },

  "small-electric-pole": {
    Id: "small-electric-pole",
    Icon: "small-electric-pole",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-cable",
        Count: 2,
      },

      {
        Entity: "wood",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "small-electric-pole",
        Count: 2,
      },
    ],
  },

  "medium-electric-pole": {
    Id: "medium-electric-pole",
    Icon: "medium-electric-pole",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 2,
      },

      {
        Entity: "iron-stick",
        Count: 4,
      },

      {
        Entity: "steel-plate",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "medium-electric-pole",
        Count: 1,
      },
    ],
  },

  "big-electric-pole": {
    Id: "big-electric-pole",
    Icon: "big-electric-pole",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 5,
      },

      {
        Entity: "iron-stick",
        Count: 8,
      },

      {
        Entity: "steel-plate",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "big-electric-pole",
        Count: 1,
      },
    ],
  },

  substation: {
    Id: "substation",
    Icon: "substation",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 5,
      },

      {
        Entity: "copper-plate",
        Count: 5,
      },

      {
        Entity: "steel-plate",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "substation",
        Count: 1,
      },
    ],
  },

  pipe: {
    Id: "pipe",
    Icon: "pipe",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-plate",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "pipe",
        Count: 1,
      },
    ],
  },

  "pipe-to-ground": {
    Id: "pipe-to-ground",
    Icon: "pipe-to-ground",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-plate",
        Count: 5,
      },

      {
        Entity: "pipe",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "pipe-to-ground",
        Count: 2,
      },
    ],
  },

  pump: {
    Id: "pump",
    Icon: "pump",
    DurationSeconds: 2,
    ProductionPerTick: 0.5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "engine-unit",
        Count: 1,
      },

      {
        Entity: "pipe",
        Count: 1,
      },

      {
        Entity: "steel-plate",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "pump",
        Count: 1,
      },
    ],
  },

  rail: {
    Id: "rail",
    Icon: "rail",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-stick",
        Count: 1,
      },

      {
        Entity: "steel-plate",
        Count: 1,
      },

      {
        Entity: "stone",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "rail",
        Count: 2,
      },
    ],
  },

  "train-stop": {
    Id: "train-stop",
    Icon: "train-stop",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 5,
      },

      {
        Entity: "iron-plate",
        Count: 6,
      },

      {
        Entity: "iron-stick",
        Count: 6,
      },

      {
        Entity: "steel-plate",
        Count: 3,
      },
    ],
    Output: [
      {
        Entity: "train-stop",
        Count: 1,
      },
    ],
  },

  "rail-signal": {
    Id: "rail-signal",
    Icon: "rail-signal",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 1,
      },

      {
        Entity: "iron-plate",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "rail-signal",
        Count: 1,
      },
    ],
  },

  "rail-chain-signal": {
    Id: "rail-chain-signal",
    Icon: "rail-chain-signal",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 1,
      },

      {
        Entity: "iron-plate",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "rail-chain-signal",
        Count: 1,
      },
    ],
  },

  locomotive: {
    Id: "locomotive",
    Icon: "locomotive",
    DurationSeconds: 4,
    ProductionPerTick: 0.25,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 10,
      },

      {
        Entity: "engine-unit",
        Count: 20,
      },

      {
        Entity: "steel-plate",
        Count: 30,
      },
    ],
    Output: [
      {
        Entity: "locomotive",
        Count: 1,
      },
    ],
  },

  "cargo-wagon": {
    Id: "cargo-wagon",
    Icon: "cargo-wagon",
    DurationSeconds: 1,
    ProductionPerTick: 1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-gear-wheel",
        Count: 10,
      },

      {
        Entity: "iron-plate",
        Count: 20,
      },

      {
        Entity: "steel-plate",
        Count: 20,
      },
    ],
    Output: [
      {
        Entity: "cargo-wagon",
        Count: 1,
      },
    ],
  },

  "fluid-wagon": {
    Id: "fluid-wagon",
    Icon: "fluid-wagon",
    DurationSeconds: 1.5,
    ProductionPerTick: 0.6666667,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-gear-wheel",
        Count: 10,
      },

      {
        Entity: "pipe",
        Count: 8,
      },

      {
        Entity: "steel-plate",
        Count: 16,
      },

      {
        Entity: "storage-tank",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "fluid-wagon",
        Count: 1,
      },
    ],
  },

  "artillery-wagon": {
    Id: "artillery-wagon",
    Icon: "artillery-wagon",
    DurationSeconds: 4,
    ProductionPerTick: 0.25,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 20,
      },

      {
        Entity: "engine-unit",
        Count: 64,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 10,
      },

      {
        Entity: "pipe",
        Count: 16,
      },

      {
        Entity: "steel-plate",
        Count: 40,
      },
    ],
    Output: [
      {
        Entity: "artillery-wagon",
        Count: 1,
      },
    ],
  },

  car: {
    Id: "car",
    Icon: "car",
    DurationSeconds: 2,
    ProductionPerTick: 0.5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "engine-unit",
        Count: 8,
      },

      {
        Entity: "iron-plate",
        Count: 20,
      },

      {
        Entity: "steel-plate",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "car",
        Count: 1,
      },
    ],
  },

  tank: {
    Id: "tank",
    Icon: "tank",
    DurationSeconds: 5,
    ProductionPerTick: 0.2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 10,
      },

      {
        Entity: "engine-unit",
        Count: 32,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 15,
      },

      {
        Entity: "steel-plate",
        Count: 50,
      },
    ],
    Output: [
      {
        Entity: "tank",
        Count: 1,
      },
    ],
  },

  "logistic-robot": {
    Id: "logistic-robot",
    Icon: "logistic-robot",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 2,
      },

      {
        Entity: "flying-robot-frame",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "logistic-robot",
        Count: 1,
      },
    ],
  },

  "construction-robot": {
    Id: "construction-robot",
    Icon: "construction-robot",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 2,
      },

      {
        Entity: "flying-robot-frame",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "construction-robot",
        Count: 1,
      },
    ],
  },

  "logistic-chest-active-provider": {
    Id: "logistic-chest-active-provider",
    Icon: "logistic-chest-active-provider",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 1,
      },

      {
        Entity: "electronic-circuit",
        Count: 3,
      },

      {
        Entity: "steel-chest",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "logistic-chest-active-provider",
        Count: 1,
      },
    ],
  },

  "logistic-chest-passive-provider": {
    Id: "logistic-chest-passive-provider",
    Icon: "logistic-chest-passive-provider",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 1,
      },

      {
        Entity: "electronic-circuit",
        Count: 3,
      },

      {
        Entity: "steel-chest",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "logistic-chest-passive-provider",
        Count: 1,
      },
    ],
  },

  "logistic-chest-storage": {
    Id: "logistic-chest-storage",
    Icon: "logistic-chest-storage",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 1,
      },

      {
        Entity: "electronic-circuit",
        Count: 3,
      },

      {
        Entity: "steel-chest",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "logistic-chest-storage",
        Count: 1,
      },
    ],
  },

  "logistic-chest-buffer": {
    Id: "logistic-chest-buffer",
    Icon: "logistic-chest-buffer",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 1,
      },

      {
        Entity: "electronic-circuit",
        Count: 3,
      },

      {
        Entity: "steel-chest",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "logistic-chest-buffer",
        Count: 1,
      },
    ],
  },

  "logistic-chest-requester": {
    Id: "logistic-chest-requester",
    Icon: "logistic-chest-requester",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 1,
      },

      {
        Entity: "electronic-circuit",
        Count: 3,
      },

      {
        Entity: "steel-chest",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "logistic-chest-requester",
        Count: 1,
      },
    ],
  },

  roboport: {
    Id: "roboport",
    Icon: "roboport",
    DurationSeconds: 5,
    ProductionPerTick: 0.2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 45,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 45,
      },

      {
        Entity: "steel-plate",
        Count: 45,
      },
    ],
    Output: [
      {
        Entity: "roboport",
        Count: 1,
      },
    ],
  },

  "small-lamp": {
    Id: "small-lamp",
    Icon: "small-lamp",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-cable",
        Count: 3,
      },

      {
        Entity: "electronic-circuit",
        Count: 1,
      },

      {
        Entity: "iron-plate",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "small-lamp",
        Count: 1,
      },
    ],
  },

  "red-wire": {
    Id: "red-wire",
    Icon: "red-wire",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-cable",
        Count: 1,
      },

      {
        Entity: "electronic-circuit",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "red-wire",
        Count: 1,
      },
    ],
  },

  "green-wire": {
    Id: "green-wire",
    Icon: "green-wire",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-cable",
        Count: 1,
      },

      {
        Entity: "electronic-circuit",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "green-wire",
        Count: 1,
      },
    ],
  },

  "arithmetic-combinator": {
    Id: "arithmetic-combinator",
    Icon: "arithmetic-combinator",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-cable",
        Count: 5,
      },

      {
        Entity: "electronic-circuit",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "arithmetic-combinator",
        Count: 1,
      },
    ],
  },

  "decider-combinator": {
    Id: "decider-combinator",
    Icon: "decider-combinator",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-cable",
        Count: 5,
      },

      {
        Entity: "electronic-circuit",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "decider-combinator",
        Count: 1,
      },
    ],
  },

  "constant-combinator": {
    Id: "constant-combinator",
    Icon: "constant-combinator",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-cable",
        Count: 5,
      },

      {
        Entity: "electronic-circuit",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "constant-combinator",
        Count: 1,
      },
    ],
  },

  "power-switch": {
    Id: "power-switch",
    Icon: "power-switch",
    DurationSeconds: 2,
    ProductionPerTick: 0.5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-cable",
        Count: 5,
      },

      {
        Entity: "electronic-circuit",
        Count: 2,
      },

      {
        Entity: "iron-plate",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "power-switch",
        Count: 1,
      },
    ],
  },

  "programmable-speaker": {
    Id: "programmable-speaker",
    Icon: "programmable-speaker",
    DurationSeconds: 2,
    ProductionPerTick: 0.5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-cable",
        Count: 5,
      },

      {
        Entity: "electronic-circuit",
        Count: 4,
      },

      {
        Entity: "iron-plate",
        Count: 3,
      },

      {
        Entity: "iron-stick",
        Count: 4,
      },
    ],
    Output: [
      {
        Entity: "programmable-speaker",
        Count: 1,
      },
    ],
  },

  "stone-brick": {
    Id: "stone-brick",
    Icon: "stone-brick",
    DurationSeconds: 3.2,
    ProductionPerTick: 0.3125,
    ProducerType: "Smelter",
    Input: [
      {
        Entity: "stone",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "stone-brick",
        Count: 1,
      },
    ],
  },

  concrete: {
    Id: "concrete",
    Icon: "concrete",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-ore",
        Count: 1,
      },

      {
        Entity: "stone-brick",
        Count: 5,
      },

      {
        Entity: "water",
        Count: 100,
      },
    ],
    Output: [
      {
        Entity: "concrete",
        Count: 10,
      },
    ],
  },

  "hazard-concrete": {
    Id: "hazard-concrete",
    Icon: "hazard-concrete",
    DurationSeconds: 0.25,
    ProductionPerTick: 4,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "concrete",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "hazard-concrete",
        Count: 10,
      },
    ],
  },

  "refined-concrete": {
    Id: "refined-concrete",
    Icon: "refined-concrete",
    DurationSeconds: 15,
    ProductionPerTick: 0.06666667,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "concrete",
        Count: 20,
      },

      {
        Entity: "iron-stick",
        Count: 8,
      },

      {
        Entity: "steel-plate",
        Count: 1,
      },

      {
        Entity: "water",
        Count: 100,
      },
    ],
    Output: [
      {
        Entity: "refined-concrete",
        Count: 10,
      },
    ],
  },

  "refined-hazard-concrete": {
    Id: "refined-hazard-concrete",
    Icon: "refined-hazard-concrete",
    DurationSeconds: 0.25,
    ProductionPerTick: 4,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "refined-concrete",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "refined-hazard-concrete",
        Count: 10,
      },
    ],
  },

  landfill: {
    Id: "landfill",
    Icon: "landfill",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "stone",
        Count: 20,
      },
    ],
    Output: [
      {
        Entity: "landfill",
        Count: 1,
      },
    ],
  },

  "cliff-explosives": {
    Id: "cliff-explosives",
    Icon: "cliff-explosives",
    DurationSeconds: 8,
    ProductionPerTick: 0.125,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "empty-barrel",
        Count: 1,
      },

      {
        Entity: "explosives",
        Count: 10,
      },

      {
        Entity: "grenade",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "cliff-explosives",
        Count: 1,
      },
    ],
  },

  "repair-pack": {
    Id: "repair-pack",
    Icon: "repair-pack",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 2,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "repair-pack",
        Count: 1,
      },
    ],
  },

  boiler: {
    Id: "boiler",
    Icon: "boiler",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "pipe",
        Count: 4,
      },

      {
        Entity: "stone-furnace",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "boiler",
        Count: 1,
      },
    ],
  },

  "steam-engine": {
    Id: "steam-engine",
    Icon: "steam-engine",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-gear-wheel",
        Count: 8,
      },

      {
        Entity: "iron-plate",
        Count: 10,
      },

      {
        Entity: "pipe",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "steam-engine",
        Count: 1,
      },
    ],
  },

  "solar-panel": {
    Id: "solar-panel",
    Icon: "solar-panel",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 5,
      },

      {
        Entity: "electronic-circuit",
        Count: 15,
      },

      {
        Entity: "steel-plate",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "solar-panel",
        Count: 1,
      },
    ],
  },

  accumulator: {
    Id: "accumulator",
    Icon: "accumulator",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "battery",
        Count: 5,
      },

      {
        Entity: "iron-plate",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "accumulator",
        Count: 1,
      },
    ],
  },

  "nuclear-reactor": {
    Id: "nuclear-reactor",
    Icon: "nuclear-reactor",
    DurationSeconds: 8,
    ProductionPerTick: 0.125,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 500,
      },

      {
        Entity: "concrete",
        Count: 500,
      },

      {
        Entity: "copper-plate",
        Count: 500,
      },

      {
        Entity: "steel-plate",
        Count: 500,
      },
    ],
    Output: [
      {
        Entity: "nuclear-reactor",
        Count: 1,
      },
    ],
  },

  "heat-pipe": {
    Id: "heat-pipe",
    Icon: "heat-pipe",
    DurationSeconds: 1,
    ProductionPerTick: 1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 20,
      },

      {
        Entity: "steel-plate",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "heat-pipe",
        Count: 1,
      },
    ],
  },

  "heat-exchanger": {
    Id: "heat-exchanger",
    Icon: "heat-exchanger",
    DurationSeconds: 3,
    ProductionPerTick: 0.33333334,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 100,
      },

      {
        Entity: "pipe",
        Count: 10,
      },

      {
        Entity: "steel-plate",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "heat-exchanger",
        Count: 1,
      },
    ],
  },

  "steam-turbine": {
    Id: "steam-turbine",
    Icon: "steam-turbine",
    DurationSeconds: 3,
    ProductionPerTick: 0.33333334,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 50,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 50,
      },

      {
        Entity: "pipe",
        Count: 20,
      },
    ],
    Output: [
      {
        Entity: "steam-turbine",
        Count: 1,
      },
    ],
  },

  "burner-mining-drill": {
    Id: "burner-mining-drill",
    Icon: "burner-mining-drill",
    DurationSeconds: 2,
    ProductionPerTick: 0.5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-gear-wheel",
        Count: 3,
      },

      {
        Entity: "iron-plate",
        Count: 3,
      },

      {
        Entity: "stone-furnace",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "burner-mining-drill",
        Count: 1,
      },
    ],
  },

  "electric-mining-drill": {
    Id: "electric-mining-drill",
    Icon: "electric-mining-drill",
    DurationSeconds: 2,
    ProductionPerTick: 0.5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 3,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 5,
      },

      {
        Entity: "iron-plate",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "electric-mining-drill",
        Count: 1,
      },
    ],
  },

  "offshore-pump": {
    Id: "offshore-pump",
    Icon: "offshore-pump",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 2,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 1,
      },

      {
        Entity: "pipe",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "offshore-pump",
        Count: 1,
      },
    ],
  },

  pumpjack: {
    Id: "pumpjack",
    Icon: "pumpjack",
    DurationSeconds: 5,
    ProductionPerTick: 0.2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 5,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 10,
      },

      {
        Entity: "pipe",
        Count: 10,
      },

      {
        Entity: "steel-plate",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "pumpjack",
        Count: 1,
      },
    ],
  },

  "stone-furnace": {
    Id: "stone-furnace",
    Icon: "stone-furnace",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "stone",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "stone-furnace",
        Count: 1,
      },
    ],
  },

  "steel-furnace": {
    Id: "steel-furnace",
    Icon: "steel-furnace",
    DurationSeconds: 3,
    ProductionPerTick: 0.33333334,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "steel-plate",
        Count: 6,
      },

      {
        Entity: "stone-brick",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "steel-furnace",
        Count: 1,
      },
    ],
  },

  "electric-furnace": {
    Id: "electric-furnace",
    Icon: "electric-furnace",
    DurationSeconds: 5,
    ProductionPerTick: 0.2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 5,
      },

      {
        Entity: "steel-plate",
        Count: 10,
      },

      {
        Entity: "stone-brick",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "electric-furnace",
        Count: 1,
      },
    ],
  },

  "assembling-machine-1": {
    Id: "assembling-machine-1",
    Icon: "assembling-machine-1",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 3,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 5,
      },

      {
        Entity: "iron-plate",
        Count: 9,
      },
    ],
    Output: [
      {
        Entity: "assembling-machine-1",
        Count: 1,
      },
    ],
  },

  "assembling-machine-2": {
    Id: "assembling-machine-2",
    Icon: "assembling-machine-2",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "assembling-machine-1",
        Count: 1,
      },

      {
        Entity: "electronic-circuit",
        Count: 3,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 5,
      },

      {
        Entity: "steel-plate",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "assembling-machine-2",
        Count: 1,
      },
    ],
  },

  "assembling-machine-3": {
    Id: "assembling-machine-3",
    Icon: "assembling-machine-3",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "assembling-machine-2",
        Count: 2,
      },

      {
        Entity: "speed-module",
        Count: 4,
      },
    ],
    Output: [
      {
        Entity: "assembling-machine-3",
        Count: 1,
      },
    ],
  },

  "oil-refinery": {
    Id: "oil-refinery",
    Icon: "oil-refinery",
    DurationSeconds: 8,
    ProductionPerTick: 0.125,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 10,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 10,
      },

      {
        Entity: "pipe",
        Count: 10,
      },

      {
        Entity: "steel-plate",
        Count: 15,
      },

      {
        Entity: "stone-brick",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "oil-refinery",
        Count: 1,
      },
    ],
  },

  "chemical-plant": {
    Id: "chemical-plant",
    Icon: "chemical-plant",
    DurationSeconds: 5,
    ProductionPerTick: 0.2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 5,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 5,
      },

      {
        Entity: "pipe",
        Count: 5,
      },

      {
        Entity: "steel-plate",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "chemical-plant",
        Count: 1,
      },
    ],
  },

  centrifuge: {
    Id: "centrifuge",
    Icon: "centrifuge",
    DurationSeconds: 4,
    ProductionPerTick: 0.25,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 100,
      },

      {
        Entity: "concrete",
        Count: 100,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 100,
      },

      {
        Entity: "steel-plate",
        Count: 50,
      },
    ],
    Output: [
      {
        Entity: "centrifuge",
        Count: 1,
      },
    ],
  },

  lab: {
    Id: "lab",
    Icon: "lab",
    DurationSeconds: 2,
    ProductionPerTick: 0.5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 10,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 10,
      },

      {
        Entity: "transport-belt",
        Count: 4,
      },
    ],
    Output: [
      {
        Entity: "lab",
        Count: 1,
      },
    ],
  },

  beacon: {
    Id: "beacon",
    Icon: "beacon",
    DurationSeconds: 15,
    ProductionPerTick: 0.06666667,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 20,
      },

      {
        Entity: "copper-cable",
        Count: 10,
      },

      {
        Entity: "electronic-circuit",
        Count: 20,
      },

      {
        Entity: "steel-plate",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "beacon",
        Count: 1,
      },
    ],
  },

  "speed-module": {
    Id: "speed-module",
    Icon: "speed-module",
    DurationSeconds: 15,
    ProductionPerTick: 0.06666667,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 5,
      },

      {
        Entity: "electronic-circuit",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "speed-module",
        Count: 1,
      },
    ],
  },

  "speed-module-2": {
    Id: "speed-module-2",
    Icon: "speed-module-2",
    DurationSeconds: 30,
    ProductionPerTick: 0.033333335,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 5,
      },

      {
        Entity: "processing-unit",
        Count: 5,
      },

      {
        Entity: "speed-module",
        Count: 4,
      },
    ],
    Output: [
      {
        Entity: "speed-module-2",
        Count: 1,
      },
    ],
  },

  "speed-module-3": {
    Id: "speed-module-3",
    Icon: "speed-module-3",
    DurationSeconds: 60,
    ProductionPerTick: 0.016666668,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 5,
      },

      {
        Entity: "processing-unit",
        Count: 5,
      },

      {
        Entity: "speed-module-2",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "speed-module-3",
        Count: 1,
      },
    ],
  },

  "effectivity-module": {
    Id: "effectivity-module",
    Icon: "effectivity-module",
    DurationSeconds: 15,
    ProductionPerTick: 0.06666667,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 5,
      },

      {
        Entity: "electronic-circuit",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "effectivity-module",
        Count: 1,
      },
    ],
  },

  "effectivity-module-2": {
    Id: "effectivity-module-2",
    Icon: "effectivity-module-2",
    DurationSeconds: 30,
    ProductionPerTick: 0.033333335,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 5,
      },

      {
        Entity: "effectivity-module",
        Count: 4,
      },

      {
        Entity: "processing-unit",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "effectivity-module-2",
        Count: 1,
      },
    ],
  },

  "effectivity-module-3": {
    Id: "effectivity-module-3",
    Icon: "effectivity-module-3",
    DurationSeconds: 60,
    ProductionPerTick: 0.016666668,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 5,
      },

      {
        Entity: "effectivity-module-2",
        Count: 5,
      },

      {
        Entity: "processing-unit",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "effectivity-module-3",
        Count: 1,
      },
    ],
  },

  "productivity-module": {
    Id: "productivity-module",
    Icon: "productivity-module",
    DurationSeconds: 15,
    ProductionPerTick: 0.06666667,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 5,
      },

      {
        Entity: "electronic-circuit",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "productivity-module",
        Count: 1,
      },
    ],
  },

  "productivity-module-2": {
    Id: "productivity-module-2",
    Icon: "productivity-module-2",
    DurationSeconds: 30,
    ProductionPerTick: 0.033333335,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 5,
      },

      {
        Entity: "processing-unit",
        Count: 5,
      },

      {
        Entity: "productivity-module",
        Count: 4,
      },
    ],
    Output: [
      {
        Entity: "productivity-module-2",
        Count: 1,
      },
    ],
  },

  "productivity-module-3": {
    Id: "productivity-module-3",
    Icon: "productivity-module-3",
    DurationSeconds: 60,
    ProductionPerTick: 0.016666668,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 5,
      },

      {
        Entity: "processing-unit",
        Count: 5,
      },

      {
        Entity: "productivity-module-2",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "productivity-module-3",
        Count: 1,
      },
    ],
  },

  "sulfuric-acid": {
    Id: "sulfuric-acid",
    Icon: "sulfuric-acid",
    DurationSeconds: 1,
    ProductionPerTick: 1,
    ProducerType: "ChemPlant",
    Input: [
      {
        Entity: "iron-plate",
        Count: 1,
      },

      {
        Entity: "sulfur",
        Count: 5,
      },

      {
        Entity: "water",
        Count: 100,
      },
    ],
    Output: [
      {
        Entity: "sulfuric-acid",
        Count: 50,
      },
    ],
  },

  "basic-oil-processing": {
    Id: "basic-oil-processing",
    Icon: "basic-oil-processing",
    DurationSeconds: 5,
    ProductionPerTick: 0.2,
    ProducerType: "Refinery",
    Input: [
      {
        Entity: "crude-oil",
        Count: 100,
      },
    ],
    Output: [
      {
        Entity: "petroleum-gas",
        Count: 45,
      },
    ],
  },

  "advanced-oil-processing": {
    Id: "advanced-oil-processing",
    Icon: "advanced-oil-processing",
    DurationSeconds: 5,
    ProductionPerTick: 0.2,
    ProducerType: "Refinery",
    Input: [
      {
        Entity: "crude-oil",
        Count: 100,
      },

      {
        Entity: "water",
        Count: 50,
      },
    ],
    Output: [
      {
        Entity: "heavy-oil",
        Count: 25,
      },

      {
        Entity: "light-oil",
        Count: 45,
      },

      {
        Entity: "petroleum-gas",
        Count: 55,
      },
    ],
  },

  "coal-liquefaction": {
    Id: "coal-liquefaction",
    Icon: "coal-liquefaction",
    DurationSeconds: 5,
    ProductionPerTick: 0.2,
    ProducerType: "Refinery",
    Input: [
      {
        Entity: "coal",
        Count: 10,
      },

      {
        Entity: "heavy-oil",
        Count: 25,
      },

      {
        Entity: "steam",
        Count: 50,
      },
    ],
    Output: [
      {
        Entity: "heavy-oil",
        Count: 90,
      },

      {
        Entity: "light-oil",
        Count: 20,
      },

      {
        Entity: "petroleum-gas",
        Count: 10,
      },
    ],
  },

  "heavy-oil-cracking": {
    Id: "heavy-oil-cracking",
    Icon: "heavy-oil-cracking",
    DurationSeconds: 2,
    ProductionPerTick: 0.5,
    ProducerType: "ChemPlant",
    Input: [
      {
        Entity: "heavy-oil",
        Count: 40,
      },

      {
        Entity: "water",
        Count: 30,
      },
    ],
    Output: [
      {
        Entity: "light-oil",
        Count: 30,
      },
    ],
  },

  "light-oil-cracking": {
    Id: "light-oil-cracking",
    Icon: "light-oil-cracking",
    DurationSeconds: 2,
    ProductionPerTick: 0.5,
    ProducerType: "ChemPlant",
    Input: [
      {
        Entity: "light-oil",
        Count: 30,
      },

      {
        Entity: "water",
        Count: 30,
      },
    ],
    Output: [
      {
        Entity: "petroleum-gas",
        Count: 20,
      },
    ],
  },

  "solid-fuel-from-light-oil": {
    Id: "solid-fuel-from-light-oil",
    Icon: "solid-fuel-from-light-oil",
    DurationSeconds: 2,
    ProductionPerTick: 0.5,
    ProducerType: "ChemPlant",
    Input: [
      {
        Entity: "light-oil",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "solid-fuel",
        Count: 1,
      },
    ],
  },

  "solid-fuel-from-petroleum-gas": {
    Id: "solid-fuel-from-petroleum-gas",
    Icon: "solid-fuel-from-petroleum-gas",
    DurationSeconds: 2,
    ProductionPerTick: 0.5,
    ProducerType: "ChemPlant",
    Input: [
      {
        Entity: "petroleum-gas",
        Count: 20,
      },
    ],
    Output: [
      {
        Entity: "solid-fuel",
        Count: 1,
      },
    ],
  },

  "solid-fuel-from-heavy-oil": {
    Id: "solid-fuel-from-heavy-oil",
    Icon: "solid-fuel-from-heavy-oil",
    DurationSeconds: 2,
    ProductionPerTick: 0.5,
    ProducerType: "ChemPlant",
    Input: [
      {
        Entity: "heavy-oil",
        Count: 20,
      },
    ],
    Output: [
      {
        Entity: "solid-fuel",
        Count: 1,
      },
    ],
  },

  lubricant: {
    Id: "lubricant",
    Icon: "lubricant",
    DurationSeconds: 1,
    ProductionPerTick: 1,
    ProducerType: "ChemPlant",
    Input: [
      {
        Entity: "heavy-oil",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "lubricant",
        Count: 10,
      },
    ],
  },

  "iron-plate": {
    Id: "iron-plate",
    Icon: "iron-plate",
    DurationSeconds: 3.2,
    ProductionPerTick: 0.3125,
    ProducerType: "Smelter",
    Input: [
      {
        Entity: "iron-ore",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "iron-plate",
        Count: 1,
      },
    ],
  },

  "copper-plate": {
    Id: "copper-plate",
    Icon: "copper-plate",
    DurationSeconds: 3.2,
    ProductionPerTick: 0.3125,
    ProducerType: "Smelter",
    Input: [
      {
        Entity: "copper-ore",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "copper-plate",
        Count: 1,
      },
    ],
  },

  "steel-plate": {
    Id: "steel-plate",
    Icon: "steel-plate",
    DurationSeconds: 16,
    ProductionPerTick: 0.0625,
    ProducerType: "Smelter",
    Input: [
      {
        Entity: "iron-plate",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "steel-plate",
        Count: 1,
      },
    ],
  },

  "plastic-bar": {
    Id: "plastic-bar",
    Icon: "plastic-bar",
    DurationSeconds: 1,
    ProductionPerTick: 1,
    ProducerType: "ChemPlant",
    Input: [
      {
        Entity: "coal",
        Count: 1,
      },

      {
        Entity: "petroleum-gas",
        Count: 20,
      },
    ],
    Output: [
      {
        Entity: "plastic-bar",
        Count: 2,
      },
    ],
  },

  sulfur: {
    Id: "sulfur",
    Icon: "sulfur",
    DurationSeconds: 1,
    ProductionPerTick: 1,
    ProducerType: "ChemPlant",
    Input: [
      {
        Entity: "petroleum-gas",
        Count: 30,
      },

      {
        Entity: "water",
        Count: 30,
      },
    ],
    Output: [
      {
        Entity: "sulfur",
        Count: 2,
      },
    ],
  },

  battery: {
    Id: "battery",
    Icon: "battery",
    DurationSeconds: 4,
    ProductionPerTick: 0.25,
    ProducerType: "ChemPlant",
    Input: [
      {
        Entity: "copper-plate",
        Count: 1,
      },

      {
        Entity: "iron-plate",
        Count: 1,
      },

      {
        Entity: "sulfuric-acid",
        Count: 20,
      },
    ],
    Output: [
      {
        Entity: "battery",
        Count: 1,
      },
    ],
  },

  explosives: {
    Id: "explosives",
    Icon: "explosives",
    DurationSeconds: 4,
    ProductionPerTick: 0.25,
    ProducerType: "ChemPlant",
    Input: [
      {
        Entity: "coal",
        Count: 1,
      },

      {
        Entity: "sulfur",
        Count: 1,
      },

      {
        Entity: "water",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "explosives",
        Count: 2,
      },
    ],
  },

  "uranium-processing": {
    Id: "uranium-processing",
    Icon: "uranium-processing",
    DurationSeconds: 12,
    ProductionPerTick: 0.083333336,
    ProducerType: "Centrifuge",
    Input: [
      {
        Entity: "uranium-ore",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "uranium-235",
        Count: 0.007,
      },

      {
        Entity: "uranium-238",
        Count: 0.993,
      },
    ],
  },

  "fill-crude-oil-barrel": {
    Id: "fill-crude-oil-barrel",
    Icon: "fill-crude-oil-barrel",
    DurationSeconds: 0.2,
    ProductionPerTick: 5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "crude-oil",
        Count: 50,
      },

      {
        Entity: "empty-barrel",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "crude-oil-barrel",
        Count: 1,
      },
    ],
  },

  "fill-heavy-oil-barrel": {
    Id: "fill-heavy-oil-barrel",
    Icon: "fill-heavy-oil-barrel",
    DurationSeconds: 0.2,
    ProductionPerTick: 5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "empty-barrel",
        Count: 1,
      },

      {
        Entity: "heavy-oil",
        Count: 50,
      },
    ],
    Output: [
      {
        Entity: "heavy-oil-barrel",
        Count: 1,
      },
    ],
  },

  "fill-light-oil-barrel": {
    Id: "fill-light-oil-barrel",
    Icon: "fill-light-oil-barrel",
    DurationSeconds: 0.2,
    ProductionPerTick: 5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "empty-barrel",
        Count: 1,
      },

      {
        Entity: "light-oil",
        Count: 50,
      },
    ],
    Output: [
      {
        Entity: "light-oil-barrel",
        Count: 1,
      },
    ],
  },

  "fill-lubricant-barrel": {
    Id: "fill-lubricant-barrel",
    Icon: "fill-lubricant-barrel",
    DurationSeconds: 0.2,
    ProductionPerTick: 5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "empty-barrel",
        Count: 1,
      },

      {
        Entity: "lubricant",
        Count: 50,
      },
    ],
    Output: [
      {
        Entity: "lubricant-barrel",
        Count: 1,
      },
    ],
  },

  "fill-petroleum-gas-barrel": {
    Id: "fill-petroleum-gas-barrel",
    Icon: "fill-petroleum-gas-barrel",
    DurationSeconds: 0.2,
    ProductionPerTick: 5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "empty-barrel",
        Count: 1,
      },

      {
        Entity: "petroleum-gas",
        Count: 50,
      },
    ],
    Output: [
      {
        Entity: "petroleum-gas-barrel",
        Count: 1,
      },
    ],
  },

  "fill-sulfuric-acid-barrel": {
    Id: "fill-sulfuric-acid-barrel",
    Icon: "fill-sulfuric-acid-barrel",
    DurationSeconds: 0.2,
    ProductionPerTick: 5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "empty-barrel",
        Count: 1,
      },

      {
        Entity: "sulfuric-acid",
        Count: 50,
      },
    ],
    Output: [
      {
        Entity: "sulfuric-acid-barrel",
        Count: 1,
      },
    ],
  },

  "fill-water-barrel": {
    Id: "fill-water-barrel",
    Icon: "fill-water-barrel",
    DurationSeconds: 0.2,
    ProductionPerTick: 5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "empty-barrel",
        Count: 1,
      },

      {
        Entity: "water",
        Count: 50,
      },
    ],
    Output: [
      {
        Entity: "water-barrel",
        Count: 1,
      },
    ],
  },

  "empty-crude-oil-barrel": {
    Id: "empty-crude-oil-barrel",
    Icon: "empty-crude-oil-barrel",
    DurationSeconds: 0.2,
    ProductionPerTick: 5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "crude-oil-barrel",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "crude-oil",
        Count: 50,
      },

      {
        Entity: "empty-barrel",
        Count: 1,
      },
    ],
  },

  "empty-heavy-oil-barrel": {
    Id: "empty-heavy-oil-barrel",
    Icon: "empty-heavy-oil-barrel",
    DurationSeconds: 0.2,
    ProductionPerTick: 5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "heavy-oil-barrel",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "empty-barrel",
        Count: 1,
      },

      {
        Entity: "heavy-oil",
        Count: 50,
      },
    ],
  },

  "empty-light-oil-barrel": {
    Id: "empty-light-oil-barrel",
    Icon: "empty-light-oil-barrel",
    DurationSeconds: 0.2,
    ProductionPerTick: 5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "light-oil-barrel",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "empty-barrel",
        Count: 1,
      },

      {
        Entity: "light-oil",
        Count: 50,
      },
    ],
  },

  "empty-lubricant-barrel": {
    Id: "empty-lubricant-barrel",
    Icon: "empty-lubricant-barrel",
    DurationSeconds: 0.2,
    ProductionPerTick: 5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "lubricant-barrel",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "empty-barrel",
        Count: 1,
      },

      {
        Entity: "lubricant",
        Count: 50,
      },
    ],
  },

  "empty-petroleum-gas-barrel": {
    Id: "empty-petroleum-gas-barrel",
    Icon: "empty-petroleum-gas-barrel",
    DurationSeconds: 0.2,
    ProductionPerTick: 5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "petroleum-gas-barrel",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "empty-barrel",
        Count: 1,
      },

      {
        Entity: "petroleum-gas",
        Count: 50,
      },
    ],
  },

  "empty-sulfuric-acid-barrel": {
    Id: "empty-sulfuric-acid-barrel",
    Icon: "empty-sulfuric-acid-barrel",
    DurationSeconds: 0.2,
    ProductionPerTick: 5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "sulfuric-acid-barrel",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "empty-barrel",
        Count: 1,
      },

      {
        Entity: "sulfuric-acid",
        Count: 50,
      },
    ],
  },

  "empty-water-barrel": {
    Id: "empty-water-barrel",
    Icon: "empty-water-barrel",
    DurationSeconds: 0.2,
    ProductionPerTick: 5,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "water-barrel",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "empty-barrel",
        Count: 1,
      },

      {
        Entity: "water",
        Count: 50,
      },
    ],
  },

  "copper-cable": {
    Id: "copper-cable",
    Icon: "copper-cable",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "copper-cable",
        Count: 2,
      },
    ],
  },

  "iron-stick": {
    Id: "iron-stick",
    Icon: "iron-stick",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-plate",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "iron-stick",
        Count: 2,
      },
    ],
  },

  "iron-gear-wheel": {
    Id: "iron-gear-wheel",
    Icon: "iron-gear-wheel",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-plate",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "iron-gear-wheel",
        Count: 1,
      },
    ],
  },

  "empty-barrel": {
    Id: "empty-barrel",
    Icon: "empty-barrel",
    DurationSeconds: 1,
    ProductionPerTick: 1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "steel-plate",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "empty-barrel",
        Count: 1,
      },
    ],
  },

  "electronic-circuit": {
    Id: "electronic-circuit",
    Icon: "electronic-circuit",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-cable",
        Count: 3,
      },

      {
        Entity: "iron-plate",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "electronic-circuit",
        Count: 1,
      },
    ],
  },

  "advanced-circuit": {
    Id: "advanced-circuit",
    Icon: "advanced-circuit",
    DurationSeconds: 6,
    ProductionPerTick: 0.16666667,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-cable",
        Count: 4,
      },

      {
        Entity: "electronic-circuit",
        Count: 2,
      },

      {
        Entity: "plastic-bar",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "advanced-circuit",
        Count: 1,
      },
    ],
  },

  "processing-unit": {
    Id: "processing-unit",
    Icon: "processing-unit",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 2,
      },

      {
        Entity: "electronic-circuit",
        Count: 20,
      },

      {
        Entity: "sulfuric-acid",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "processing-unit",
        Count: 1,
      },
    ],
  },

  "engine-unit": {
    Id: "engine-unit",
    Icon: "engine-unit",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-gear-wheel",
        Count: 1,
      },

      {
        Entity: "pipe",
        Count: 2,
      },

      {
        Entity: "steel-plate",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "engine-unit",
        Count: 1,
      },
    ],
  },

  "electric-engine-unit": {
    Id: "electric-engine-unit",
    Icon: "electric-engine-unit",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 2,
      },

      {
        Entity: "engine-unit",
        Count: 1,
      },

      {
        Entity: "lubricant",
        Count: 15,
      },
    ],
    Output: [
      {
        Entity: "electric-engine-unit",
        Count: 1,
      },
    ],
  },

  "flying-robot-frame": {
    Id: "flying-robot-frame",
    Icon: "flying-robot-frame",
    DurationSeconds: 20,
    ProductionPerTick: 0.05,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "battery",
        Count: 2,
      },

      {
        Entity: "electric-engine-unit",
        Count: 1,
      },

      {
        Entity: "electronic-circuit",
        Count: 3,
      },

      {
        Entity: "steel-plate",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "flying-robot-frame",
        Count: 1,
      },
    ],
  },

  satellite: {
    Id: "satellite",
    Icon: "satellite",
    DurationSeconds: 5,
    ProductionPerTick: 0.2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "accumulator",
        Count: 100,
      },

      {
        Entity: "low-density-structure",
        Count: 100,
      },

      {
        Entity: "processing-unit",
        Count: 100,
      },

      {
        Entity: "radar",
        Count: 5,
      },

      {
        Entity: "rocket-fuel",
        Count: 50,
      },

      {
        Entity: "solar-panel",
        Count: 100,
      },
    ],
    Output: [
      {
        Entity: "satellite",
        Count: 1,
      },
    ],
  },

  "rocket-control-unit": {
    Id: "rocket-control-unit",
    Icon: "rocket-control-unit",
    DurationSeconds: 30,
    ProductionPerTick: 0.033333335,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "processing-unit",
        Count: 1,
      },

      {
        Entity: "speed-module",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "rocket-control-unit",
        Count: 1,
      },
    ],
  },

  "low-density-structure": {
    Id: "low-density-structure",
    Icon: "low-density-structure",
    DurationSeconds: 20,
    ProductionPerTick: 0.05,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 20,
      },

      {
        Entity: "plastic-bar",
        Count: 5,
      },

      {
        Entity: "steel-plate",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "low-density-structure",
        Count: 1,
      },
    ],
  },

  "rocket-fuel": {
    Id: "rocket-fuel",
    Icon: "rocket-fuel",
    DurationSeconds: 30,
    ProductionPerTick: 0.033333335,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "light-oil",
        Count: 10,
      },

      {
        Entity: "solid-fuel",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "rocket-fuel",
        Count: 1,
      },
    ],
  },

  "nuclear-fuel": {
    Id: "nuclear-fuel",
    Icon: "nuclear-fuel",
    DurationSeconds: 90,
    ProductionPerTick: 0.011111111,
    ProducerType: "Centrifuge",
    Input: [
      {
        Entity: "rocket-fuel",
        Count: 1,
      },

      {
        Entity: "uranium-235",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "nuclear-fuel",
        Count: 1,
      },
    ],
  },

  "uranium-fuel-cell": {
    Id: "uranium-fuel-cell",
    Icon: "uranium-fuel-cell",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-plate",
        Count: 10,
      },

      {
        Entity: "uranium-235",
        Count: 1,
      },

      {
        Entity: "uranium-238",
        Count: 19,
      },
    ],
    Output: [
      {
        Entity: "uranium-fuel-cell",
        Count: 10,
      },
    ],
  },

  "nuclear-fuel-reprocessing": {
    Id: "nuclear-fuel-reprocessing",
    Icon: "nuclear-fuel-reprocessing",
    DurationSeconds: 60,
    ProductionPerTick: 0.016666668,
    ProducerType: "Centrifuge",
    Input: [
      {
        Entity: "used-up-uranium-fuel-cell",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "uranium-238",
        Count: 3,
      },
    ],
  },

  "kovarex-enrichment-process": {
    Id: "kovarex-enrichment-process",
    Icon: "kovarex-enrichment-process",
    DurationSeconds: 60,
    ProductionPerTick: 0.016666668,
    ProducerType: "Centrifuge",
    Input: [
      {
        Entity: "uranium-235",
        Count: 40,
      },

      {
        Entity: "uranium-238",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "uranium-235",
        Count: 41,
      },

      {
        Entity: "uranium-238",
        Count: 2,
      },
    ],
  },

  "automation-science-pack": {
    Id: "automation-science-pack",
    Icon: "automation-science-pack",
    DurationSeconds: 5,
    ProductionPerTick: 0.2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 1,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "automation-science-pack",
        Count: 1,
      },
    ],
  },

  "logistic-science-pack": {
    Id: "logistic-science-pack",
    Icon: "logistic-science-pack",
    DurationSeconds: 6,
    ProductionPerTick: 0.16666667,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "inserter",
        Count: 1,
      },

      {
        Entity: "transport-belt",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "logistic-science-pack",
        Count: 1,
      },
    ],
  },

  "military-science-pack": {
    Id: "military-science-pack",
    Icon: "military-science-pack",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "grenade",
        Count: 1,
      },

      {
        Entity: "piercing-rounds-magazine",
        Count: 1,
      },

      {
        Entity: "stone-wall",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "military-science-pack",
        Count: 2,
      },
    ],
  },

  "chemical-science-pack": {
    Id: "chemical-science-pack",
    Icon: "chemical-science-pack",
    DurationSeconds: 24,
    ProductionPerTick: 0.041666668,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 3,
      },

      {
        Entity: "engine-unit",
        Count: 2,
      },

      {
        Entity: "sulfur",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "chemical-science-pack",
        Count: 2,
      },
    ],
  },

  "production-science-pack": {
    Id: "production-science-pack",
    Icon: "production-science-pack",
    DurationSeconds: 21,
    ProductionPerTick: 0.04761905,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electric-furnace",
        Count: 1,
      },

      {
        Entity: "productivity-module",
        Count: 1,
      },

      {
        Entity: "rail",
        Count: 30,
      },
    ],
    Output: [
      {
        Entity: "production-science-pack",
        Count: 3,
      },
    ],
  },

  "utility-science-pack": {
    Id: "utility-science-pack",
    Icon: "utility-science-pack",
    DurationSeconds: 21,
    ProductionPerTick: 0.04761905,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "flying-robot-frame",
        Count: 1,
      },

      {
        Entity: "low-density-structure",
        Count: 3,
      },

      {
        Entity: "processing-unit",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "utility-science-pack",
        Count: 3,
      },
    ],
  },

  pistol: {
    Id: "pistol",
    Icon: "pistol",
    DurationSeconds: 5,
    ProductionPerTick: 0.2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 5,
      },

      {
        Entity: "iron-plate",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "pistol",
        Count: 1,
      },
    ],
  },

  "submachine-gun": {
    Id: "submachine-gun",
    Icon: "submachine-gun",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 5,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 10,
      },

      {
        Entity: "iron-plate",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "submachine-gun",
        Count: 1,
      },
    ],
  },

  shotgun: {
    Id: "shotgun",
    Icon: "shotgun",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 10,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 5,
      },

      {
        Entity: "iron-plate",
        Count: 15,
      },

      {
        Entity: "wood",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "shotgun",
        Count: 1,
      },
    ],
  },

  "combat-shotgun": {
    Id: "combat-shotgun",
    Icon: "combat-shotgun",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 10,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 5,
      },

      {
        Entity: "steel-plate",
        Count: 15,
      },

      {
        Entity: "wood",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "combat-shotgun",
        Count: 1,
      },
    ],
  },

  "rocket-launcher": {
    Id: "rocket-launcher",
    Icon: "rocket-launcher",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 5,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 5,
      },

      {
        Entity: "iron-plate",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "rocket-launcher",
        Count: 1,
      },
    ],
  },

  flamethrower: {
    Id: "flamethrower",
    Icon: "flamethrower",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-gear-wheel",
        Count: 10,
      },

      {
        Entity: "steel-plate",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "flamethrower",
        Count: 1,
      },
    ],
  },

  "land-mine": {
    Id: "land-mine",
    Icon: "land-mine",
    DurationSeconds: 5,
    ProductionPerTick: 0.2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "explosives",
        Count: 2,
      },

      {
        Entity: "steel-plate",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "land-mine",
        Count: 4,
      },
    ],
  },

  "firearm-magazine": {
    Id: "firearm-magazine",
    Icon: "firearm-magazine",
    DurationSeconds: 1,
    ProductionPerTick: 1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-plate",
        Count: 4,
      },
    ],
    Output: [
      {
        Entity: "firearm-magazine",
        Count: 1,
      },
    ],
  },

  "piercing-rounds-magazine": {
    Id: "piercing-rounds-magazine",
    Icon: "piercing-rounds-magazine",
    DurationSeconds: 3,
    ProductionPerTick: 0.33333334,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 5,
      },

      {
        Entity: "firearm-magazine",
        Count: 1,
      },

      {
        Entity: "steel-plate",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "piercing-rounds-magazine",
        Count: 1,
      },
    ],
  },

  "uranium-rounds-magazine": {
    Id: "uranium-rounds-magazine",
    Icon: "uranium-rounds-magazine",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "piercing-rounds-magazine",
        Count: 1,
      },

      {
        Entity: "uranium-238",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "uranium-rounds-magazine",
        Count: 1,
      },
    ],
  },

  "shotgun-shell": {
    Id: "shotgun-shell",
    Icon: "shotgun-shell",
    DurationSeconds: 3,
    ProductionPerTick: 0.33333334,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 2,
      },

      {
        Entity: "iron-plate",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "shotgun-shell",
        Count: 1,
      },
    ],
  },

  "piercing-shotgun-shell": {
    Id: "piercing-shotgun-shell",
    Icon: "piercing-shotgun-shell",
    DurationSeconds: 8,
    ProductionPerTick: 0.125,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 5,
      },

      {
        Entity: "shotgun-shell",
        Count: 2,
      },

      {
        Entity: "steel-plate",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "piercing-shotgun-shell",
        Count: 1,
      },
    ],
  },

  "cannon-shell": {
    Id: "cannon-shell",
    Icon: "cannon-shell",
    DurationSeconds: 8,
    ProductionPerTick: 0.125,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "explosives",
        Count: 1,
      },

      {
        Entity: "plastic-bar",
        Count: 2,
      },

      {
        Entity: "steel-plate",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "cannon-shell",
        Count: 1,
      },
    ],
  },

  "explosive-cannon-shell": {
    Id: "explosive-cannon-shell",
    Icon: "explosive-cannon-shell",
    DurationSeconds: 8,
    ProductionPerTick: 0.125,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "explosives",
        Count: 2,
      },

      {
        Entity: "plastic-bar",
        Count: 2,
      },

      {
        Entity: "steel-plate",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "explosive-cannon-shell",
        Count: 1,
      },
    ],
  },

  "uranium-cannon-shell": {
    Id: "uranium-cannon-shell",
    Icon: "uranium-cannon-shell",
    DurationSeconds: 12,
    ProductionPerTick: 0.083333336,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "cannon-shell",
        Count: 1,
      },

      {
        Entity: "uranium-238",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "uranium-cannon-shell",
        Count: 1,
      },
    ],
  },

  "explosive-uranium-cannon-shell": {
    Id: "explosive-uranium-cannon-shell",
    Icon: "explosive-uranium-cannon-shell",
    DurationSeconds: 12,
    ProductionPerTick: 0.083333336,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "explosive-cannon-shell",
        Count: 1,
      },

      {
        Entity: "uranium-238",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "explosive-uranium-cannon-shell",
        Count: 1,
      },
    ],
  },

  "artillery-shell": {
    Id: "artillery-shell",
    Icon: "artillery-shell",
    DurationSeconds: 15,
    ProductionPerTick: 0.06666667,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "explosive-cannon-shell",
        Count: 4,
      },

      {
        Entity: "explosives",
        Count: 8,
      },

      {
        Entity: "radar",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "artillery-shell",
        Count: 1,
      },
    ],
  },

  rocket: {
    Id: "rocket",
    Icon: "rocket",
    DurationSeconds: 8,
    ProductionPerTick: 0.125,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 1,
      },

      {
        Entity: "explosives",
        Count: 1,
      },

      {
        Entity: "iron-plate",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "rocket",
        Count: 1,
      },
    ],
  },

  "explosive-rocket": {
    Id: "explosive-rocket",
    Icon: "explosive-rocket",
    DurationSeconds: 8,
    ProductionPerTick: 0.125,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "explosives",
        Count: 2,
      },

      {
        Entity: "rocket",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "explosive-rocket",
        Count: 1,
      },
    ],
  },

  "atomic-bomb": {
    Id: "atomic-bomb",
    Icon: "atomic-bomb",
    DurationSeconds: 50,
    ProductionPerTick: 0.02,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "explosives",
        Count: 10,
      },

      {
        Entity: "rocket-control-unit",
        Count: 10,
      },

      {
        Entity: "uranium-235",
        Count: 30,
      },
    ],
    Output: [
      {
        Entity: "atomic-bomb",
        Count: 1,
      },
    ],
  },

  "flamethrower-ammo": {
    Id: "flamethrower-ammo",
    Icon: "flamethrower-ammo",
    DurationSeconds: 6,
    ProductionPerTick: 0.16666667,
    ProducerType: "ChemPlant",
    Input: [
      {
        Entity: "crude-oil",
        Count: 100,
      },

      {
        Entity: "steel-plate",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "flamethrower-ammo",
        Count: 1,
      },
    ],
  },

  grenade: {
    Id: "grenade",
    Icon: "grenade",
    DurationSeconds: 8,
    ProductionPerTick: 0.125,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "coal",
        Count: 10,
      },

      {
        Entity: "iron-plate",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "grenade",
        Count: 1,
      },
    ],
  },

  "cluster-grenade": {
    Id: "cluster-grenade",
    Icon: "cluster-grenade",
    DurationSeconds: 8,
    ProductionPerTick: 0.125,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "explosives",
        Count: 5,
      },

      {
        Entity: "grenade",
        Count: 7,
      },

      {
        Entity: "steel-plate",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "cluster-grenade",
        Count: 1,
      },
    ],
  },

  "poison-capsule": {
    Id: "poison-capsule",
    Icon: "poison-capsule",
    DurationSeconds: 8,
    ProductionPerTick: 0.125,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "coal",
        Count: 10,
      },

      {
        Entity: "electronic-circuit",
        Count: 3,
      },

      {
        Entity: "steel-plate",
        Count: 3,
      },
    ],
    Output: [
      {
        Entity: "poison-capsule",
        Count: 1,
      },
    ],
  },

  "slowdown-capsule": {
    Id: "slowdown-capsule",
    Icon: "slowdown-capsule",
    DurationSeconds: 8,
    ProductionPerTick: 0.125,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "coal",
        Count: 5,
      },

      {
        Entity: "electronic-circuit",
        Count: 2,
      },

      {
        Entity: "steel-plate",
        Count: 2,
      },
    ],
    Output: [
      {
        Entity: "slowdown-capsule",
        Count: 1,
      },
    ],
  },

  "defender-capsule": {
    Id: "defender-capsule",
    Icon: "defender-capsule",
    DurationSeconds: 8,
    ProductionPerTick: 0.125,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 3,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 3,
      },

      {
        Entity: "piercing-rounds-magazine",
        Count: 3,
      },
    ],
    Output: [
      {
        Entity: "defender-capsule",
        Count: 1,
      },
    ],
  },

  "distractor-capsule": {
    Id: "distractor-capsule",
    Icon: "distractor-capsule",
    DurationSeconds: 15,
    ProductionPerTick: 0.06666667,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 3,
      },

      {
        Entity: "defender-capsule",
        Count: 4,
      },
    ],
    Output: [
      {
        Entity: "distractor-capsule",
        Count: 1,
      },
    ],
  },

  "destroyer-capsule": {
    Id: "destroyer-capsule",
    Icon: "destroyer-capsule",
    DurationSeconds: 15,
    ProductionPerTick: 0.06666667,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "distractor-capsule",
        Count: 4,
      },

      {
        Entity: "speed-module",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "destroyer-capsule",
        Count: 1,
      },
    ],
  },

  "discharge-defense-remote": {
    Id: "discharge-defense-remote",
    Icon: "discharge-defense-remote",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "discharge-defense-remote",
        Count: 1,
      },
    ],
  },

  "artillery-targeting-remote": {
    Id: "artillery-targeting-remote",
    Icon: "artillery-targeting-remote",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "processing-unit",
        Count: 1,
      },

      {
        Entity: "radar",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "artillery-targeting-remote",
        Count: 1,
      },
    ],
  },

  "light-armor": {
    Id: "light-armor",
    Icon: "light-armor",
    DurationSeconds: 3,
    ProductionPerTick: 0.33333334,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "iron-plate",
        Count: 40,
      },
    ],
    Output: [
      {
        Entity: "light-armor",
        Count: 1,
      },
    ],
  },

  "heavy-armor": {
    Id: "heavy-armor",
    Icon: "heavy-armor",
    DurationSeconds: 8,
    ProductionPerTick: 0.125,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 100,
      },

      {
        Entity: "steel-plate",
        Count: 50,
      },
    ],
    Output: [
      {
        Entity: "heavy-armor",
        Count: 1,
      },
    ],
  },

  "modular-armor": {
    Id: "modular-armor",
    Icon: "modular-armor",
    DurationSeconds: 15,
    ProductionPerTick: 0.06666667,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 30,
      },

      {
        Entity: "steel-plate",
        Count: 50,
      },
    ],
    Output: [
      {
        Entity: "modular-armor",
        Count: 1,
      },
    ],
  },

  "power-armor": {
    Id: "power-armor",
    Icon: "power-armor",
    DurationSeconds: 20,
    ProductionPerTick: 0.05,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electric-engine-unit",
        Count: 20,
      },

      {
        Entity: "processing-unit",
        Count: 40,
      },

      {
        Entity: "steel-plate",
        Count: 40,
      },
    ],
    Output: [
      {
        Entity: "power-armor",
        Count: 1,
      },
    ],
  },

  "power-armor-mk2": {
    Id: "power-armor-mk2",
    Icon: "power-armor-mk2",
    DurationSeconds: 25,
    ProductionPerTick: 0.04,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "effectivity-module-2",
        Count: 25,
      },

      {
        Entity: "electric-engine-unit",
        Count: 40,
      },

      {
        Entity: "low-density-structure",
        Count: 30,
      },

      {
        Entity: "processing-unit",
        Count: 60,
      },

      {
        Entity: "speed-module-2",
        Count: 25,
      },
    ],
    Output: [
      {
        Entity: "power-armor-mk2",
        Count: 1,
      },
    ],
  },

  "solar-panel-equipment": {
    Id: "solar-panel-equipment",
    Icon: "solar-panel-equipment",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 2,
      },

      {
        Entity: "solar-panel",
        Count: 1,
      },

      {
        Entity: "steel-plate",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "solar-panel-equipment",
        Count: 1,
      },
    ],
  },

  "fusion-reactor-equipment": {
    Id: "fusion-reactor-equipment",
    Icon: "fusion-reactor-equipment",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "low-density-structure",
        Count: 50,
      },

      {
        Entity: "processing-unit",
        Count: 200,
      },
    ],
    Output: [
      {
        Entity: "fusion-reactor-equipment",
        Count: 1,
      },
    ],
  },

  "energy-shield-equipment": {
    Id: "energy-shield-equipment",
    Icon: "energy-shield-equipment",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 5,
      },

      {
        Entity: "steel-plate",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "energy-shield-equipment",
        Count: 1,
      },
    ],
  },

  "energy-shield-mk2-equipment": {
    Id: "energy-shield-mk2-equipment",
    Icon: "energy-shield-mk2-equipment",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "energy-shield-equipment",
        Count: 10,
      },

      {
        Entity: "low-density-structure",
        Count: 5,
      },

      {
        Entity: "processing-unit",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "energy-shield-mk2-equipment",
        Count: 1,
      },
    ],
  },

  "battery-equipment": {
    Id: "battery-equipment",
    Icon: "battery-equipment",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "battery",
        Count: 5,
      },

      {
        Entity: "steel-plate",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "battery-equipment",
        Count: 1,
      },
    ],
  },

  "battery-mk2-equipment": {
    Id: "battery-mk2-equipment",
    Icon: "battery-mk2-equipment",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "battery-equipment",
        Count: 10,
      },

      {
        Entity: "low-density-structure",
        Count: 5,
      },

      {
        Entity: "processing-unit",
        Count: 15,
      },
    ],
    Output: [
      {
        Entity: "battery-mk2-equipment",
        Count: 1,
      },
    ],
  },

  "personal-laser-defense-equipment": {
    Id: "personal-laser-defense-equipment",
    Icon: "personal-laser-defense-equipment",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "laser-turret",
        Count: 5,
      },

      {
        Entity: "low-density-structure",
        Count: 5,
      },

      {
        Entity: "processing-unit",
        Count: 20,
      },
    ],
    Output: [
      {
        Entity: "personal-laser-defense-equipment",
        Count: 1,
      },
    ],
  },

  "discharge-defense-equipment": {
    Id: "discharge-defense-equipment",
    Icon: "discharge-defense-equipment",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "laser-turret",
        Count: 10,
      },

      {
        Entity: "processing-unit",
        Count: 5,
      },

      {
        Entity: "steel-plate",
        Count: 20,
      },
    ],
    Output: [
      {
        Entity: "discharge-defense-equipment",
        Count: 1,
      },
    ],
  },

  "belt-immunity-equipment": {
    Id: "belt-immunity-equipment",
    Icon: "belt-immunity-equipment",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 5,
      },

      {
        Entity: "steel-plate",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "belt-immunity-equipment",
        Count: 1,
      },
    ],
  },

  "exoskeleton-equipment": {
    Id: "exoskeleton-equipment",
    Icon: "exoskeleton-equipment",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electric-engine-unit",
        Count: 30,
      },

      {
        Entity: "processing-unit",
        Count: 10,
      },

      {
        Entity: "steel-plate",
        Count: 20,
      },
    ],
    Output: [
      {
        Entity: "exoskeleton-equipment",
        Count: 1,
      },
    ],
  },

  "personal-roboport-equipment": {
    Id: "personal-roboport-equipment",
    Icon: "personal-roboport-equipment",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 10,
      },

      {
        Entity: "battery",
        Count: 45,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 40,
      },

      {
        Entity: "steel-plate",
        Count: 20,
      },
    ],
    Output: [
      {
        Entity: "personal-roboport-equipment",
        Count: 1,
      },
    ],
  },

  "personal-roboport-mk2-equipment": {
    Id: "personal-roboport-mk2-equipment",
    Icon: "personal-roboport-mk2-equipment",
    DurationSeconds: 20,
    ProductionPerTick: 0.05,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "low-density-structure",
        Count: 20,
      },

      {
        Entity: "personal-roboport-equipment",
        Count: 5,
      },

      {
        Entity: "processing-unit",
        Count: 100,
      },
    ],
    Output: [
      {
        Entity: "personal-roboport-mk2-equipment",
        Count: 1,
      },
    ],
  },

  "night-vision-equipment": {
    Id: "night-vision-equipment",
    Icon: "night-vision-equipment",
    DurationSeconds: 10,
    ProductionPerTick: 0.1,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 5,
      },

      {
        Entity: "steel-plate",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "night-vision-equipment",
        Count: 1,
      },
    ],
  },

  "stone-wall": {
    Id: "stone-wall",
    Icon: "stone-wall",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "stone-brick",
        Count: 5,
      },
    ],
    Output: [
      {
        Entity: "stone-wall",
        Count: 1,
      },
    ],
  },

  gate: {
    Id: "gate",
    Icon: "gate",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 2,
      },

      {
        Entity: "steel-plate",
        Count: 2,
      },

      {
        Entity: "stone-wall",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "gate",
        Count: 1,
      },
    ],
  },

  "gun-turret": {
    Id: "gun-turret",
    Icon: "gun-turret",
    DurationSeconds: 8,
    ProductionPerTick: 0.125,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "copper-plate",
        Count: 10,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 10,
      },

      {
        Entity: "iron-plate",
        Count: 20,
      },
    ],
    Output: [
      {
        Entity: "gun-turret",
        Count: 1,
      },
    ],
  },

  "laser-turret": {
    Id: "laser-turret",
    Icon: "laser-turret",
    DurationSeconds: 20,
    ProductionPerTick: 0.05,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "battery",
        Count: 12,
      },

      {
        Entity: "electronic-circuit",
        Count: 20,
      },

      {
        Entity: "steel-plate",
        Count: 20,
      },
    ],
    Output: [
      {
        Entity: "laser-turret",
        Count: 1,
      },
    ],
  },

  "flamethrower-turret": {
    Id: "flamethrower-turret",
    Icon: "flamethrower-turret",
    DurationSeconds: 20,
    ProductionPerTick: 0.05,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "engine-unit",
        Count: 5,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 15,
      },

      {
        Entity: "pipe",
        Count: 10,
      },

      {
        Entity: "steel-plate",
        Count: 30,
      },
    ],
    Output: [
      {
        Entity: "flamethrower-turret",
        Count: 1,
      },
    ],
  },

  "artillery-turret": {
    Id: "artillery-turret",
    Icon: "artillery-turret",
    DurationSeconds: 40,
    ProductionPerTick: 0.025,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "advanced-circuit",
        Count: 20,
      },

      {
        Entity: "concrete",
        Count: 60,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 40,
      },

      {
        Entity: "steel-plate",
        Count: 60,
      },
    ],
    Output: [
      {
        Entity: "artillery-turret",
        Count: 1,
      },
    ],
  },

  radar: {
    Id: "radar",
    Icon: "radar",
    DurationSeconds: 0.5,
    ProductionPerTick: 2,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "electronic-circuit",
        Count: 5,
      },

      {
        Entity: "iron-gear-wheel",
        Count: 5,
      },

      {
        Entity: "iron-plate",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "radar",
        Count: 1,
      },
    ],
  },

  "rocket-silo": {
    Id: "rocket-silo",
    Icon: "rocket-silo",
    DurationSeconds: 30,
    ProductionPerTick: 0.033333335,
    ProducerType: "Assembler",
    Input: [
      {
        Entity: "concrete",
        Count: 1000,
      },

      {
        Entity: "electric-engine-unit",
        Count: 200,
      },

      {
        Entity: "pipe",
        Count: 100,
      },

      {
        Entity: "processing-unit",
        Count: 200,
      },

      {
        Entity: "steel-plate",
        Count: 1000,
      },
    ],
    Output: [
      {
        Entity: "rocket-silo",
        Count: 1,
      },
    ],
  },

  "iron-ore": {
    Id: "iron-ore",
    Icon: "iron-ore",
    DurationSeconds: 1,
    ProductionPerTick: 1,
    ProducerType: "Miner",
    Input: [
      {
        Entity: "iron-ore",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "iron-ore",
        Count: 1,
      },
    ],
  },

  "copper-ore": {
    Id: "copper-ore",
    Icon: "copper-ore",
    DurationSeconds: 1,
    ProductionPerTick: 1,
    ProducerType: "Miner",
    Input: [
      {
        Entity: "copper-ore",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "copper-ore",
        Count: 1,
      },
    ],
  },

  coal: {
    Id: "coal",
    Icon: "coal",
    DurationSeconds: 1,
    ProductionPerTick: 1,
    ProducerType: "Miner",
    Input: [
      {
        Entity: "coal",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "coal",
        Count: 1,
      },
    ],
  },

  stone: {
    Id: "stone",
    Icon: "stone",
    DurationSeconds: 1,
    ProductionPerTick: 1,
    ProducerType: "Miner",
    Input: [
      {
        Entity: "stone",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "stone",
        Count: 1,
      },
    ],
  },

  "uranium-ore": {
    Id: "uranium-ore",
    Icon: "uranium-ore",
    DurationSeconds: 2,
    ProductionPerTick: 0.5,
    ProducerType: "Miner",
    Input: [
      {
        Entity: "sulfuric-acid",
        Count: 10,
      },
    ],
    Output: [
      {
        Entity: "uranium-ore",
        Count: 1,
      },
    ],
  },

  "crude-oil": {
    Id: "crude-oil",
    Icon: "crude-oil",
    DurationSeconds: 1,
    ProductionPerTick: 1,
    ProducerType: "Pumpjack",
    Input: [
      {
        Entity: "crude-oil",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "crude-oil",
        Count: 1,
      },
    ],
  },

  water: {
    Id: "water",
    Icon: "water",
    DurationSeconds: 1,
    ProductionPerTick: 1,
    ProducerType: "WaterPump",
    Input: [
      {
        Entity: "water",
        Count: 1,
      },
    ],
    Output: [
      {
        Entity: "water",
        Count: 60,
      },
    ],
  },

  steam: {
    Id: "steam",
    Icon: "steam",
    DurationSeconds: 1,
    ProductionPerTick: 1,
    ProducerType: "Boiler",
    Input: [
      {
        Entity: "water",
        Count: 60,
      },
    ],
    Output: [
      {
        Entity: "steam",
        Count: 60,
      },
    ],
  },
});
