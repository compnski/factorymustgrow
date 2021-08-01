import { EntityStack } from "../types";

export function ProducerBufferDisplay({
  inputBuffers,
  outputBuffer,
}: {
  inputBuffers: Map<string, EntityStack> | undefined;
  outputBuffer: EntityStack | undefined;
}) {
  return (
    <div className="recipeDisplay">
      {inputBuffers &&
        [...inputBuffers.entries()].map(([Entity, entityStack]) => {
          return (
            <div key={Entity} className="recipeItem">
              <div className="quantityText">
                {Math.floor(entityStack.Count)}
              </div>
              <div className="iconFrame">
                {Entity === outputBuffer?.Entity ? (
                  <div className={`icon landfill`} />
                ) : null}
                <div className={`icon ${Entity}`} />
              </div>
            </div>
          );
        })}
      <div className="equalsSign">=&gt;</div>
      {outputBuffer && (
        <div key={outputBuffer.Entity} className="recipeItem">
          <div className="quantityText">
            {Math.floor(outputBuffer?.Count || 0)}
          </div>
          <div className="iconFrame item-icon-progress">
            <progress
              max={1}
              value={(outputBuffer?.Count || 0) % 1}
              className={`icon ${outputBuffer.Entity}`}
            />
          </div>
        </div>
      )}
      ;
    </div>
  );
}
