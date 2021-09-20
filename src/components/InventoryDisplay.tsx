import "./InventoryDisplay.scss";
import { Inventory } from "../inventory";
import { EntityStack, ItemBuffer } from "../types";
import { GameDispatch } from "../factoryGame";
import { SyntheticEvent } from "react";
import { IsBuilding } from "../production";

export type InventoryDisplayProps = {
  inventory: ItemBuffer;
};

function InventorySlot({
  entity,
  count,
  isOverCapacity,
  doubleClickHandler = () => {},
}: {
  entity: string;
  count: number;
  isOverCapacity: boolean;
  doubleClickHandler: (s: string, evt: { shiftKey: boolean }) => void;
}) {
  return (
    <div
      className={`inventory-slot ${
        isOverCapacity && "inventory-slot-over-capacity"
      }`}
      onDoubleClick={(evt) => doubleClickHandler(entity, evt)}
    >
      <div className={`icon ${entity}`} />
      <div className="item-stack-count-text">
        <span>{count}</span>
      </div>
    </div>
  );
}

export function InventoryDisplay({ inventory }: InventoryDisplayProps) {
  const slots: JSX.Element[] = [];
  const numSlots = Math.max(inventory.Capacity, inventory.Slots().length);

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
    const slotData = inventory.Slots()[i];
    if (!slotData) continue;
    const [entity, count] = slotData;
    slots.push(
      <InventorySlot
        doubleClickHandler={doubleClickHandler}
        key={i}
        isOverCapacity={i >= inventory.Capacity}
        entity={entity}
        count={count}
      />
    );
  }

  return <div className="inventory-display">{slots}</div>;
}
