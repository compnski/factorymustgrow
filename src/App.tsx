import "./App.scss";
import { FactoryGame } from "./components/FactoryGame";
import { GeneralDialogProvider } from "./GeneralDialogProvider";
import "./icons.scss";
import "./macro_def";
import "./technology.css";

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
