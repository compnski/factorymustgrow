import { GetEntity } from "./gen/entities";
import { StackCapacity, stackTransfer } from "./movement";
import {
  Entity,
  EntityStack,
  IsItemBuffer,
  ItemBuffer,
  NewEntityStack,
} from "./types";

export function FixedInventory(
  slotTemplate: EntityStack[],
  getEntity?: (e: string) => Entity
): Inventory {
  const slots = slotTemplate.map((stack: EntityStack) =>
    Object.assign({}, stack)
  );
  return new Inventory(slots.length, slots, true, getEntity);
}

export class Inventory {
  Slots: EntityStack[];
  Capacity: number;
  // ImmutableSlots is used for fixed inventories. Slots won't be added on overflow or removed when empty.
  immutableSlots: boolean;
  getEntity: (e: string) => Entity;

  constructor(
    maxCapacity: number = 8,
    slots: EntityStack[] = [],
    immutableSlots: boolean = false,
    getEntity: (e: string) => Entity = GetEntity
  ) {
    this.Capacity = maxCapacity;
    this.Slots = slots;
    this.getEntity = getEntity;
    this.immutableSlots = immutableSlots;
  }

  AvailableSpace(entity: string): number {
    const stackSize = this.getEntity(entity).StackSize,
      availableSlots = this.Capacity - this.Slots.length,
      existingSlot = this.Slots[this.unfilledSlotForEntity(entity)];
    if (existingSlot)
      return availableSlots * stackSize + StackCapacity(existingSlot);
    return availableSlots * stackSize;
  }

  Accepts(entity: string): boolean {
    return this.AvailableSpace(entity) > 0;
  }

  CanFit(fromStack: EntityStack | ItemBuffer): boolean {
    const entity = IsItemBuffer(fromStack)
      ? (fromStack as ItemBuffer).Entities()[0][0]
      : (fromStack as EntityStack).Entity;
    const count = IsItemBuffer(fromStack)
      ? (fromStack as ItemBuffer).Count(entity)
      : (fromStack as EntityStack).Count;

    return this.AvailableSpace(entity) >= count;
  }

  unfilledSlotForEntity(entity: string) {
    return this.Slots.findIndex(
      (s: EntityStack) => s.Entity === entity && StackCapacity(s) > 0
    );
  }

  Count(entity: string): number {
    return this.Slots.reduce(
      (accum, stack) => accum + (stack.Entity === entity ? stack.Count : 0),
      0
    );
  }

  Entities(): [string, number][] {
    const entityToIdx: { [key: string]: number } = {};
    const entityCountList: [string, number][] = [];
    this.Slots.forEach((s: EntityStack) => {
      var idx = entityToIdx[s.Entity];
      if (idx !== undefined) {
        entityCountList[idx][1] += s.Count;
      } else {
        entityCountList.push([s.Entity, s.Count]);
      }
    });
    return entityCountList;
  }

  // Add X of this stack to the inventory. Defaults to 1 stack
  // Returns the count of any items which didn't fit.
  Add(
    fromStack: EntityStack,
    itemCount?: number,
    exceedCapacity: boolean = false,
    integersOnly: boolean = true
  ): number {
    const entity = this.getEntity(fromStack.Entity);
    if (!entity) console.error(`Failed to find entity  ${fromStack.Entity}`);
    const stackSize = entity.StackSize,
      existingSlotIdx = this.unfilledSlotForEntity(fromStack.Entity),
      existingSlot = this.Slots[existingSlotIdx];

    var transferAmount = Math.min(fromStack.Count, itemCount ?? stackSize);

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
      (exceedCapacity || this.Slots.length < this.Capacity)
    ) {
      var transferToNewSlotAmount = Math.min(transferAmount, stackSize);
      const toStack = NewEntityStack(fromStack.Entity, 0, stackSize);
      this.Slots.push(toStack);

      transferAmount -= stackTransfer(
        fromStack,
        toStack,
        transferToNewSlotAmount,
        integersOnly
      );
    }
    this.Slots.sort((a, b) => a.Entity.localeCompare(b.Entity));
    return transferAmount;
  }

  // Add X of this stack to the inventory. Defaults to 1 stacksize
  // Returns the count of any items which didn't fit.
  AddFromItemBuffer(
    from: ItemBuffer,
    entity: string,
    itemCount?: number,
    exceedCapacity: boolean = false,
    integersOnly: boolean = true
  ): number {
    const stackSize = this.getEntity(entity).StackSize;

    const existingSlotIdx = this.unfilledSlotForEntity(entity),
      existingSlot = this.Slots[existingSlotIdx],
      fromItemCount = from.Count(entity);

    var transferAmount = Math.min(fromItemCount, itemCount || stackSize);

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
      (exceedCapacity || this.Slots.length < this.Capacity)
    ) {
      var transferToNewSlotAmount = Math.min(transferAmount, stackSize);
      const toStack = NewEntityStack(entity, 0, stackSize);
      this.Slots.push(toStack);

      transferAmount -= from.Remove(
        toStack,
        transferToNewSlotAmount,
        integersOnly
      );
    }
    this.Slots.sort((a, b) => a.Entity.localeCompare(b.Entity));
    return transferAmount;
  }

  // Remove X of this stack from the inventory,
  // transfering it into toStack. Defaults to 1 stack
  // Returns the number of items moved
  Remove(
    toStack: EntityStack,
    count?: number,
    integersOnly: boolean = true
  ): number {
    const entity = this.getEntity(toStack.Entity);
    if (!entity) console.error(`Failed to find entity  ${toStack.Entity}`);
    const stackSize = entity.StackSize,
      totalAmountInInventory = this.Count(toStack.Entity);
    var transferAmount = Math.min(
      totalAmountInInventory,
      count ?? stackSize,
      StackCapacity(toStack)
    );
    const initialTransferAmount = transferAmount;
    //console.log(`Remove ${transferAmount} of ${toStack.Entity}`);
    for (var idx = this.Slots.length - 1; idx >= 0; idx--) {
      const slot = this.Slots[idx];
      if (transferAmount <= 0 || slot.Entity !== toStack.Entity) continue;
      transferAmount -= stackTransfer(
        slot,
        toStack,
        transferAmount,
        integersOnly
      );
      // Delete empty slots unless inventory is immutable.
      if (!this.immutableSlots && slot.Count === 0) {
        this.Slots.splice(idx, 1);
      }
    }
    return initialTransferAmount - transferAmount;
  }
}
