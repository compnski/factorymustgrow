import { SyntheticEvent } from "react";
import { FactoryGameState, GameDispatch } from "../factoryGame";
import { UIAction, UIState } from "../uiState";
import { ProducerCardList } from "./ProducerCardList";
import { RecipeSelector } from "./RecipeSelector";
import { InfoHeader } from "./InfoHeader";

type FactoryGameProps = {
  gameState: FactoryGameState;
  uiState: UIState;
  uiDispatch: (a: UIAction) => void;
};

export const FactoryGame = ({
  gameState,
  uiState,
  uiDispatch,
}: FactoryGameProps) => {
  const recipeSelector = uiState.dialogs.recipeSelectorOpen ? (
    <RecipeSelector
      recipes={[...gameState.UnlockedRecipes]}
      onClick={(evt: SyntheticEvent, r: string) => {
        uiDispatch({ type: "CloseDialog", evt });
        GameDispatch({ type: "NewProducer", producerName: r });
      }}
    />
  ) : null;

  return (
    <div className="factoryGame">
      {recipeSelector}
      <InfoHeader gameState={gameState} />
      <div className="scoller">
        <ProducerCardList buildings={gameState.Region.Buildings} />
        <div
          className="addProducer clickable"
          onClick={(evt) =>
            uiDispatch({
              type: "ShowRecipeSelector",
              evt,
            })
          }
        >
          Add Recipe
        </div>
        <div
          className="clickable resetButton"
          onClick={() =>
            uiDispatch({
              type: "OpenExploreGame",
            })
          }
        >
          Explore!
        </div>
      </div>
    </div>
  );
};
