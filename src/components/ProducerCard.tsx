import { GameDispatch } from "../factoryGame";
import { EntityStack, Producer } from "../types";
import "./BuildingCard.scss";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import { entityIconLookupByKind } from "../utils";
import { showChangeProducerRecipeSelector } from "./selectors";
import { useIconSelector } from "../IconSelectorProvider";
import { getEntityIconDoubleClickHandler } from "./events";

const ProducerIcon = (p: Producer): string => p.subkind;

export type ProducerCardProps = {
  producer: Producer;
  /* dispatch: (a: GameAction) => void;
   * uiDispatch: (a: UIAction) => void; */
  buildingIdx: number;
  //  mainBus: MainBus;
  regionalOre: Map<string, EntityStack>;
};

export function ProducerCard({
  producer,
  buildingIdx,
  regionalOre,
}: ProducerCardProps) {
  const selectRecipe = useIconSelector();

  var recipeInput = producer.inputBuffers;

  if (producer.kind === "Extractor" && producer.inputBuffers) {
    recipeInput = new Map();
    for (var [entity] of producer.inputBuffers) {
      const ore = regionalOre.get(entity);
      if (ore) recipeInput.set(entity, ore);
    }
  }

  return (
    <div className="main-area">
      <div className="top-area">
        <div className="title">{producer.RecipeId /* TODO Fix name */}</div>
        <div className="producer-count-area">
          <span className={`icon ${ProducerIcon(producer)}`} />
          <div
            className="plus-minus"
            onClick={() =>
              GameDispatch({
                type: "DecreaseBuildingCount",
                buildingIdx,
              })
            }
          >
            -
          </div>
          <div className="producer-count">{producer.BuildingCount}</div>
          <div
            className="plus-minus"
            onClick={() =>
              GameDispatch({
                type: "IncreaseBuildingCount",
                buildingIdx,
              })
            }
          >
            +
          </div>
        </div>
      </div>
      <div className="bottom-area">
        <div
          onClick={async () => {
            const recipe = await showChangeProducerRecipeSelector(
              producer.ProducerType,
              buildingIdx,
              selectRecipe
            );
          }}
          className="change-recipe clickable"
        >
          Change Recipe
        </div>
        <BuildingBufferDisplay
          inputBuffers={recipeInput}
          outputBuffers={producer.outputBuffers}
          doubleClickHandler={getEntityIconDoubleClickHandler(buildingIdx)}
          entityIconLookup={entityIconLookupByKind(producer.kind)}
        />
      </div>
    </div>
  );
}
