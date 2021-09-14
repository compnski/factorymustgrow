import { GameAction, GameDispatch } from "../factoryGame";
import "./BuildingCard.scss";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import {
  entityIconLookupByKind,
  BuildingHasInput,
  BuildingHasOutput,
} from "../utils";
import {
  showChangeBeltLineItemSelector,
  showChangeProducerRecipeSelector,
} from "./selectors";
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
  const selectItem = useIconSelector();

  return (
    <div className="main-area">
      <div className="top-area">
        <div className="title">
          {`Belt line ` +
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
        <div
          onClick={async () => {
            await showChangeBeltLineItemSelector(buildingIdx, selectItem);
          }}
          className="change-recipe clickable"
        >
          Change Recipe
        </div>
        <BuildingBufferDisplay
          inputBuffers={building.inputBuffers}
          outputBuffers={building.outputBuffers}
          doubleClickHandler={getEntityIconDoubleClickHandler(buildingIdx)}
          entityIconLookup={entityIconLookupByKind(building.kind)}
        />
      </div>
    </div>
  );
}
