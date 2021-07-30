import { SyntheticEvent } from "react";
import { FactoryGameState, GameDispatch } from "../factoryGame";
import { UIAction, UIState } from "../uiState";
import { ProducerCardList } from "./ProducerCardList";
import { RecipeSelector } from "./RecipeSelector";
import { InfoHeader } from "./InfoHeader";
import { MainBus } from "../types";
import { MainBusHeader } from "./MainBusHeader";
import "./FactoryGame.scss";

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
      <MainBusHeader mainBus={gameState.Region.Bus} />
      <div className="scoller">
        <ProducerCardList
          mainBus={gameState.Region.Bus}
          buildings={gameState.Region.Buildings}
          regionalOre={gameState.Region.Ore}
        />
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
          className="clickable exploreButton"
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
