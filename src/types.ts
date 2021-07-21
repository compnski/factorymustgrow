// export interface ProducingEntity {
//   RecipeName: string;
//   ProducerCount: number;
//   ProducerCapacityUpgradeCount: number;
//   ProducerMaxCapacityUpgradeCount: number;
//   ResearchUpgradeCount: number;
//   // CurrentRate(): number;
//   //    CurrentMaxProducerCount():number;
// }

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
  Id: string;
  ProducerType: ProducerType;
  DurationSeconds: number;
  Input: EntityStack[];
  Output: EntityStack[];
};

export type EntityStack = {
  Entity: string;
  Count: number;
  MaxCount?: number;
};

export type Entity = {
  Name: string;
  Icon: string;
  Id: string;
  StackSize: number;
  StorageUpgradeType: "Liquid" | "Solid";
  ResearchUpgradeItems: EntityStack[];
};

export type Region = {
  Ore: EntityStack[];
  Capacity: number;
};

type EntityKind = "iron-ore" | "iron-gear";

class ProducingEntity {
  inputBuffers?: Map<string, EntityStack>;
  outputBuffer?: EntityStack;

  RecipeName: string;
  ProducerCount: number;
  //  ProducerCapacityUpgradeCount: number;
  //  ProducerMaxCapacityUpgradeCount: number;
  //  ResearchUpgradeCount: number;
}

interface Producer {
  inputBuffers?: Map<string, EntityStack>;
  outputBuffer?: EntityStack;
  produce(): Producer;
}

type MainBus = {
  lanes: Map<number, EntityStack>;
};

type OutputStatus = {
  above: "OUT" | "IN" | "NONE";
  below: "OUT" | "IN" | "NONE";
  beltConnections: { beltId: number; direction: "OUT" | "IN" }[];
};

type Extractor = {};

type TrainStation = {};
type Factory = {};
