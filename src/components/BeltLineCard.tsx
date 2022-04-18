import { BeltLineDepot } from "../transport";
import { entityIconLookupByKind } from "../utils";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import "./BuildingCard.scss";

export type BeltLineCardProps = {
  building: BeltLineDepot;
  buildingIdx: number;
  regionId: string;
};

function direction(d: "FROM_REGION" | "TO_REGION"): string {
  switch (d) {
    case "FROM_REGION":
      return "from";
    case "TO_REGION":
      return "to";
  }
}

export function BeltLineCard(props: BeltLineCardProps) {
  const { building, buildingIdx, regionId } = props;

  const inputBuffersForDisplay = building.inputBuffers,
    outputBuffersForDisplay = building.outputBuffers;

  return (
    <div className="main-area">
      <div className="top-area">
        <div className="title">
          {`Belt line ` +
            building.name +
            ` ` +
            direction(building.direction) +
            ` ` +
            building.otherRegionId}
        </div>
        <span className={`icon ${building.subkind}`} />
      </div>
      <div className="bottom-area">
        <BuildingBufferDisplay
          inputBuffers={inputBuffersForDisplay}
          outputBuffers={outputBuffersForDisplay}
          buildingIdx={buildingIdx}
          entityIconLookup={entityIconLookupByKind(building.kind)}
          regionId={regionId}
        />
      </div>
    </div>
  );
}
