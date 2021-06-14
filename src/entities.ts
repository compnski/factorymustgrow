import { Entity, Recipe } from "./types";

export const Assembler: Entity = {
  Name: "Assembler",
  Icon: "assembling-machine-1",
  StackSize: 50,
  StorageUpgradeType: "Solid",
  ResearchUpgradeItems: [],
};

export const YellowBelt: Entity = {
  Name: "Yellow Belt",
  Icon: "transport-belt",
  StackSize: 100,
  StorageUpgradeType: "Solid",
  ResearchUpgradeItems: [],
};

export const Miner: Entity = {
  Name: "Miner",
  Icon: "electric-mining-drill",
  StackSize: 50,
  StorageUpgradeType: "Solid",
  ResearchUpgradeItems: [],
};

export const IronOre: Entity = {
  Name: "Iron Ore",
  Icon: "iron-ore",
  StackSize: 50,
  StorageUpgradeType: "Solid",
  ResearchUpgradeItems: [],
};

export const StoneFurnace: Entity = {
  Name: "Stone Furnace",
  Icon: "stone-furnace",
  StackSize: 50,
  StorageUpgradeType: "Solid",
  ResearchUpgradeItems: [],
};

export const IronPlate: Entity = {
  Name: "Iron Plate",
  Icon: "iron-plate",
  StackSize: 50,
  StorageUpgradeType: "Solid",
  ResearchUpgradeItems: [],
};

export const IronOreRecipe: Recipe = {
  Name: "Iron Ore",
  Icon: "iron-ore",
  DurationSeconds: 1,
  ProducerType: "Miner",
  Input: [],
  Output: [
    {
      Entity: IronOre,
      Count: 1,
    },
  ],
};

export const IronPlateRecipe: Recipe = {
  Name: "Iron Plate",
  Icon: "iron-plate",
  DurationSeconds: 1,
  ProducerType: "Smelter",
  Input: [
    {
      Entity: IronOre,
      Count: 1,
    },
  ],
  Output: [
    {
      Entity: IronPlate,
      Count: 1,
    },
  ],
};
