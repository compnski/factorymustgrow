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

export type EntityStack = {
  Entity: string;
  Count: number;
  MaxCount?: number;
};

export function NewEntityStack(
  e: string,
  maxCount: number = 0,
  initialCount: number = 0
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
    return 0;
  }
}

export type Entity = {
  Name: string;
  Icon: string;
  Id: string;
  StackSize: number;
  StorageUpgradeType: "Liquid" | "Solid";
  ResearchUpgradeItems: EntityStack[];
};

export type Region = {
  Ore: Map<string, EntityStack>;
  Capacity: number;
};

// clasas ProducingEntity {
//   inputBuffers?: Map<string, EntityStack>;
//   outputBuffer?: EntityStack;

//   RecipeName: string;
//   ProducerCount: number;
//   //  ProducerCapacityUpgradeCount: number;
//   //  ProducerMaxCapacityUpgradeCount: number;
//   //  ResearchUpgradeCount: number;
// }
