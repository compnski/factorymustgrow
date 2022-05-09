import { SyntheticEvent } from "react";
import { ReactComponent as RegionMapSVG } from "../gen/regionmap.svg";
import { useProperties } from "../svg";
import { ReadonlyItemBuffer } from "../factoryGameState";
import "./RegionSelector.scss";

export type RegionSelectorProps = {
  regionIds: string[];
  inventory: ReadonlyItemBuffer;
  onConfirm: (evt: SyntheticEvent, regionId: string) => void;
};

export function RegionSelector({ regionIds, onConfirm }: RegionSelectorProps) {
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
