import { ShortcutProvider } from "react-keybind";
import "./App.scss";
import { FactoryGame } from "./components/FactoryGame";
import { GeneralDialogProvider } from "./GeneralDialogProvider";
import "./icons.scss";
import "./macro_def";
import { getDispatchFunc } from "./stateVm";
import "./technology.css";

function App() {
  const { gameState, dispatch, executeActions } = getDispatchFunc();
  return (
    <ShortcutProvider>
      <GeneralDialogProvider>
        <div
          className="App"
          onClick={(evt) => {
            if ((evt.target as Element).classList.contains("clickable")) return;
          }}
        >
          <FactoryGame
            gameState={gameState}
            dispatch={dispatch}
            executeActions={executeActions}
          />
        </div>
      </GeneralDialogProvider>
    </ShortcutProvider>
  );
}

export default App;
