import "./InventoryDisplay.scss";
import { Inventory } from "../inventory";
import { EntityStack } from "../types";
import { GameDispatch } from "../factoryGame";

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
  doubleClickHandler: (s: string) => void;
}) {
  return (
    <div
      className={`inventory-slot ${
        isOverCapacity && "inventory-slot-over-capacity"
      }`}
      onDoubleClick={stack && (() => doubleClickHandler(stack.Entity))}
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

  const doubleClickHandler = (entity: string) => {
    GameDispatch({
      type: "TransferFromInventory",
      entity,
      otherStackKind: "Void",
    });
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
