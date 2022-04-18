import { FixedInventory } from "./inventory";
import { ItemBuffer } from "./types";

export const NewBusLane = (
  Id: number,
  Entity: string,
  initialCount = 0
): ItemBuffer => {
  const inv = FixedInventory([
    {
      Entity,
      Count: initialCount,
      MaxCount: 50,
    },
  ]);
  return inv;
};
export class MainBus {
  lanes: Map<number, ItemBuffer>;
  nextLaneId = 1;
  kind = "MainBus";

  constructor(firstLaneId = 1, lanes: Map<number, ItemBuffer> = new Map()) {
    this.lanes = lanes;
    this.nextLaneId = firstLaneId;
  }

  AddLane(Entity: string, initialCount = 0): number {
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

  CanAddLane(): boolean {
    return this.lanes.size < 10;
  }
}
