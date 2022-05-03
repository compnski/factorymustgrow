import { GameAction } from "../GameAction";
import { ReadonlyItemBuffer } from "../useGameState";
import { InventoryDisplay } from "./InventoryDisplay";

export function BuildingBufferDisplay({
  inputBuffers,
  outputBuffers,
  buildingIdx,
  entityIconLookup = (entity: string): string => entity,
  outputInteractable = true,
  regionId,
  uxDispatch,
}: {
  inputBuffers?: ReadonlyItemBuffer;
  outputBuffers?: ReadonlyItemBuffer;
  entityIconLookup?: (entity: string) => string;
  buildingIdx: number;
  outputInteractable?: boolean;
  regionId: string;
  uxDispatch: (a: GameAction) => void;
}) {
  const addClickHandler = function addClickHandler(entity: string) {
      uxDispatch({
        type: "TransferFromInventory",
        entity,
        buildingIdx,
        otherStackKind: "Building",
        regionId,
      });
    },
    remClickHandler = function remClickHandler(entity: string) {
      uxDispatch({
        type: "TransferToInventory",
        entity,
        buildingIdx,
        otherStackKind: "Building",
        regionId,
      });
    };

  return (
    // TODO: Fix extractor display
    <div className="recipe-display">
      {inputBuffers && (
        <InventoryDisplay
          inventory={inputBuffers}
          addClickHandler={addClickHandler}
          remClickHandler={remClickHandler}
          entityIconLookup={entityIconLookup}
        />
      )}
      {inputBuffers && outputBuffers && (
        <div className="equals-sign">=&gt;</div>
      )}
      {outputBuffers && (
        <InventoryDisplay
          inventory={outputBuffers}
          addClickHandler={(outputInteractable && addClickHandler) || undefined}
          remClickHandler={(outputInteractable && remClickHandler) || undefined}
          showProgressBar={true}
          entityIconLookup={entityIconLookup}
        />
      )}
    </div>
  );
}
