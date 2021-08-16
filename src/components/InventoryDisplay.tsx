import "./InventoryDisplay.scss";
import { Inventory } from "../inventory";
import { EntityStack } from "../types";
import { GameDispatch } from "../factoryGame";
import { SyntheticEvent } from "react";
import { IsBuilding } from "../production";

export type InventoryDisplayProps = {
  inventory: Inventory;
};

function InventorySlot({
  stack,
  isOverCapacity,
  doubleClickHandler = () => {},
}: {
  stack: EntityStack | undefined;
  isOverCapacity: boolean;
  doubleClickHandler: (s: string, evt: { shiftKey: boolean }) => void;
}) {
  return (
    <div
      className={`inventory-slot ${
        isOverCapacity && "inventory-slot-over-capacity"
      }`}
      onDoubleClick={stack && ((evt) => doubleClickHandler(stack.Entity, evt))}
    >
      <div className={`icon ${stack?.Entity}`} />
      <div className="item-stack-count-text">
        <span>{stack?.Count}</span>
      </div>
    </div>
  );
}

export function InventoryDisplay({ inventory }: InventoryDisplayProps) {
  const slots: JSX.Element[] = [];
  const numSlots = Math.max(inventory.Capacity, inventory.Slots.length);

  const doubleClickHandler = (entity: string, evt: { shiftKey: boolean }) => {
    if (evt.shiftKey) {
      GameDispatch({
        type: "TransferFromInventory",
        entity,
        otherStackKind: "Void",
      });
    } else {
      // Place Item
      if (IsBuilding(entity))
        GameDispatch({
          type: "PlaceBuilding",
          entity,
        });
    }
  };

  for (var i = 0; i < numSlots; i++) {
    const stack = inventory.Slots[i];
    slots.push(
      <InventorySlot
        doubleClickHandler={doubleClickHandler}
        key={i}
        isOverCapacity={i >= inventory.Capacity}
        stack={stack}
      />
    );
  }

  return <div className="inventory-display">{slots}</div>;
}
