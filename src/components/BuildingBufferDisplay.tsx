import { ItemBuffer } from "../types";
import { InventoryDisplay } from "./InventoryDisplay";

export function BuildingBufferDisplay({
  inputBuffers,
  outputBuffers,
  doubleClickHandler,
  entityIconLookup = (entity: string): string => entity,
}: {
  inputBuffers: ItemBuffer;
  outputBuffers: ItemBuffer;
  entityIconLookup?: (entity: string) => string;
  doubleClickHandler?: (
    evt: {
      clientX: number;
      clientY: number;
      shiftKey: boolean;
      //target: { hasOwnProperty(p: string): boolean }; //unknown; //{ getBoundingClientRect(): DOMRect };
      nativeEvent: { offsetX: number; offsetY: number };
    },
    itemBuffer: ItemBuffer,
    entity: string
  ) => void;
}) {
  return (
    // TODO: Fix extractor display
    <div className="recipe-display">
      {inputBuffers && (
        <InventoryDisplay
          inventory={inputBuffers}
          doubleClickHandler={doubleClickHandler}
          entityIconLookup={entityIconLookup}
        />
      )}
      <div className="equals-sign">=&gt;</div>
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
