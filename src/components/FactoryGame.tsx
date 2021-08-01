import { SyntheticEvent } from "react";
import { FactoryGameState, GameDispatch, ResearchState } from "../factoryGame";
import { UIAction, UIState } from "../uiState";
import { ProducerCardList } from "./ProducerCardList";
import { RecipeSelector } from "./RecipeSelector";
import { InfoHeader } from "./InfoHeader";
import { MainBusHeader } from "./MainBusHeader";
import "./FactoryGame.scss";
import { entityIconLookupByKind } from "../utils";
import { availableRecipes, availableResearch } from "../research";

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
      recipes={availableRecipes(gameState.Research)}
      onClick={(evt: SyntheticEvent, r: string) => {
        uiDispatch({ type: "CloseDialog", evt });
        GameDispatch({ type: "NewProducer", producerName: r });
      }}
    />
  ) : null;

  const researchSelector = uiState.dialogs.researchSelectorOpen ? (
    <RecipeSelector
      recipes={availableResearch(gameState.Research)}
      onClick={(evt: SyntheticEvent, r: string) => {
        uiDispatch({ type: "CloseDialog", evt });
        GameDispatch({ type: "ChangeResearch", producerName: r });
      }}
      entityIconLookup={entityIconLookupByKind("Lab")}
    />
  ) : null;

  return (
    <div className="factoryGame">
      {recipeSelector || researchSelector}
      <InfoHeader uiDispatch={uiDispatch} gameState={gameState} />
      <MainBusHeader mainBus={gameState.Region.Bus} />
      <div className="scoller">
        <ProducerCardList
          mainBus={gameState.Region.Bus}
          buildings={gameState.Region.Buildings}
          regionalOre={gameState.Region.Ore}
        />
        <div className="add-producer-frame">
          <div
            className="add-producer clickable"
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
            className="add-producer clickable"
            onClick={(evt) =>
              GameDispatch({
                type: "NewLab",
              })
            }
          >
            Add Lab
          </div>
        </div>
        <div
          className="add-producer clickable"
          onClick={(evt) =>
            uiDispatch({
              type: "ShowResearchSelector",
              evt,
            })
          }
        >
          Choose Research
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
