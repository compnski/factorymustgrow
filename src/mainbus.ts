import { FixedInventory } from "./inventory";
import { ItemBuffer } from "./types";

export const NewBusLane = (
  Id: number,
  Entity: string,
  initialCount: number = 0
): ItemBuffer =>
  FixedInventory([
    {
      Entity,
      Count: initialCount,
      MaxCount: 50,
    },
  ]);

export class MainBus {
  lanes: Map<number, ItemBuffer>;
  nextLaneId: number = 1;

  constructor(
    firstLaneId: number = 1,
    lanes: Map<number, ItemBuffer> = new Map()
  ) {
    this.lanes = lanes;
    this.nextLaneId = firstLaneId;
  }

  AddLane(Entity: string, initialCount: number = 0): number {
    const laneId = this.nextLaneId++;
    this.lanes.set(laneId, NewBusLane(laneId, Entity, initialCount));
    return laneId;
  }

  RemoveLane(id: number): ItemBuffer | null {
    const contents = this.lanes.get(id);
    this.lanes.delete(id);
    return contents || null;
  }

  HasLane(id: number): boolean {
    return this.lanes.has(id);
  }
}
