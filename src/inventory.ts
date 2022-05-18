import { GetEntity } from "./gen/entities";
import { ImmutableMap } from "./immutable";
import { EntityStack } from "./types";
import { ReadonlyItemBuffer } from "./factoryGameState";

export function ReadonlyFixedInventory(
  slotTemplate: EntityStack[]
): ReadonlyInventory {
  const slots = ImmutableMap(
    slotTemplate.map((stack: EntityStack) => [stack.Entity, stack.Count])
  );
  // TODO: Fixed inventory with multiple stacks of one item
  return new ReadonlyInventory(slotTemplate.length, slots, true);
}

// TODO: Handle fixed inventory
export class ReadonlyInventory implements ReadonlyItemBuffer {
  //readonly slots: Readonly<EntityStack>[];
  // ImmutableSlots is used for fixed inventories. Slots won't be added on overflow or removed when empty.
  readonly immutableSlots: boolean;
  readonly Capacity: number;
  readonly Data: ImmutableMap<string, number>;

  constructor(
    maxCapacity: number,
    Data?: ImmutableMap<string, number>,
    immutableSlots = false
  ) {
    this.Capacity = maxCapacity;
    this.Data = Data || ImmutableMap();
    this.immutableSlots = immutableSlots;
  }

  // throws if it cannot hold the given number
  AddItems(
    entity: string,
    count: number,
    canExceedCapacity = false
  ): ReadonlyInventory {
    if (count < 0) {
      return this.RemoveItems(entity, -count);
    }
    const newCount = (this.Count(entity) || 0) + count;
    if (count > this.AvailableSpace(entity) && !canExceedCapacity) {
      // console.log(
      //   "INAD",
      //   entity,
      //   newCount,
      //   this.AvailableSpace(entity),
      //   GetEntity(entity).StackSize
      //      );
      throw new Error("Not enough space for " + entity);
    }
    const newData = this.Data.set(entity, newCount);

    return new ReadonlyInventory(this.Capacity, newData, this.immutableSlots);
  }

  private RemoveItems(entity: string, count: number): ReadonlyInventory {
    if (count < 0) {
      throw new Error("Cannot remove negative quantity.");
    }
    const newCount = (this.Count(entity) || 0) - count;
    if (newCount < 0) {
      throw new Error("Not enough " + entity + " in stack");
    }

    const newData =
      this.immutableSlots || newCount > 0
        ? this.Data.set(entity, newCount)
        : this.Data.delete(entity);

    return new ReadonlyInventory(this.Capacity, newData, this.immutableSlots);
  }

  HasSlotFor(entity: string): boolean {
    return this.Data.has(entity);
  }

  Count(entity: string): number {
    return this.Data.get(entity, 0);
  }

  private SlotsUsed(): number {
    let slotsUsed = 0;
    this.Data.forEach((count, entity) => {
      const stackSize = GetEntity(entity).StackSize;
      if (count == 0 && this.immutableSlots) slotsUsed += 1;
      else slotsUsed += Math.ceil(count / stackSize);
    });
    return slotsUsed;
  }

  AvailableSpace(entity: string): number {
    const stackSize = GetEntity(entity).StackSize,
      availableSlots = this.Capacity - this.SlotsUsed(),
      count = this.Count(entity);

    if (this.HasSlotFor(entity))
      return (
        availableSlots * stackSize +
        (count < stackSize ? stackSize - (count % stackSize) : 0)
      );
    return availableSlots * stackSize;
  }

  Accepts(entity: string): boolean {
    if (entity === "rocket-part") return false;
    return this.AvailableSpace(entity) > 0;
  }

  Entities(): [string, number][] {
    return [...this.Data.entries()];
  }
}
