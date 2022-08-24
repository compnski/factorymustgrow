import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import Planner from "./Planner";
import reportWebVitals from "./reportWebVitals";

if (window.location.hash === "#reset") {
  localStorage.clear();
  window.location.hash = "";
}

const mode = window.location.pathname === "/planner" ? "planner" : "game";

const container = document.getElementById("root");
if (!container) throw new Error("Missing root.");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />

    {mode == "planner" ? <Planner /> : <App />}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
