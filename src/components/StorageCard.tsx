import { GameDispatch } from "../GameDispatch";
import "./BuildingCard.scss";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import { entityIconLookupByKind } from "../utils";
import { showMoveItemToFromInventorySelector } from "./selectors";
import { Chest } from "../storage";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { CounterWithPlusMinusButtons } from "./CounterWithPlusMinusButtons";

export type StorageCardProps = {
  storage: Chest;
  /* dispatch: (a: GameAction) => void;
   * uiDispatch: (a: UIAction) => void; */
  buildingIdx: number;
  //  mainBus: MainBus;
  regionId: string;
};

function formatName(n: string) {
  return (n.charAt(0).toUpperCase() + n.slice(1, n.length)).replaceAll(
    "-",
    " "
  );
}
export function StorageCard({
  regionId,
  storage,
  buildingIdx,
}: StorageCardProps) {
  const generalDialog = useGeneralDialog();

  return (
    <div className="main-area">
      <div className="top-area">
        <div className="title">{formatName(storage.subkind)}</div>
        <span className={`icon ${storage.subkind}`} />
        <CounterWithPlusMinusButtons
          count={storage.BuildingCount}
          minusClickHandler={() =>
            GameDispatch({
              type: "DecreaseBuildingCount",
              regionId,
              buildingIdx,
            })
          }
          plusClickHandler={() =>
            GameDispatch({
              type: "IncreaseBuildingCount",
              regionId,
              buildingIdx,
            })
          }
        />
      </div>
      <div className="bottom-area">
        <div
          onClick={async () => {
            await showMoveItemToFromInventorySelector(
              generalDialog,
              "TransferFromInventory",
              regionId,
              buildingIdx
            );
          }}
          className="building-card-button clickable"
        >
          Fill From Inventory
        </div>
        <BuildingBufferDisplay
          inputBuffers={storage.outputBuffers}
          outputBuffers={undefined}
          buildingIdx={buildingIdx}
          entityIconLookup={entityIconLookupByKind(storage.kind)}
          regionId={regionId}
        />
      </div>
    </div>
  );
}
