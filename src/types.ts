export interface ProducingEntity {
  Recipe: Recipe;
  ProducerCount: number;
  ProducerCapacityUpgradeCount: number;
  ProducerMaxCapacityUpgradeCount: number;
  ResearchUpgradeCount: number;
  //    CurrentRate():number;
  //    CurrentMaxProducerCount():number;
}

export type ProducerType =
  | "Assembler"
  | "Smelter"
  | "Miner"
  | "ChemFactory"
  | "Refinery"
  | "Pumpjack";

export type Recipe = {
  Name: string;
  Icon: string;
  ProducerType: ProducerType;
  DurationSeconds: number;
  Input: EntityStack[];
  Output: EntityStack[];
};

export type EntityStack = {
  Entity: Entity;
  Count: number;
};

export type Entity = {
  Name: string;
  Icon: string;
  StackSize: number;
  StorageUpgradeType: "Liquid" | "Solid";
  ResearchUpgradeItems: EntityStack[];
};
