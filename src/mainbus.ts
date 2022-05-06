import { ImmutableMap } from "./immutable";
import { ReadonlyInventory } from "./inventory";
import { ReadonlyItemBuffer } from "./useGameState";

export const NewBusLane = (
  Id: number,
  Entity: string,
  initialCount = 0
): ReadonlyItemBuffer => {
  const inv = new ReadonlyInventory(1, ImmutableMap([[Entity, initialCount]]));
  return inv;
};

export class ReadonlyMainBus {
  readonly lanes: ReadonlyMap<number, ReadonlyItemBuffer>;
  readonly nextLaneId: number;

  constructor({
    lanes,
    nextLaneId,
  }: {
    lanes: ReadonlyMap<number, ReadonlyItemBuffer>;
    nextLaneId: number;
  }) {
    this.lanes = lanes;
    this.nextLaneId = nextLaneId;
  }

  HasLane(id: number): boolean {
    return this.lanes.has(id);
  }

  CanAddLane(): boolean {
    return this.lanes.size < 10;
  }

  Lane(id: number): ReadonlyItemBuffer {
    const lane = this.lanes.get(id);
    if (!lane) throw new Error(`Lane ${id} not found`);
    return lane;
  }
}

export class MainBus {
  lanes: Map<number, ReadonlyItemBuffer>;
  nextLaneId = 1;
  kind = "MainBus";

  constructor(
    firstLaneId = 1,
    lanes: Map<number, ReadonlyItemBuffer> = new Map()
  ) {
    this.lanes = lanes;
    this.nextLaneId = firstLaneId;
  }

  AddLane(Entity: string, initialCount = 0): number {
    const laneId = this.nextLaneId++;
    this.lanes.set(laneId, NewBusLane(laneId, Entity, initialCount));
    return laneId;
  }

  RemoveLane(id: number): ReadonlyItemBuffer | null {
    const contents = this.lanes.get(id);
    this.lanes.delete(id);
    return contents || null;
  }

  HasLane(id: number): boolean {
    return this.lanes.has(id);
  }

  CanAddLane(): boolean {
    return this.lanes.size < 10;
  }

  Lane(id: number): ReadonlyItemBuffer {
    const lane = this.lanes.get(id);
    if (!lane) throw new Error(`Lane ${id} not found`);
    return lane;
  }
}
