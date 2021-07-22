import { SyntheticEvent, useEffect } from "react";
import "./icons.scss";
import "./App.scss";

import {
  GameAction,
  FactoryGameState,
  GameState,
  useGameState,
  UpdateGameState,
  saveStateToLocalStorage,
  GameDispatch,
} from "./factoryGame";
import { ProducerCard } from "./components/ProducerCard";
import { useInterval } from "./reactUtils";
import { UIAction, useUIState } from "./uiState";

import { ExploreGame } from "./explore/ExploreGame";

import { RecipeSelector } from "./components/RecipeSelector";
import { InfoHeader } from "./components/InfoHeader";

const UnlockedRecipes = new Set([
  "iron-ore",
  "copper-ore",
  "stone",
  "stone-furnace",
  "iron-plate",
  "copper-plate",
  "copper-cable",
  "iron-gear-wheel",
  "electronic-circuit",
  "electric-mining-drill",
  "assembling-machine-1",
  "iron-chest",
]);

function App() {
  //const [gameState, gameDispatch] = useGameState();
  const [gameState, setGameState] = useGameState(); //useState<FactoryGameState>(GameState);
  const [uiState, uiDispatch] = useUIState();

  (window as any).dispatch = uiDispatch;

  useInterval(() => {
    // Your custom logic here
    const tick = new Date().getTime();
    UpdateGameState(tick);
    setGameState({ ...GameState });
  }, 1000);

  useEffect(() => {
    saveStateToLocalStorage(GameState);
  }, [GameState]);

  const recipeSelector = uiState.dialogs.recipeSelectorOpen ? (
    <RecipeSelector
      recipes={[...UnlockedRecipes]}
      onClick={(evt: SyntheticEvent, r: string) => {
        uiDispatch({ type: "CloseDialog", evt });
        GameDispatch({ type: "NewProducer", producerName: r });
      }}
    />
  ) : null;

  let cards;

  cards = gameState.Region.Buildings.map((ep, idx) => {
    const r = ep.RecipeId;
    return (
      <ProducerCard
        key={idx}
        buildingIdx={idx}
        producer={ep}
        dispatch={GameDispatch}
      />
    );
  });

  const exploreGameEndCallback = () => {
    console.log("Game Ended");
    uiDispatch({ type: "CloseExploreGame" });
  };

  const exploreGame = uiState.exploreGameOpen ? (
    <ExploreGame
      resources={[
        { kind: "space", count: 150 },
        { kind: "copper-ore", count: 100_000 },
      ]}
      inventory={[{ kind: "turret", count: 20 }]}
      gameEndCallback={exploreGameEndCallback}
    />
  ) : null;

  return (
    <div
      className="App"
      onClick={(evt) => {
        if ((evt.target as Element).classList.contains("clickable")) return;
        uiDispatch({ type: "CloseDialog", evt });
      }}
    >
      {exploreGame}
      {recipeSelector}
      <InfoHeader gameState={gameState} />
      <div className="scoller">
        {cards}
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

        <p
          className="clickable resetButton"
          onClick={() =>
            GameDispatch({
              producerName: "",
              type: "Reset",
            })
          }
        >
          Reset
        </p>

        <p>
          <a href="https://github.com/compnski/factorymustgrow">Github</a>
        </p>
      </div>
    </div>
  );
}

export default App;
