import { GetEntity } from "./gen/entities";
import { FixedInventory } from "./inventory";
import { Entity, ItemBuffer } from "./types";

export const NewBusLane = (
  getEntity: (e: string) => Entity,
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
  inv.getEntity = getEntity;
  return inv;
};

export interface ReadOnlyMainBus {
  HasLane(id: number): boolean;
  CanAddLane(): boolean;
}

export class MainBus {
  lanes: Map<number, ItemBuffer>;
  nextLaneId = 1;
  kind = "MainBus";
  getEntity: (e: string) => Entity;

  constructor(firstLaneId = 1, lanes: Map<number, ItemBuffer> = new Map()) {
    this.lanes = lanes;
    this.nextLaneId = firstLaneId;
    this.getEntity = GetEntity;
  }

  AddLane(Entity: string, initialCount = 0): number {
    const laneId = this.nextLaneId++;
    this.lanes.set(
      laneId,
      NewBusLane(this.getEntity, laneId, Entity, initialCount)
    );
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
