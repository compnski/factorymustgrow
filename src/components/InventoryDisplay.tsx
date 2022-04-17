import { ReadonlyItemBuffer } from "../useGameState";
import "./InventoryDisplay.scss";

export type InventoryDisplayProps = {
  inventory: ReadonlyItemBuffer;
  showProgressBar?: boolean;
  entityIconLookup?: (entity: string) => string;
  addClickHandler?: (entity: string) => void;
  remClickHandler?: (entity: string) => void;
};

function InventorySlot({
  entity,
  count,
  isOverCapacity,
  addClickHandler,
  remClickHandler,
  progress,
  entityIconLookup = (entity: string): string => entity,
}: {
  entity: string;
  count: number;
  isOverCapacity: boolean;
  entityIconLookup?: (entity: string) => string;
  addClickHandler?: (s: string) => void;
  remClickHandler?: (s: string) => void;
  progress?: number;
}) {
  return (
    <div
      className={`inventory-slot ${
        (isOverCapacity && "inventory-slot-over-capacity") || ""
      }`}
      title={entity}
    >
      <progress
        max={1}
        value={progress ?? 0}
        className={`icon ${entityIconLookup(entity)}`}
      />
      <div className="item-stack-count-text">
        <span>{Math.floor(count)}</span>
      </div>
      <div
        onClick={() => {
          addClickHandler && addClickHandler(entity);
        }}
        className="inventory-hover-tip top"
      >
        +Add
      </div>
      <div
        onClick={() => remClickHandler && remClickHandler(entity)}
        className="inventory-hover-tip bottom"
      >
        -Rem
      </div>
    </div>
  );
}

export function InventoryDisplay({
  inventory,
  addClickHandler,
  remClickHandler,
  showProgressBar,
  entityIconLookup = (entity: string): string => entity,
}: InventoryDisplayProps) {
  const slots: JSX.Element[] = [];
  const allowHover = addClickHandler || remClickHandler;

  const numSlots =
    inventory.Capacity === Infinity
      ? inventory.Slots().length
      : Math.max(inventory.Capacity, inventory.Slots().length);

  for (let i = 0; i < numSlots; i++) {
    const slotData = inventory.Slots()[i];
    if (!slotData) {
      slots.push(<div key={i} className="inventory-slot" />);
    } else {
      const [entity, count] = slotData;
      const progress = showProgressBar ? count % 1 : 0;
      slots.push(
        <InventorySlot
          entityIconLookup={entityIconLookup}
          addClickHandler={addClickHandler}
          remClickHandler={remClickHandler}
          key={i}
          isOverCapacity={i >= inventory.Capacity}
          entity={entity}
          count={count}
          progress={progress}
        />
      );
    }
  }

  return (
    <div className={`inventory-display ${(!allowHover && "no-hover") || ""}`}>
      {slots}
    </div>
  );
}
