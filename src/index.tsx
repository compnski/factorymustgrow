import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GameDispatch } from "./factoryGame";

ReactDOM.render(
  <React.StrictMode>
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />

    <App />
    <p
      className="clickable resetButton"
      onClick={() =>
        GameDispatch({
          producerName: "",
          type: "Reset",
        })
      }
    >
      Reset
    </p>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
