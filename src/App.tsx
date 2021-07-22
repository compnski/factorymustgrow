import { SyntheticEvent, useEffect } from "react";
import "./icons.scss";
import "./App.scss";

import {
  GameState,
  useGameState,
  UpdateGameState,
  saveStateToLocalStorage,
  GameDispatch,
} from "./factoryGame";

import { useInterval } from "./reactUtils";
import { UIAction, useUIState } from "./uiState";
import { ExploreGame } from "./explore/ExploreGame";
import { FactoryGame } from "./components/FactoryGame";

function App() {
  //const [gameState, gameDispatch] = useGameState();
  const [gameState, setGameState] = useGameState(); //useState<FactoryGameState>(GameState);
  const [uiState, uiDispatch] = useUIState();

  (window as any).dispatch = uiDispatch;

  useInterval(() => {
    // Your custom logic here
    const tick = new Date().getTime();
    UpdateGameState(tick);
  }, 1000);

  useInterval(() => {
    setGameState({ ...GameState });
  }, 32);

  useEffect(() => {
    saveStateToLocalStorage(GameState);
  }, [GameState]);

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
      <FactoryGame
        gameState={gameState}
        uiState={uiState}
        uiDispatch={uiDispatch}
      />
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
  );
}

export default App;
