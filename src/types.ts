import { Building } from "./building";
import { FixedInventory, Inventory } from "./inventory";
import { MainBus } from "./mainbus";

export function IsItemBuffer(i: ItemBuffer | EntityStack): boolean {
  return (i as ItemBuffer).CanFit !== undefined;
}

export interface ItemBuffer {
  Accepts(entity: string): boolean;
  // How many of this item can fit
  AvailableSpace(entity: string): number;

  CanFit(entity: EntityStack | ItemBuffer): boolean;
  //Contains(entity: string, count?: number): boolean;
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
  outputStatus: OutputStatus;
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

export type ProducerType =
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
  | "Depot";

export type Recipe = {
  //  Name: string;
  Icon: string;
  Id: string;
  ProducerType: ProducerType;
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
  initialCount: number = 0,
  maxCount: number = 0
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

export type BeltConnection = {
  beltId: number;
  direction: "TO_BUS" | "FROM_BUS";
};
export type OutputStatus = {
  above: "OUT" | "NONE";
  below: "OUT" | "NONE";
  beltConnections: BeltConnection[];
};

export type RegionInfo = {
  Id: string;
  Cost: EntityStack[];
  Provides: EntityStack[];
  Capacity: number;
  MainBusCapacity: number;
  AdjacentTo: string[];
};

export type Region = {
  Id: string;
  Ore: ItemBuffer;
  BuildingCapacity: number;
  MainBusCapacity: number;
  Buildings: Building[];
  Bus: MainBus;
};

export const NewRegion = (
  id: string,
  BuildingCapacity: number,
  MainBusCapacity: number,
  ore: EntityStack[],
  Buildings: Building[] = [],
  getEntity?: (e: string) => Entity
): Region => ({
  Id: id,
  BuildingCapacity,
  MainBusCapacity,
  Ore: FixedInventory(ore, getEntity),
  Buildings,
  Bus: new MainBus(),
});

export function NewRegionFromInfo(info: RegionInfo): Region {
  return NewRegion(info.Id, info.Capacity, info.MainBusCapacity, [
    ...info.Provides,
  ]);
}
