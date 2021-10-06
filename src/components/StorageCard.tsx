import { GameDispatch } from "../GameDispatch";
import { EntityStack, ItemBuffer, NewEntityStack, Producer } from "../types";
import "./BuildingCard.scss";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import { entityIconLookupByKind } from "../utils";
import {
  showChangeProducerRecipeSelector,
  showMoveItemToFromInventorySelector,
} from "./selectors";
import { useIconSelector } from "../IconSelectorProvider";
import { getEntityIconDoubleClickHandler } from "./events";
import { Inventory } from "../inventory";
import { Building } from "../building";
import { Chest } from "../storage";

export type StorageCardProps = {
  storage: Chest;
  /* dispatch: (a: GameAction) => void;
   * uiDispatch: (a: UIAction) => void; */
  buildingIdx: number;
  //  mainBus: MainBus;
};

export function StorageCard({ storage, buildingIdx }: StorageCardProps) {
  const iconSelector = useIconSelector();

  var recipeInput = storage.inputBuffers;

  return (
    <div className="main-area">
      <div className="top-area">
        <div className="title">{storage.subkind /* TODO Fix name */}</div>
        <div className="producer-count-area">
          <span className={`icon ${storage.subkind}`} />
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
          <div className="producer-count">{storage.BuildingCount}</div>
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
            const recipe = await showMoveItemToFromInventorySelector(
              iconSelector,
              "TransferFromInventory",
              buildingIdx
            );
          }}
          className="change-recipe clickable"
        >
          From Inventory
        </div>
        <BuildingBufferDisplay
          inputBuffers={storage.outputBuffers}
          outputBuffers={undefined}
          doubleClickHandler={getEntityIconDoubleClickHandler(buildingIdx)}
          entityIconLookup={entityIconLookupByKind(storage.kind)}
        />
      </div>
    </div>
  );
}
