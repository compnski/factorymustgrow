import { GameDispatch } from "../GameDispatch";
import "./BuildingCard.scss";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import { entityIconLookupByKind } from "../utils";
import { BeltLineDepot } from "../transport";
import { getEntityIconDoubleClickHandler } from "./events";
import { CounterWithPlusMinusButtons } from "./CounterWithPlusMinusButtons";

export type BeltLineCardProps = {
  building: BeltLineDepot;
  buildingIdx: number;
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
  const { building, buildingIdx } = props;

  const inputBuffersForDisplay = building.inputBuffers,
    outputBuffersForDisplay = building.outputBuffers;

  return (
    <div className="main-area">
      <div className="top-area">
        <div className="title">
          {`Belt line ` +
            building.beltLineId +
            ` ` +
            direction(building.direction) +
            ` ` +
            building.otherRegionId}
        </div>
        <span className={`icon ${building.subkind}`} />
        <CounterWithPlusMinusButtons
          count={building.BuildingCount}
          minusClickHandler={() =>
            GameDispatch({
              type: "DecreaseBuildingCount",
              buildingIdx,
            })
          }
          plusClickHandler={() =>
            GameDispatch({
              type: "IncreaseBuildingCount",
              buildingIdx,
            })
          }
        />
      </div>
      <div className="bottom-area">
        <BuildingBufferDisplay
          inputBuffers={inputBuffersForDisplay}
          outputBuffers={outputBuffersForDisplay}
          buildingIdx={buildingIdx}
          entityIconLookup={entityIconLookupByKind(building.kind)}
        />
      </div>
    </div>
  );
}
