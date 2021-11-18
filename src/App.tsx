import "./icons.scss";
import "./technology.css";
import "./App.scss";

import { UpdateGameState } from "./factoryGame";
import { GameState, useGameState } from "./useGameState";
import { saveStateToLocalStorage } from "./localstorage";
import { useInterval } from "./reactUtils";
import { useUIState } from "./uiState";
import { ExploreGame } from "./explore/ExploreGame";
import { FactoryGame } from "./components/FactoryGame";
import { TicksPerSecond } from "./constants";
import { GameWindow } from "./globals";
import "./macro_def";
import { GeneralDialogProvider } from "./GeneralDialogProvider";

function App() {
  const [gameState, setGameState] = useGameState();
  const [uiState, uiDispatch] = useUIState();

  (window as unknown as GameWindow).uiDispatch = uiDispatch;

  useInterval(() => {
    // Your custom logic here
    const tick = new Date().getTime();
    UpdateGameState(tick, uiDispatch);
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
    <GeneralDialogProvider>
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
      </div>
    </GeneralDialogProvider>
  );
}

export default App;
