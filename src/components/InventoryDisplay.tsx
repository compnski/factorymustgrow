import { ReactNode } from "react"
import { MaybeGetEntity } from "../gen/entities"
import { ReadonlyItemBuffer } from "../factoryGameState"
import "./InventoryDisplay.scss"

export type InventoryDisplayProps = {
  inventory: ReadonlyItemBuffer
  entityIconLookup?: (entity: string) => string
  addClickHandler?: (entity: string) => void
  remClickHandler?: (entity: string) => void
  debugPrint?: boolean
  infiniteStackSize?: boolean
}

function InventorySlot({
  entity,
  count,
  isOverCapacity,
  addClickHandler,
  remClickHandler,
  entityIconLookup = (entity: string): string => entity,
}: {
  entity: string
  count: number
  isOverCapacity: boolean
  entityIconLookup?: (entity: string) => string
  addClickHandler?: (s: string) => void
  remClickHandler?: (s: string) => void
  debugPrint?: boolean
}) {
  //if (debugPrint) console.log(entity, entityIconLookup(entity));
  return (
    <div
      className={`inventory-slot ${(isOverCapacity && "inventory-slot-over-capacity") || ""}`}
      title={entity}
    >
      <div className={`icon ${entityIconLookup(entity)}`} />
      <div className="item-stack-count-text">
        <span>{formatCountForDisplay(count)}</span>
      </div>
      <div
        onClick={() => {
          addClickHandler && addClickHandler(entity)
        }}
        className="inventory-hover-tip top"
      >
        +Add
      </div>
      <div onClick={() => remClickHandler && remClickHandler(entity)} className="inventory-hover-tip bottom">
        -Rem
      </div>
    </div>
  )
}

function asSlots(items: Readonly<Readonly<[string, number]>[]>): [string, number][] {
  const slots: [string, number][] = []
  items.forEach(([entity, count]) => {
    //if (!entity) return;
    const stackSize = MaybeGetEntity(entity)?.StackSize || Infinity
    if (count === 0) {
      // empty slots?
      slots.push([entity, count])
      return
    }
    while (count > stackSize) {
      slots.push([entity, stackSize])
      count -= stackSize
    }
    if (count) slots.push([entity, count])
  })
  return slots
}

export function InventoryDisplay({
  inventory,
  addClickHandler,
  remClickHandler,
  entityIconLookup = (entity: string): string => entity,
  debugPrint,
  infiniteStackSize,
}: InventoryDisplayProps) {
  const slots: JSX.Element[] = []
  const allowHover = addClickHandler || remClickHandler

  const invSlots = infiniteStackSize ? inventory.Entities() : asSlots(inventory.Entities())
  const numSlots =
    inventory.Capacity === Infinity ? invSlots.length : Math.max(inventory.Capacity, invSlots.length)

  if (debugPrint) {
    console.log("C", numSlots, invSlots.length, inventory.Capacity, inventory)
    console.log("S", invSlots.toString().toString())
    console.log("E", inventory.Entities().toString())
  }

  for (let i = 0; i < numSlots; i++) {
    const slotData = invSlots[i]
    if (!slotData) {
      slots.push(<div key={i} className="inventory-slot" />)
    } else {
      const [entity, count] = slotData
      slots.push(
        <InventorySlot
          debugPrint={debugPrint}
          entityIconLookup={entityIconLookup}
          addClickHandler={addClickHandler}
          remClickHandler={remClickHandler}
          key={i}
          isOverCapacity={i >= inventory.Capacity}
          entity={entity}
          count={count}
        />
      )
    }
  }

  return <div className={`inventory-display ${(!allowHover && "no-hover") || ""}`}>{slots}</div>
}

function formatCountForDisplay(count: number): ReactNode {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    compactDisplay: "short",
  }).format(count)
}
