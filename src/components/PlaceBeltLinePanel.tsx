import { SyntheticEvent, useState } from "react";
import { ImmutableMap } from "../immutable";
import { ReadonlyItemBuffer, ReadonlyRegion } from "../factoryGameState";
import "./PlaceBeltLinePanel.scss";

export type PlaceBeltLineProps = {
  inventory: ReadonlyItemBuffer;
  regions: ImmutableMap<string, ReadonlyRegion>;
  title: string;
  onConfirm: (
    evt: SyntheticEvent,
    targetRegion: string,
    beltType: string,
    count: number
  ) => void;
};

export function PlaceBeltLinePanel(props: PlaceBeltLineProps) {
  const { inventory, onConfirm, title, regions } = props;
  const [selectValue, setSelectValue] = useState<string>(
    regions.keys().next().value
  );

  const cost = 50,
    entity = "transport-belt";

  const enoughBeltsInInventory = inventory.Count(entity) >= cost;
  return (
    <div className="place-belt-line modal">
      <span
        className="material-icons close-icon clickable"
        onClick={(evt) => onConfirm(evt, "", "", 0)}
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
          {[...regions.entries()].map(([regionName]) => {
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
            onConfirm(evt, selectValue, "transport-belt", cost)
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
