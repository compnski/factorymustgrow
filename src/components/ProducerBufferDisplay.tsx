import { SyntheticEvent } from "react";
import { EntityStack, FillEntityStack } from "../types";

export function ProducerBufferDisplay({
  inputBuffers,
  outputBuffers,
  doubleClickHandler,
  entityIconLookup = (entity: string): string => entity,
}: {
  inputBuffers: Map<string, EntityStack> | undefined;
  outputBuffers: Map<string, EntityStack> | undefined;
  entityIconLookup?: (entity: string) => string;
  doubleClickHandler?: (
    evt: {
      clientX: number;
      clientY: number;
      ctrlKey: boolean;
      //target: { hasOwnProperty(p: string): boolean }; //unknown; //{ getBoundingClientRect(): DOMRect };
      nativeEvent: { offsetX: number; offsetY: number };
    },

    s: EntityStack
  ) => void;
}) {
  return (
    <div className="recipeDisplay">
      {inputBuffers &&
        [...inputBuffers.entries()].map(([Entity, entityStack]) => {
          return (
            <div
              key={Entity}
              className="recipeItem"
              onDoubleClick={
                doubleClickHandler &&
                ((evt) => doubleClickHandler(evt, entityStack))
              }
            >
              <div className="quantityText">
                {Math.floor(entityStack.Count)}
              </div>
              <div className="iconFrame">
                {outputBuffers?.has(Entity) ? (
                  <div className={`icon landfill`} />
                ) : null}
                <div className={`icon ${entityIconLookup(Entity)}`} />
              </div>
            </div>
          );
        })}
      <div className="equalsSign">=&gt;</div>
      {outputBuffers &&
        [...outputBuffers.values()].map((outputBuffer) => (
          <div
            key={outputBuffer.Entity}
            className="recipeItem"
            onDoubleClick={
              doubleClickHandler &&
              ((evt) => doubleClickHandler(evt, outputBuffer))
            }
          >
            <div className="quantityText">
              {Math.floor(outputBuffer?.Count || 0)}
            </div>
            <div className="iconFrame item-icon-progress">
              <progress
                max={1}
                value={(outputBuffer?.Count || 0) % 1}
                className={`icon ${entityIconLookup(outputBuffer.Entity)}`}
              />
            </div>
          </div>
        ))}
      ;
    </div>
  );
}
