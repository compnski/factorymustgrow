import { EntityStack, FillEntityStack } from "../types";

export function ProducerBufferDisplay({
  inputBuffers,
  outputBuffer,
  entityIconLookup = (entity: string): string => entity,
}: {
  inputBuffers: Map<string, EntityStack> | undefined;
  outputBuffer: EntityStack | undefined;
  entityIconLookup?: (entity: string) => string;
}) {
  return (
    <div className="recipeDisplay">
      {inputBuffers &&
        [...inputBuffers.entries()].map(([Entity, entityStack]) => {
          return (
            <div
              key={Entity}
              className="recipeItem"
              onDoubleClick={() => FillEntityStack(entityStack, 1)}
            >
              <div className="quantityText">
                {Math.floor(entityStack.Count)}
              </div>
              <div className="iconFrame">
                {Entity === outputBuffer?.Entity ? (
                  <div className={`icon landfill`} />
                ) : null}
                <div className={`icon ${entityIconLookup(Entity)}`} />
              </div>
            </div>
          );
        })}
      <div className="equalsSign">=&gt;</div>
      {outputBuffer && (
        <div
          key={outputBuffer.Entity}
          className="recipeItem"
          onDoubleClick={() => FillEntityStack(outputBuffer, 1)}
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
      )}
      ;
    </div>
  );
}
