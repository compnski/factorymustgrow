import { GameDispatch } from "../GameDispatch";
import { ItemBuffer } from "../types";
import { InventoryDisplay } from "./InventoryDisplay";

export function BuildingBufferDisplay({
  inputBuffers,
  outputBuffers,
  buildingIdx,
  entityIconLookup = (entity: string): string => entity,
  outputInteractable = true,
  regionId,
}: {
  inputBuffers?: ItemBuffer;
  outputBuffers?: ItemBuffer;
  entityIconLookup?: (entity: string) => string;
  buildingIdx: number;
  outputInteractable?: boolean;
  regionId: string;
}) {
  const addClickHandler = function addClickHandler(entity: string) {
      GameDispatch({
        type: "TransferFromInventory",
        entity,
        buildingIdx,
        otherStackKind: "Building",
        regionId,
      });
    },
    remClickHandler = function remClickHandler(entity: string) {
      GameDispatch({
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
