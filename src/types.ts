export interface ProducingEntity {
  RecipeName: string;
  ProducerCount: number;
  ProducerCapacityUpgradeCount: number;
  ProducerMaxCapacityUpgradeCount: number;
  ResearchUpgradeCount: number;
  // CurrentRate(): number;
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
  Id: string;
  ProducerType: ProducerType;
  DurationSeconds: number;
  Input: EntityStack[];
  Output: EntityStack;
  ProductionPerTick: number;
};

//const ProductionPerTick = (r: Recipe): number => 1 / r.DurationSeconds;

export type EntityStack = {
  Entity: string;
  Count: number;
  MaxCount?: number;
};

export function NewEntityStack(
  e: string,
  initialCount: number = 0,
  maxCount: number = 0
): EntityStack {
  return { Entity: e, Count: initialCount, MaxCount: maxCount };
}

// Fills an entity stack with items, returns any overflow
export function FillEntityStack(e: EntityStack, n: number): number {
  if (e.MaxCount) {
    if (e.Count + n > e.MaxCount) {
      const delta = e.MaxCount - e.Count;
      e.Count = e.MaxCount;
      return delta;
    }
    e.Count += n;
  }
  return 0;
}

export type Entity = {
  Name: string;
  Icon: string;
  Id: string;
  StackSize: number;
  StorageUpgradeType: "Liquid" | "Solid";
  ResearchUpgradeItems: EntityStack[];
};

export type OutputStatus = {
  above: "OUT" | "IN" | "NONE";
  below: "OUT" | "IN" | "NONE";
  beltConnections: { beltId: number; direction: "TO_BUS" | "FROM_BUS" }[];
};

export interface Producer {
  kind: string;
  RecipeId: string;
  inputBuffers?: Map<string, EntityStack>;
  outputBuffer: EntityStack;
  ProducerCount: number;
  outputStatus: OutputStatus;
}

export type Region = {
  Ore: Map<string, EntityStack>;
  BuildingCapacity: number;
  Buildings: Producer[];
};

export const NewRegion = (
  BuildingCapacity: number,
  ore: EntityStack[],
  Buildings: Producer[] = []
): Region => ({
  BuildingCapacity,
  Ore: new Map(ore.map((es) => [es.Entity, es])),
  Buildings,
});

// clasas ProducingEntity {
//   inputBuffers?: Map<string, EntityStack>;
//   outputBuffer?: EntityStack;

//   RecipeName: string;
//   ProducerCount: number;
//   //  ProducerCapacityUpgradeCount: number;
//   //  ProducerMaxCapacityUpgradeCount: number;
//   //  ResearchUpgradeCount: number;
// }
