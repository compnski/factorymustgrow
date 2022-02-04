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
import {
  GeneralDialogProvider,
  useGeneralDialog,
} from "./GeneralDialogProvider";

function App() {
  return (
    <GeneralDialogProvider>
      <div
        className="App"
        onClick={(evt) => {
          if ((evt.target as Element).classList.contains("clickable")) return;
        }}
      >
        <FactoryGame />
      </div>
    </GeneralDialogProvider>
  );
}

export default App;
