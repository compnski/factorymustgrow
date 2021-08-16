import { GetEntity } from "./gen/entities";
import { StackCapacity, stackTransfer } from "./movement";
import { Entity, EntityStack, NewEntityStack } from "./types";

export class Inventory {
  Slots: EntityStack[];
  Capacity: number;
  getEntity: (e: string) => Entity;

  constructor(maxCapacity: number = 8, slots: EntityStack[] = []) {
    this.Capacity = maxCapacity;
    this.Slots = slots;
    this.getEntity = GetEntity;
  }

  CanFit(fromStack: EntityStack): boolean {
    if (this.Slots.length < this.Capacity) return true;
    const existingSlot =
      this.Slots[this.unfilledSlotForEntity(fromStack.Entity)];
    if (existingSlot) return StackCapacity(existingSlot) > 0;
    return false;
  }

  unfilledSlotForEntity(entity: string) {
    return this.Slots.findIndex(
      (s: EntityStack) => s.Entity === entity && StackCapacity(s) > 0
    );
  }

  EntityCount(entity: string): number {
    return this.Slots.reduce(
      (accum, stack) => accum + (stack.Entity === entity ? stack.Count : 0),
      0
    );
  }

  // Add X of this stack to the inventory. Defaults to 1 stack
  Add(fromStack: EntityStack, count?: number, exceedCapacity: boolean = false) {
    const entity = this.getEntity(fromStack.Entity);
    if (!entity) console.error(`Failed to find entity  ${fromStack.Entity}`);
    const stackSize = entity.StackSize,
      existingSlotIdx = this.unfilledSlotForEntity(fromStack.Entity),
      existingSlot = this.Slots[existingSlotIdx];

    var transferAmount = Math.min(fromStack.Count, count ?? stackSize);

    if (existingSlot) {
      const transferToExistingSlotAmount = Math.min(
        transferAmount,
        StackCapacity(existingSlot)
      );
      transferAmount -= stackTransfer(
        fromStack,
        existingSlot,
        transferToExistingSlotAmount
      );
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
        transferToNewSlotAmount
      );
    }
    this.Slots.sort((a, b) => a.Entity.localeCompare(b.Entity));
  }

  // Remove X of this stack to the inventory. Defaults to 1 stack
  Remove(toStack: EntityStack, count?: number) {
    const entity = this.getEntity(toStack.Entity);
    if (!entity) console.error(`Failed to find entity  ${toStack.Entity}`);
    const stackSize = entity.StackSize,
      totalAmountInInventory = this.EntityCount(toStack.Entity);
    var transferAmount = Math.min(
      totalAmountInInventory,
      count ?? stackSize,
      StackCapacity(toStack)
    );
    //console.log(`Remove ${transferAmount} of ${toStack.Entity}`);
    for (var idx = this.Slots.length - 1; idx >= 0; idx--) {
      const slot = this.Slots[idx];
      if (transferAmount <= 0 || slot.Entity !== toStack.Entity) continue;
      transferAmount -= stackTransfer(slot, toStack, transferAmount);
      if (slot.Count === 0) {
        this.Slots.splice(idx, 1);
      }
    }
  }
}
