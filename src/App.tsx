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
  );
}

export default App;
