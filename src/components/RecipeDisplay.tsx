import { EntityStack, Recipe } from "../types";
import { GetEntity } from "../gen/entities";

export function RecipeDisplay({
  recipe,
  inputBuffers,
  outputBuffer,
}: {
  recipe: Recipe;
  inputBuffers: Map<string, EntityStack> | undefined;
  outputBuffer: EntityStack | undefined;
}) {
  return (
    <div className="recipeDisplay">
      {recipe.Input.map((x, i) => {
        const producerCount = inputBuffers?.get(x.Entity)?.Count || 0;
        return (
          <div key={x.Entity} className="recipeItem" title={`Cost: ${x.Count}`}>
            <div className="quantityText">{Math.floor(producerCount)}</div>
            <div className="iconFrame">
              {x.Entity === outputBuffer?.Entity ? (
                <div className={`icon landfill`} />
              ) : null}
              <div className={`icon ${GetEntity(x.Entity).Id}`} />
            </div>
          </div>
        );
      })}
      <div className="equalsSign">=&gt;</div>
      <div className="recipeItem">
        <div
          className="quantityText"
          title={`Produces: ${outputBuffer?.Count}`}
        >
          {Math.floor(outputBuffer?.Count || 0)}
        </div>
        <div className="iconFrame item-icon-progress">
          <progress
            max={1}
            value={(outputBuffer?.Count || 0) % 1}
            className={`icon ${GetEntity(recipe.Output.Entity).Id}`}
          />
        </div>
      </div>
    </div>
  );
}
