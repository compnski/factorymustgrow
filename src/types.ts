import { BuildingSlot, NewBuildingSlot, NewEmptyLane } from "./building";
import { Inserter } from "./inserter";
import { FixedInventory } from "./inventory";
import { MainBus } from "./mainbus";

export function IsItemBuffer(i: ItemBuffer | EntityStack): boolean {
  return (i as ItemBuffer).AvailableSpace !== undefined;
}

export interface ItemBuffer {
  Accepts(entity: string): boolean;
  // How many of this item can fit
  AvailableSpace(entity: string): number;

  Count(entity: string): number;
  Add(
    fromStack: EntityStack,
    count?: number,
    exceedCapacity?: boolean,
    integersOnly?: boolean
  ): number;
  AddFromItemBuffer(
    from: ItemBuffer,
    entity: string,
    itemCount?: number,
    exceedCapacity?: boolean,
    integersOnly?: boolean
  ): number;

  Remove(toStack: EntityStack, count?: number, integersOnly?: boolean): number;
  Entities(): [entity: string, count: number][];
  Slots(): [entity: string, count: number][];
  Capacity: number;
}

export interface Producer {
  kind: string;
  subkind: string;
  RecipeId: string;
  ProducerType: string;
  inputBuffers: ItemBuffer;
  outputBuffers: ItemBuffer;
  BuildingCount: number;
}

export type Research = {
  Id: string;
  Name: string;
  Icon: string;
  Input: EntityStack[];
  // How many units of research must be produced (at Input cost) to learn this research
  ProductionRequiredForCompletion: number;
  ProductionPerTick: number;
  DurationSeconds: number;
  Row: number;
  Prereqs: Set<string>;
  Unlocks: string[];
  Effects: string[];
};

export type BuildingType =
  | "Assembler"
  | "Smelter"
  | "Miner"
  | "ChemPlant"
  | "Refinery"
  | "Pumpjack"
  | "Centrifuge"
  | "WaterPump"
  | "Boiler"
  | "Lab"
  | "RocketSilo"
  | "Depot"
  | "Chest"
  | "Empty";

export type Recipe = {
  Icon: string;
  Id: string;
  ProducerType: BuildingType;
  DurationSeconds: number;
  Input: EntityStack[];
  Output: EntityStack[];
  ProductionPerTick: number;
};

//const ProductionPerTick = (r: Recipe): number => 1 / r.DurationSeconds;

export type EntityStack = {
  Entity: string;
  Count: number;
  MaxCount?: number;
};

export function NewEntityStack(
  e: string | Entity,
  initialCount = 0,
  maxCount = 0
): EntityStack {
  const entityId = typeof e === "string" ? e : e.Id;
  const stackSize = typeof e === "string" ? 0 : e.StackSize;
  return {
    Entity: entityId,
    Count: initialCount,
    MaxCount: maxCount || stackSize,
  };
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
  Category: string;
  Row: number;
  Col: number;
};

export type BeltConnection =
  | {
      laneId: number;
      direction: "TO_BUS" | "FROM_BUS";
      Inserter: Inserter;
    }
  | {
      Inserter: Inserter;
      laneId: undefined;
      direction: undefined;
    };

export type RegionInfo = {
  Id: string;
  Cost: EntityStack[];
  Provides: EntityStack[];
  LaneCount: number;
  LaneSize: number;
  MainBusCount: number;
  AdjacentTo: string[];
};

export type Region = {
  Id: string;
  Ore: ItemBuffer;
  LaneCount: number;
  LaneSize: number;
  MainBusCount: number;
  BuildingSlots: BuildingSlot[];
  //Inserters: Inserter[];
  Bus: MainBus;
};

export const NewRegion = (
  id: string,
  LaneCount: number,
  LaneSize: number,
  MainBusCount: number,
  ore: EntityStack[],
  BuildingSlots: BuildingSlot[] = []
): Region => {
  if (BuildingSlots.length > LaneCount) {
    throw new Error(
      `Trying to construct region with more building slots ${BuildingSlots.length} than lanes ${LaneCount}.`
    );
  } else if (BuildingSlots.length < LaneCount) {
    for (let idx = BuildingSlots.length; idx < LaneCount; idx++) {
      BuildingSlots.push(NewBuildingSlot(NewEmptyLane()));
    }
  }
  return {
    Id: id,
    LaneCount,
    LaneSize,
    MainBusCount,
    Ore: FixedInventory(ore),
    BuildingSlots,
    Bus: new MainBus(),
  };
};

export function NewRegionFromInfo(info: RegionInfo): Region {
  return NewRegion(info.Id, info.LaneCount, info.LaneSize, info.MainBusCount, [
    ...info.Provides,
  ]);
}
