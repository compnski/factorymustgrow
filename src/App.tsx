import "./icons.scss";
import "./App.scss";

import {
  GameState,
  useGameState,
  UpdateGameState,
  GameDispatch,
} from "./factoryGame";
import { saveStateToLocalStorage } from "./localstorage";
import { useInterval } from "./reactUtils";
import { useUIState } from "./uiState";
import { ExploreGame } from "./explore/ExploreGame";
import { FactoryGame } from "./components/FactoryGame";
import { TicksPerSecond } from "./constants";

function App() {
  const [gameState, setGameState] = useGameState();
  const [uiState, uiDispatch] = useUIState();

  (window as any).dispatch = uiDispatch;

  useInterval(() => {
    // Your custom logic here
    const tick = new Date().getTime();
    UpdateGameState(tick);
    saveStateToLocalStorage(GameState);
  }, 1000 / TicksPerSecond);

  useInterval(() => {
    setGameState({ ...GameState });
  }, 32);

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
