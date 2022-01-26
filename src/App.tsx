import "./icons.scss";
import "./technology.css";
import "./App.scss";

import { UpdateGameState } from "./factoryGame";
import { GameState, useGameState } from "./useGameState";
import { saveStateToLocalStorage } from "./localstorage";
import { useInterval } from "./reactUtils";
import { FactoryGame } from "./components/FactoryGame";
import { TicksPerSecond } from "./constants";
import "./macro_def";
import { GeneralDialogProvider } from "./GeneralDialogProvider";

function App() {
  const [gameState, setGameState] = useGameState();

  useInterval(() => {
    // Your custom logic here
    const tick = new Date().getTime();
    UpdateGameState(tick);
    saveStateToLocalStorage(GameState);
  }, 1000 / TicksPerSecond);

  useInterval(() => {
    setGameState({ ...GameState });
  }, 32);

  return (
    <GeneralDialogProvider>
      <div
        className="App"
        onClick={(evt) => {
          if ((evt.target as Element).classList.contains("clickable")) return;
        }}
      >
        <FactoryGame gameState={gameState} />
      </div>
    </GeneralDialogProvider>
  );
}

export default App;
