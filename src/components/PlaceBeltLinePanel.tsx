import { SyntheticEvent, useState } from "react";
import { Inventory } from "../inventory";
import { Region } from "../types";
import "./PlaceBeltLinePanel.scss";

export type PlaceBeltLineProps = {
  inventory: Inventory;
  regions: Map<string, Region>;
  title: string;
  onConfirm: (
    evt: SyntheticEvent,
    targetRegion: string,
    beltType: string
  ) => void;
};

export function PlaceBeltLinePanel(props: PlaceBeltLineProps) {
  const { inventory, onConfirm, title, regions } = props;
  const [selectValue, setSelectValue] = useState<string>(
    regions.keys().next().value
  );

  const cost = 100,
    entity = "transport-belt";

  console.log(inventory.Count(entity), cost);
  const enoughBeltsInInventory = inventory.Count(entity) >= cost;
  console.log(inventory.Count(entity), cost, enoughBeltsInInventory);
  return (
    <div className="place-belt-line modal">
      <span
        className="material-icons close-icon clickable"
        onClick={(evt) => onConfirm(evt, "", "")}
      >
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
          {[...regions.entries()].map(([regionName, region]) => {
            const costTxt = `${cost} Yellow Belts`;
            return (
              <option key={regionName} value={regionName}>
                {regionName} - {costTxt}
              </option>
            );
          })}
        </select>
      </p>
      <div className="place-belt-line-button-row">
        <div
          onClick={(evt) =>
            enoughBeltsInInventory &&
            onConfirm(evt, selectValue, "transport-belt")
          }
          className={`clickable place-belt-line-build-button ${
            !enoughBeltsInInventory ? "disabled" : ""
          }`}
        >
          Build!
        </div>
      </div>
    </div>
  );
}
