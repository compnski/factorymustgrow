import { GameAction } from "../GameAction";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { ReadonlyBuilding, ReadonlyItemBuffer } from "../factoryGameState";
import { entityIconLookupByKind } from "../utils";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import "./BuildingCard.scss";
import { CounterWithPlusMinusButtons } from "./CounterWithPlusMinusButtons";
import { showMoveItemToFromInventorySelector } from "./selectors";

export type StorageCardProps = {
  storage: ReadonlyBuilding;
  buildingIdx: number;
  regionId: string;
  inventory: ReadonlyItemBuffer;
  uxDispatch: (a: GameAction) => void;
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
  inventory,
  uxDispatch,
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
            uxDispatch({
              type: "DecreaseBuildingCount",
              regionId,
              buildingIdx,
            })
          }
          plusClickHandler={() =>
            uxDispatch({
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
              uxDispatch,
              "TransferFromInventory",
              inventory.Entities().map(([entity]) => entity),
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
          uxDispatch={uxDispatch}
        />
      </div>
    </div>
  );
}
