import { useState } from "react";
import "./App.scss";
import FactoryGameMain from "./factory_game_main";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  async function loadGame() {
    setShowIntro(false);
  }
  async function newGame() {
    setShowIntro(false);
  }

  const Buttons = {
    Continue: () => void loadGame(),
    "New Game": () => newGame(),
    "Load Game": () => loadGame(),
    Planner: () => (window.location.href = "/planner"),
    Help: () => alert("Click the ? in the upper right once you are playing."),
    Credits: () => window.open("https://gitlab.com/omgbear/quicktower"),
  };

  const buttonClasses =
    "backdrop-brightness-50 shadow shadow-orange-800 w-72 p-2 hover:ring-sky-700 hover:ring-2 focus:ring-sky-700 focus:ring-2";
  function introScreen() {
    return (
      <div className="w-full h-full">
        <div className="m-auto bg-logo w-full min-h-screen">
          <div className="h-96" />
          <ul className="text-4xl ml-48 text-slate-50 font-synkopy list-disc select-none cursor-pointer align-middle leading-none">
            {Object.entries(Buttons).map(([name, func]) => (
              <li key={name}>
                <button className={buttonClasses} onClick={func}>
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  function factoryGameScreen() {
    return <FactoryGameMain />;
  }

  return <>{showIntro ? introScreen() : factoryGameScreen()}</>;
}

export default App;
