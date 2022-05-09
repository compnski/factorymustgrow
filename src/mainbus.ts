import { ImmutableMap } from "./immutable";
import { ReadonlyInventory } from "./inventory";
import { ReadonlyItemBuffer } from "./factoryGameState";

export const NewBusLane = (
  Entity: string,
  initialCount = 0
): ReadonlyItemBuffer => {
  const inv = new ReadonlyInventory(1, ImmutableMap([[Entity, initialCount]]));
  return inv;
};

export class ReadonlyMainBus {
  readonly lanes: ImmutableMap<number, ReadonlyItemBuffer>;
  readonly nextLaneId: number;
  kind = "MainBus";

  constructor(
    nextLaneId = 1,
    lanes = ImmutableMap<number, ReadonlyItemBuffer>()
  ) {
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

  AddLane(Entity: string, initialCount = 0): ReadonlyMainBus {
    return new ReadonlyMainBus(
      this.nextLaneId + 1,
      this.lanes.set(this.nextLaneId, NewBusLane(Entity, initialCount))
    );
  }

  RemoveLane(id: number): ReadonlyMainBus {
    return new ReadonlyMainBus(this.nextLaneId, this.lanes.delete(id));
  }

  AddItemToLane(laneId: number, entity: string, count: number) {
    const lane = this.Lane(laneId);
    return new ReadonlyMainBus(
      this.nextLaneId,
      this.lanes.set(laneId, lane.AddItems(entity, count))
    );
  }
}
