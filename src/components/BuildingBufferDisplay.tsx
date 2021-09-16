import { ItemBuffer } from "../types";

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
    <div className="recipe-display">
      {inputBuffers &&
        inputBuffers.Entities().map(([entity, count]) => {
          return (
            <div
              key={entity}
              className="recipe-item"
              onDoubleClick={
                doubleClickHandler &&
                ((evt) => doubleClickHandler(evt, inputBuffers, entity))
              }
            >
              <div className="quantity-text">{Math.floor(count)}</div>
              <div className="icon-frame">
                {outputBuffers?.Count(entity) > 0 ? (
                  <div className={`icon landfill`} />
                ) : null}
                <div className={`icon ${entityIconLookup(entity)}`} />
              </div>
            </div>
          );
        })}
      <div className="equals-sign">=&gt;</div>
      {outputBuffers &&
        outputBuffers.Entities().map(([entity, count]) => (
          <div
            key={entity}
            className="recipe-item"
            onDoubleClick={
              doubleClickHandler &&
              ((evt) => doubleClickHandler(evt, outputBuffers, entity))
            }
          >
            <div className="quantity-text">{Math.floor(count)}</div>
            <div className="icon-frame item-icon-progress">
              <progress
                max={1}
                value={count % 1}
                className={`icon ${entityIconLookup(entity)}`}
              />
            </div>
          </div>
        ))}
    </div>
  );
}
