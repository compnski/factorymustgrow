import React from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import { LoadScreen } from "./components/LoadScreen";
import { StartScreen } from "./components/StartScreen";
import FactoryGameMain from "./factory_game_main";
import { LoadEntitySet } from "./gen/entities";
import "./index.css";
import Planner from "./Planner";
import reportWebVitals from "./reportWebVitals";

if (window.location.hash === "#reset") {
  localStorage.clear();
  window.location.hash = "";
}

function newGame() {
  // TODO: Clear current game
  // Figure out how to reset w/o clearing local storage
  //Maybe just clear current game?
  return <Navigate to="/game" replace={true} />;
}

const router = createHashRouter([
  {
    path: "/",
    element: <StartScreen />,
    //    loader: async () => ,
  },
  {
    path: "planner",
    element: <Planner />,
    loader: async () => await LoadEntitySet("factorio"),
  },
  {
    path: "game",
    element: <FactoryGameMain />,
    loader: async () => await LoadEntitySet("factorio"),
  },
  /* {
   *   loader: async () => await LoadEntitySet("factorio"),
   *   path: "newgame",
   *   element: newGame(),
   * }, */

  /* {
   *   path: "load",
   *   element: <LoadScreen />,
   *   loader: async () => await LoadEntitySet("factorio"), */
  //  },
]);

const container = document.getElementById("root");
if (!container) throw new Error("Missing root.");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
