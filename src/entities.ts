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

export const CopperOre: Entity = {
  Name: "Copper Ore",
  Icon: "copper-ore",
  StackSize: 100,
  StorageUpgradeType: "Solid",
  ResearchUpgradeItems: [],
};

export const CopperPlate: Entity = {
  Name: "Copper Plate",
  Icon: "copper-plate",
  StackSize: 100,
  StorageUpgradeType: "Solid",
  ResearchUpgradeItems: [],
};

export const CopperWire: Entity = {
  Name: "Copper Wire",
  Icon: "copper-cable",
  StackSize: 100,
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

export const Gear: Entity = {
  Name: "Gear",
  Icon: "iron-gear-wheel",
  StackSize: 100,
  StorageUpgradeType: "Solid",
  ResearchUpgradeItems: [],
};

export const GreenChip: Entity = {
  Name: "Green Chip",
  Icon: "electronic-circuit",
  StackSize: 100,
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

export const CopperOreRecipe: Recipe = {
  Name: "Copper Ore",
  Icon: "copper-ore",
  DurationSeconds: 1,
  ProducerType: "Miner",
  Input: [],
  Output: [
    {
      Entity: CopperOre,
      Count: 1,
    },
  ],
};

export const CopperPlateRecipe: Recipe = {
  Name: "Copper Plate",
  Icon: "copper-plate",
  DurationSeconds: 1,
  ProducerType: "Smelter",
  Input: [
    {
      Entity: CopperOre,
      Count: 1,
    },
  ],
  Output: [
    {
      Entity: CopperPlate,
      Count: 1,
    },
  ],
};

export const GearRecipe: Recipe = {
  Name: "Gear",
  Icon: "iron-gear-wheel",
  DurationSeconds: 1,
  ProducerType: "Assembler",
  Input: [
    {
      Entity: IronPlate,
      Count: 2,
    },
  ],
  Output: [
    {
      Entity: Gear,
      Count: 1,
    },
  ],
};

export const CopperWireRecipe: Recipe = {
  Name: "Copper Wire",
  Icon: "copper-cable",
  DurationSeconds: 1,
  ProducerType: "Assembler",
  Input: [
    {
      Entity: CopperPlate,
      Count: 1,
    },
  ],
  Output: [
    {
      Entity: CopperWire,
      Count: 2,
    },
  ],
};

export const GreenChipRecipe: Recipe = {
  Name: "Green Chip",
  Icon: "electronic-circuit",
  DurationSeconds: 1,
  ProducerType: "Assembler",
  Input: [
    {
      Entity: CopperWire,
      Count: 3,
    },
    {
      Entity: IronPlate,
      Count: 1,
    },
  ],
  Output: [
    {
      Entity: GreenChip,
      Count: 1,
    },
  ],
};

export const MinerRecipe: Recipe = {
  Name: "Miner",
  Icon: "electric-mining-drill",
  DurationSeconds: 1,
  ProducerType: "Assembler",
  Input: [
    {
      Entity: IronPlate,
      Count: 10,
    },
    {
      Entity: Gear,
      Count: 5,
    },
    {
      Entity: GreenChip,
      Count: 3,
    },
  ],
  Output: [
    {
      Entity: Miner,
      Count: 1,
    },
  ],
};

export const AssemblerRecipe: Recipe = {
  Name: "Assembler",
  Icon: "assembling-machine-1",
  DurationSeconds: 1,
  ProducerType: "Assembler",
  Input: [
    {
      Entity: IronPlate,
      Count: 9,
    },
    {
      Entity: Gear,
      Count: 5,
    },
    {
      Entity: GreenChip,
      Count: 3,
    },
  ],
  Output: [
    {
      Entity: Assembler,
      Count: 1,
    },
  ],
};
