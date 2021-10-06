import { GameAction } from "../GameAction";
import { GameDispatch } from "../GameDispatch";
import "./BuildingCard.scss";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import {
  entityIconLookupByKind,
  BuildingHasInput,
  BuildingHasOutput,
} from "../utils";
import { showChangeProducerRecipeSelector } from "./selectors";
import { BeltLine, BeltLineDepot } from "../transport";
import { getEntityIconDoubleClickHandler } from "./events";
import { useIconSelector } from "../IconSelectorProvider";

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
        <div className="producer-count-area">
          <span className={`icon ${building.subkind}`} />
          <div
            className="plus-minus"
            onClick={() =>
              GameDispatch({
                type: "DecreaseBuildingCount",
                buildingIdx,
              })
            }
          >
            -
          </div>
          <div className="producer-count">{building.BuildingCount}</div>
          <div
            className="plus-minus"
            onClick={() =>
              GameDispatch({
                type: "IncreaseBuildingCount",
                buildingIdx,
              })
            }
          >
            +
          </div>
        </div>
      </div>
      <div className="bottom-area">
        <BuildingBufferDisplay
          inputBuffers={inputBuffersForDisplay}
          outputBuffers={outputBuffersForDisplay}
          doubleClickHandler={getEntityIconDoubleClickHandler(buildingIdx)}
          entityIconLookup={entityIconLookupByKind(building.kind)}
        />
      </div>
    </div>
  );
}
