import { GetEntity } from "./gen/entities";
import { StackCapacity, stackTransfer } from "./movement";
import { Entity, EntityStack, ItemBuffer, NewEntityStack } from "./types";

export function FixedInventory(
  slotTemplate: EntityStack[],
  getEntity?: (e: string) => Entity
): Inventory {
  const slots = slotTemplate.map((stack: EntityStack) =>
    Object.assign({}, stack)
  );
  return new Inventory(slots.length, slots, true, getEntity);
}

export class Inventory implements ItemBuffer {
  slots: EntityStack[];
  Capacity: number;
  // ImmutableSlots is used for fixed inventories. Slots won't be added on overflow or removed when empty.
  immutableSlots: boolean;
  getEntity: (e: string) => Entity;

  constructor(
    maxCapacity = 8,
    slots: EntityStack[] = [],
    immutableSlots = false,
    getEntity: (e: string) => Entity = GetEntity
  ) {
    this.Capacity = maxCapacity;
    this.slots = slots;
    this.getEntity = getEntity;
    this.immutableSlots = immutableSlots;
  }

  NextEntityStack(): EntityStack | undefined {
    for (const slot of this.slots) {
      if (slot && slot.Count > 0) {
        return slot;
      }
    }
  }

  AvailableSpace(entity: string): number {
    const stackSize = this.getEntity(entity).StackSize,
      availableSlots = this.Capacity - this.slots.length,
      existingSlot = this.slots[this.unfilledSlotForEntity(entity)];
    if (existingSlot)
      return availableSlots * stackSize + StackCapacity(existingSlot);
    return availableSlots * stackSize;
  }

  Accepts(entity: string): boolean {
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
    const entity = this.getEntity(fromStack.Entity);
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
    const stackSize = this.getEntity(entity).StackSize;

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
    const entity = this.getEntity(toStack.Entity);
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
