import { GameDispatch } from "../GameDispatch";
import { ItemBuffer } from "../types";
import { InventoryDisplay } from "./InventoryDisplay";

export function BuildingBufferDisplay({
  inputBuffers,
  outputBuffers,
  buildingIdx,
  entityIconLookup = (entity: string): string => entity,
  outputInteractable = true,
}: {
  inputBuffers?: ItemBuffer;
  outputBuffers?: ItemBuffer;
  entityIconLookup?: (entity: string) => string;
  buildingIdx: number;
  outputInteractable?: boolean;
}) {
  const addClickHandler = function addClickHandler(entity: string) {
      GameDispatch({
        type: "TransferFromInventory",
        entity,
        buildingIdx,
        otherStackKind: "Building",
      });
    },
    remClickHandler = function remClickHandler(entity: string) {
      GameDispatch({
        type: "TransferToInventory",
        entity,
        buildingIdx,
        otherStackKind: "Building",
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
          doubleClickHandler={doubleClickHandler}
          showProgressBar={true}
          entityIconLookup={entityIconLookup}
        />
      )}
    </div>
  );
}

/* inputBuffers.Entities().map(([entity, count]) => {
 *   return (
 *     <div
 *       key={entity}
 *       className="recipe-item"
 *       onDoubleClick={
 *         doubleClickHandler &&
 *         ((evt) => doubleClickHandler(evt, inputBuffers, entity))
 *       }
 *     >
 *       <div className="quantity-text">{Math.floor(count)}</div>
 *       <div className="icon-frame">
 *         {outputBuffers?.Count(entity) > 0 ? (
 *           <div className={`icon landfill`} />
 *         ) : null}
 *         <div className={`icon ${entityIconLookup(entity)}`} />
 *       </div>
 *     </div>
 *   );
 * })} */
