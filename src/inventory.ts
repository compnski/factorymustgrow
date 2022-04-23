import { GetEntity } from "./gen/entities";
import { ImmutableMap } from "./immutable";
import { StackCapacity, stackTransfer } from "./movement";
import { EntityStack, ItemBuffer, NewEntityStack } from "./types";
import { ReadonlyItemBuffer } from "./useGameState";

export function FixedInventory(slotTemplate: EntityStack[]): Inventory {
  const slots = slotTemplate.map((stack: EntityStack) =>
    Object.assign({}, stack)
  );
  return new Inventory(slots.length, slots, true);
}

// function FillStack(
//   entity: string,
//   count: number,
//   stackSize: number
// ): EntityStack[] {
//   //
// }

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
  Add(entity: string, count: number): ReadonlyItemBuffer {
    if (count < 0) {
      return this.Remove(entity, -count);
    }
    if (count > this.AvailableSpace(entity)) {
      throw new Error("Not enough space for " + entity);
    }

    return new ReadonlyInventory(this.Capacity, this.Data, this.immutableSlots);
  }

  Remove(entity: string, count: number): ReadonlyItemBuffer {
    if (this.Count(entity) + count < 0) {
      throw new Error("Not enough " + entity + " in stack");
    }

    return new ReadonlyInventory(this.Capacity, this.Data, this.immutableSlots);
  }

  Count(entity: string): number {
    return this.Data.get(entity, 0);
  }

  SlotsUsed(): number {
    let slotsUsed = 0;
    this.Data.forEach((count, entity) => {
      const stackSize = GetEntity(entity).StackSize;
      slotsUsed += Math.ceil(count / stackSize);
    });
    return slotsUsed;
  }

  AvailableSpace(entity: string): number {
    const stackSize = GetEntity(entity).StackSize,
      availableSlots = this.Capacity - this.SlotsUsed(),
      count = this.Count(entity);
    if (count) return availableSlots * stackSize + (count % stackSize);
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

export class Inventory implements ItemBuffer {
  slots: EntityStack[];
  Capacity: number;
  // ImmutableSlots is used for fixed inventories. Slots won't be added on overflow or removed when empty.
  immutableSlots: boolean;

  SlotsUsed(): number {
    return this.slots.length;
  }

  constructor(
    maxCapacity = 8,
    slots: EntityStack[] = [],
    immutableSlots = false
  ) {
    this.Capacity = maxCapacity;
    this.slots = slots;
    this.immutableSlots = immutableSlots;
  }

  // Set(entity: string, count: number): number {
  //   const stackSize = GetEntity(entity)?.StackSize;
  //   if (!stackSize) throw new Error(`Failed to find entity  ${entity}`);

  //   const existingSlotIdx = this.unfilledSlotForEntity(entity),
  //     existingSlot = this.slots[existingSlotIdx];

  //   let transferAmount = count;

  //   if (existingSlot) {
  //     const transferToExistingSlotAmount = Math.min(
  //       transferAmount,
  //       StackCapacity(existingSlot)
  //     );
  //     existingSlot.Count =
  //     TransferAmount -= stackTransfer(
  //       fromStack,
  //       existingSlot,
  //       transferToExistingSlotAmount,
  //       integersOnly
  //     );
  //   } else {
  //     if (this.immutableSlots) {
  //       return transferAmount;
  //     }
  //   }
  //   while (
  //     Math.floor(transferAmount) > 0 &&
  //     (exceedCapacity || this.slots.length < this.Capacity)
  //   ) {
  //     const transferToNewSlotAmount = Math.min(transferAmount, stackSize);
  //     const toStack = NewEntityStack(fromStack.Entity, 0, stackSize);
  //     this.slots.push(toStack);

  //     transferAmount -= stackTransfer(
  //       fromStack,
  //       toStack,
  //       transferToNewSlotAmount,
  //       integersOnly
  //     );
  //   }
  //   this.slots.sort((a, b) => a.Entity.localeCompare(b.Entity));
  //   return transferAmount;
  // }

  NextEntityStack(): EntityStack | undefined {
    for (const slot of this.slots) {
      if (slot && slot.Count > 0) {
        return slot;
      }
    }
  }

  AvailableSpace(entity: string): number {
    const stackSize = GetEntity(entity).StackSize,
      availableSlots = this.Capacity - this.slots.length,
      existingSlot = this.slots[this.unfilledSlotForEntity(entity)];
    if (existingSlot)
      return availableSlots * stackSize + StackCapacity(existingSlot);
    return availableSlots * stackSize;
  }

  Accepts(entity: string): boolean {
    if (entity === "rocket-part") return false;
    return this.AvailableSpace(entity) > 0;
  }

  unfilledSlotForEntity(entity: string) {
    return this.slots.findIndex(
      (s: EntityStack) => s.Entity === entity && StackCapacity(s) > 0
    );
  }

  Count(entity: string): number {
    return this.slots.reduce(
      (accum, stack) => accum + (stack.Entity === entity ? stack.Count : 0),
      0
    );
  }

  Entities(): [string, number][] {
    const entityToIdx: { [key: string]: number } = {};
    const entityCountList: [string, number][] = [];
    this.slots.forEach((s: EntityStack) => {
      const idx = entityToIdx[s.Entity];
      if (idx !== undefined) {
        entityCountList[idx][1] += s.Count;
      } else {
        entityCountList.push([s.Entity, s.Count]);
      }
    });
    return entityCountList;
  }

  Slots(): [string, number][] {
    return this.slots.map((s) => [s.Entity, s.Count]);
  }

  // Add X of this stack to the inventory. Defaults to 1 stack
  // Returns the count of any items which didn't fit.
  Add(
    fromStack: EntityStack,
    itemCount?: number,
    exceedCapacity = false,
    integersOnly = true
  ): number {
    const entity = GetEntity(fromStack.Entity);
    if (!entity) console.error(`Failed to find entity  ${fromStack.Entity}`);
    const stackSize = entity.StackSize,
      existingSlotIdx = this.unfilledSlotForEntity(fromStack.Entity),
      existingSlot = this.slots[existingSlotIdx];

    let transferAmount = Math.min(fromStack.Count, itemCount ?? stackSize);

    if (existingSlot) {
      const transferToExistingSlotAmount = Math.min(
        transferAmount,
        StackCapacity(existingSlot)
      );
      transferAmount -= stackTransfer(
        fromStack,
        existingSlot,
        transferToExistingSlotAmount,
        integersOnly
      );
    } else {
      if (this.immutableSlots) {
        return transferAmount;
      }
    }
    while (
      Math.floor(transferAmount) > 0 &&
      (exceedCapacity || this.slots.length < this.Capacity)
    ) {
      const transferToNewSlotAmount = Math.min(transferAmount, stackSize);
      const toStack = NewEntityStack(fromStack.Entity, 0, stackSize);
      this.slots.push(toStack);

      transferAmount -= stackTransfer(
        fromStack,
        toStack,
        transferToNewSlotAmount,
        integersOnly
      );
    }
    this.slots.sort((a, b) => a.Entity.localeCompare(b.Entity));
    return transferAmount;
  }

  // Add X of this stack to the inventory. Defaults to 1 stacksize
  // Returns the count of any items which didn't fit.
  AddFromItemBuffer(
    from: ItemBuffer,
    entity: string,
    itemCount?: number,
    exceedCapacity = false,
    integersOnly = true
  ): number {
    const stackSize = GetEntity(entity).StackSize;

    const existingSlotIdx = this.unfilledSlotForEntity(entity),
      existingSlot = this.slots[existingSlotIdx],
      fromItemCount = from.Count(entity);

    let transferAmount = Math.min(fromItemCount, itemCount || stackSize);

    if (existingSlot) {
      const transferToExistingSlotAmount = Math.min(
        transferAmount,
        StackCapacity(existingSlot)
      );
      transferAmount -= from.Remove(
        existingSlot,
        transferToExistingSlotAmount,
        integersOnly
      );
    } else {
      if (this.immutableSlots) {
        return transferAmount;
      }
    }

    while (
      Math.floor(transferAmount) > 0 &&
      (exceedCapacity || this.slots.length < this.Capacity)
    ) {
      const transferToNewSlotAmount = Math.min(transferAmount, stackSize);
      const toStack = NewEntityStack(entity, 0, stackSize);
      this.slots.push(toStack);

      transferAmount -= from.Remove(
        toStack,
        transferToNewSlotAmount,
        integersOnly
      );
    }
    this.slots.sort((a, b) => a.Entity.localeCompare(b.Entity));
    return transferAmount;
  }

  // Remove X of this stack from the inventory,
  // transfering it into toStack. Defaults to 1 stack
  // Returns the number of items moved
  Remove(toStack: EntityStack, count?: number, integersOnly = true): number {
    const entity = GetEntity(toStack.Entity);
    if (!entity) console.error(`Failed to find entity  ${toStack.Entity}`);
    const stackSize = entity.StackSize,
      totalAmountInInventory = this.Count(toStack.Entity);
    let transferAmount = Math.min(
      totalAmountInInventory,
      count ?? stackSize,
      StackCapacity(toStack)
    );
    const initialTransferAmount = transferAmount;
    //console.log(`Remove ${transferAmount} of ${toStack.Entity}`);
    for (let idx = this.slots.length - 1; idx >= 0; idx--) {
      const slot = this.slots[idx];
      if (transferAmount <= 0 || slot.Entity !== toStack.Entity) continue;
      transferAmount -= stackTransfer(
        slot,
        toStack,
        transferAmount,
        integersOnly
      );
      // Delete empty slots unless inventory is immutable.
      if (!this.immutableSlots && Math.floor(slot.Count) === 0) {
        this.slots.splice(idx, 1);
      }
    }
    return initialTransferAmount - transferAmount;
  }
}
