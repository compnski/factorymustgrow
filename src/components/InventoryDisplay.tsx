import "./InventoryDisplay.scss";
import { ItemBuffer } from "../types";

export type InventoryDisplayProps = {
  inventory: ItemBuffer;
  showProgressBar?: boolean;
  entityIconLookup?: (entity: string) => string;
  doubleClickHandler?: (
    evt: {
      shiftKey: boolean;
      clientX: number;
      clientY: number;
      nativeEvent: { offsetX: number; offsetY: number };
    },

    ib: ItemBuffer,
    s: string
  ) => void;
};

function InventorySlot({
  entity,
  count,
  isOverCapacity,
  doubleClickHandler = () => {},
  progress,
  entityIconLookup = (entity: string): string => entity,
}: {
  entity: string;
  count: number;
  isOverCapacity: boolean;
  entityIconLookup?: (entity: string) => string;
  doubleClickHandler: (
    evt: {
      shiftKey: boolean;
      clientX: number;
      clientY: number;
      nativeEvent: { offsetX: number; offsetY: number };
    },
    s: string
  ) => void;
  progress?: number;
}) {
  return (
    <div
      className={`inventory-slot ${
        isOverCapacity && "inventory-slot-over-capacity"
      }`}
      onDoubleClick={(evt) => doubleClickHandler(evt, entity)}
    >
      <progress
        max={1}
        value={progress ?? 0}
        className={`icon ${entityIconLookup(entity)}`}
      />
      <div className="item-stack-count-text">
        <span>{Math.floor(count)}</span>
      </div>
    </div>
  );
}

export function InventoryDisplay({
  inventory,
  doubleClickHandler = () => {},
  showProgressBar,
  entityIconLookup = (entity: string): string => entity,
}: InventoryDisplayProps) {
  const slots: JSX.Element[] = [];
  const numSlots =
    inventory.Capacity === Infinity
      ? inventory.Slots().length
      : Math.max(inventory.Capacity, inventory.Slots().length);

  for (var i = 0; i < numSlots; i++) {
    const slotData = inventory.Slots()[i];
    if (!slotData) {
      slots.push(<div key={i} className="inventory-slot" />);
    } else {
      const [entity, count] = slotData;
      const progress = showProgressBar ? count % 1 : 0;
      slots.push(
        <InventorySlot
          entityIconLookup={entityIconLookup}
          doubleClickHandler={(evt, entity) =>
            doubleClickHandler && doubleClickHandler(evt, inventory, entity)
          }
          key={i}
          isOverCapacity={i >= inventory.Capacity}
          entity={entity}
          count={count}
          progress={progress}
        />
      );
    }
  }

  return <div className="inventory-display">{slots}</div>;
}
