import { GameAction } from "../factoryGame";
import { Producer, Recipe } from "../types";
import { GetEntity, GetRecipe } from "../gen/entities";
import "./ProducerCard.scss";

const RecipeDisplay = ({
  recipe,
  producer,
}: {
  recipe: Recipe;
  producer: Producer;
}) => (
  <div className="recipeDisplay">
    {recipe.Input.map((x, i) => {
      const producerCount = producer.inputBuffers?.get(x.Entity)?.Count || 0;
      return (
        <span key={i}>
          <span>
            {x.Count}/{Math.floor(producerCount)}
          </span>
          <span className={`icon ${GetEntity(x.Entity).Id}`} />
        </span>
      );
    })}
    <span>=</span>
    <span>
      <span>
        {recipe.Output.Count}/{Math.floor(producer.outputBuffer?.Count || 0)}
      </span>
      <div className={`icon ${GetEntity(recipe.Output.Entity).Id}`} />
    </span>
  </div>
);

export type ProducerCardProps = {
  producer: Producer;
  dispatch: (a: GameAction) => void;
  buildingIdx: number;
};

const ProducerTypeIconMap: { [key: string]: string } = {
  Assembler: "assembling-machine-1",
  Smelter: "stone-furnace",
  Miner: "electric-mining-drill",
  ChemFactory: "",
  Refinery: "",
  Pumpjack: "",
};

const ProducerIcon = (r: Recipe): string => ProducerTypeIconMap[r.ProducerType];

export const ProducerCard = ({
  producer,
  buildingIdx,
  dispatch,
}: ProducerCardProps) => {
  const recipe = GetRecipe(producer.RecipeId);
  return (
    <div className="producerCard">
      <div className="dragArea"></div>
      <div className="mainArea">
        <div className="topArea">
          <div className="title">{recipe.Name}</div>
          <div className="producerCountArea">
            <span className={`icon ${ProducerIcon(recipe)}`} />
            <div
              className="plusMinus"
              onClick={() =>
                dispatch({
                  type: "DecreaseProducerCount",
                  buildingIdx,
                  producerName: producer.RecipeId,
                })
              }
            >
              -
            </div>
            <div className="producerCount">{producer.ProducerCount}</div>
            <div
              className="plusMinus"
              onClick={() =>
                dispatch({
                  type: "IncreaseProducerCount",
                  buildingIdx,
                  producerName: producer.RecipeId,
                })
              }
            >
              +
            </div>
          </div>
        </div>
        <div className="bottomArea">
          <RecipeDisplay producer={producer} recipe={recipe} />
        </div>
      </div>
      <div className="outputArea">
        <div
          className="outputArrow up"
          onClick={() =>
            dispatch({
              type: "ToggleUpperOutputState",
              buildingIdx,
              producerName: producer.RecipeId,
            })
          }
        >
          {producer.outputStatus.above == "OUT"
            ? "^"
            : producer.outputStatus.above == "IN"
            ? "v"
            : "-"}
        </div>
        <div className="outputArrow right">&gt;</div>
        <div
          className="outputArrow down"
          onClick={() =>
            dispatch({
              type: "ToggleLowerOutputState",
              buildingIdx,
              producerName: producer.RecipeId,
            })
          }
        >
          {producer.outputStatus.below == "OUT"
            ? "v"
            : producer.outputStatus.below == "IN"
            ? "^"
            : "-"}
        </div>
      </div>
    </div>
  );
};
