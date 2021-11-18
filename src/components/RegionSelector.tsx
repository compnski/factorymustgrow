import { Inventory } from "../inventory";
import { RegionInfo } from "../types";
import { InventoryDisplay } from "./InventoryDisplay";
import "./RegionSelector.scss";

import { ReactComponent as RegionMapSVG } from "../gen/regionmap.svg";
import { SyntheticEvent } from "react";
import { GameAction } from "../GameAction";
import { useProperties } from "../explore/svg";

export type RegionSelectorProps = {
  regionIds: string[];
  //  currentRegionId: string;
  //regionMap?: Map<string, RegionInfo>;
  inventory: Inventory;
  onConfirm: (evt: SyntheticEvent, regionId: string) => void;
  //gameDispatch(a: GameAction): void;
};

export function RegionSelector({
  inventory,
  regionIds,
  onConfirm,
}: RegionSelectorProps) {
  const handleMapClick = (evt: SyntheticEvent) => {
    const id = (evt.target as SVGElement).id;
    if (id.startsWith("region_")) {
      const regionId = id.replaceAll("region_", "");
      if (!regionIds.includes(regionId)) {
        onConfirm(evt, regionId);
        return;
      }
    }

    evt.stopPropagation();
  };

  const regionPaths = regionIds.map((r) => {
    return {
      handle: `#path_start_${r}`,
      attr: "stroke",
      value: "#fff",
    };
  });
  const svgRef = useProperties(regionPaths);

  return (
    <div className="region-selector modal">
      <div>
        <span
          className="material-icons close-icon clickable"
          onClick={(evt) => onConfirm(evt, "")}
        >
          close
        </span>
        <span className="title">Claim Region</span>
      </div>
      <RegionMapSVG ref={svgRef} x={0} y={0} onClick={handleMapClick} />
    </div>
  );
}
