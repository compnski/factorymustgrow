import { Link } from "react-router-dom";
import "../App.scss";

const Buttons = {
  Continue: "game",
  "New Game": "game",
  "Load Game": "game",
  Planner: "planner",
  Help: "help",
  Credits: "https://gitlab.com/omgbear/factorymustgrow",
};

const buttonClasses =
  "backdrop-brightness-50 shadow shadow-orange-800 w-72 p-2 hover:ring-sky-700 hover:ring-2 focus:ring-sky-700 focus:ring-2";

export function StartScreen() {
  return (
    <div className="w-full h-full">
      <div className="m-auto bg-logo w-full min-h-screen">
        <div className="h-96" />
        <ul className="text-4xl ml-48 text-slate-50 font-synkopy list-disc select-none cursor-pointer align-middle leading-none">
          {Object.entries(Buttons).map(([name, location]) => (
            <Link to={location}>
              <li key={name} className={buttonClasses}>
                {name}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
