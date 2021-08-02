export interface Producer {
  kind: string;
  RecipeId: string;
  inputBuffers: Map<string, EntityStack>;
  outputBuffers: Map<string, EntityStack>;
  ProducerCount: number;
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
  | "Lab";

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

export type Region = {
  Ore: Map<string, EntityStack>;
  BuildingCapacity: number;
  Buildings: Producer[];
  Bus: MainBus;
};

export const NewRegion = (
  BuildingCapacity: number,
  ore: EntityStack[],
  Buildings: Producer[] = []
): Region => ({
  BuildingCapacity,
  Ore: new Map(ore.map((es) => [es.Entity, es])),
  Buildings,
  Bus: new MainBus(),
});

export type BusLane = {
  Id: number;
  Count: number;
  Entity: string;
  MaxCount?: number;
};

export const NewBusLane = (
  Id: number,
  Entity: string,
  initialCount: number = 0
): BusLane => ({
  Id,
  Entity,
  Count: initialCount,
  MaxCount: 50,
});

export class MainBus {
  lanes: Map<number, EntityStack>;
  nextLaneId: number = 1;

  constructor(
    firstLaneId: number = 1,
    lanes: Map<number, EntityStack> = new Map()
  ) {
    this.lanes = lanes;
    this.nextLaneId = firstLaneId;
  }

  AddLane(Entity: string, initialCount: number = 0): number {
    const laneId = this.nextLaneId++;
    this.lanes.set(laneId, NewBusLane(laneId, Entity, initialCount));
    return laneId;
  }

  RemoveLane(id: number): EntityStack | null {
    const contents = this.lanes.get(id);
    this.lanes.delete(id);
    return contents || null;
  }

  HasLane(id: number): boolean {
    return this.lanes.has(id);
  }
}
