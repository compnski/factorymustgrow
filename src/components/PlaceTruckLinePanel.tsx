import { SyntheticEvent, useState } from "react"
import { ImmutableMap } from "../immutable"
import { ReadonlyItemBuffer, ReadonlyRegion } from "../factoryGameState"
import "./PlaceTruckLinePanel.scss"

export type PlaceTruckLineProps = {
  inventory: ReadonlyItemBuffer
  regions: ImmutableMap<string, ReadonlyRegion>
  title: string
  onConfirm: (evt: SyntheticEvent, targetRegion: string, subkind: string, count: number) => void
}

export function PlaceTruckLinePanel(props: PlaceTruckLineProps) {
  const { inventory, onConfirm, title, regions } = props
  const [selectValue, setSelectValue] = useState<string>(regions.keys().next().value)

  const cost = 50,
    entity = "concrete"

  const enoughConcreteInInventory = inventory.Count(entity) >= cost
  return (
    <div className="place-belt-line modal">
      <span className="material-icons close-icon clickable" onClick={(evt) => onConfirm(evt, "", "", 0)}>
        close
      </span>
      <span className="title">{title}</span>
      <p>
        Select a region
        <select
          className="place-belt-line-region-selector"
          value={selectValue}
          onChange={(evt) => setSelectValue(evt.target.value)}
        >
          {[...regions.entries()].map(([regionName]) => {
            const costTxt = `${cost} Concrete`
            return (
              <option key={regionName} value={regionName}>
                {regionName} - {costTxt}
              </option>
            )
          })}
        </select>
      </p>
      <div className="place-belt-line-button-row">
        <div
          onClick={(evt) => enoughConcreteInInventory && onConfirm(evt, selectValue, "concrete", cost)}
          className={`clickable place-belt-line-build-button ${!enoughConcreteInInventory ? "disabled" : ""}`}
        >
          Build!
        </div>
      </div>
    </div>
  )
}
