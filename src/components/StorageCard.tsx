import { GameDispatch } from "../GameDispatch";
import "./BuildingCard.scss";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import { entityIconLookupByKind } from "../utils";
import { showMoveItemToFromInventorySelector } from "./selectors";
import { getEntityIconDoubleClickHandler } from "./events";
import { Chest } from "../storage";
import { useGeneralDialog } from "../GeneralDialogProvider";

export type StorageCardProps = {
  storage: Chest;
  /* dispatch: (a: GameAction) => void;
   * uiDispatch: (a: UIAction) => void; */
  buildingIdx: number;
  //  mainBus: MainBus;
};

export function StorageCard({ storage, buildingIdx }: StorageCardProps) {
  const generalDialog = useGeneralDialog();

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
              generalDialog,
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
