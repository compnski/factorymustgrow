import { useRef, useEffect, useReducer } from "react";
import "./icons.scss";
import "./App.scss";
import { Map } from "immutable";
import { Entity, ProducingEntity, Recipe } from "./types";
import {
  State,
  entityCountReducer,
  globalEntityCount,
  entityStorageCapacity,
} from "./logic";
import { Recipies } from "./data";

import { Card } from "./Card";

const Producer = function (recipeName: string): ProducingEntity {
  return {
    RecipeName: recipeName,
    ProducerCount: 0,
    ProducerCapacityUpgradeCount: 0,
    ProducerMaxCapacityUpgradeCount: 0,
    ResearchUpgradeCount: 0,
  };
};

function loadInitialStateFromLocalStorage(): State {
  return {
    EntityCounts: Map(
      JSON.parse(localStorage.getItem("EntityCounts") || "false") || {
        Miner: 3,
      }
    ),
    EntityStorageCapacityUpgrades: Map(
      JSON.parse(localStorage.getItem("EntityStorageUpgrades") || "false") || {}
    ),
    EntityProducers: Map(
      JSON.parse(localStorage.getItem("EntityProducers") || "false") ||
        Recipies.map((r) => [r.Name, Producer(r.Name)])
    ),
  };
}

function saveStateToLocalStorage(state: State) {
  localStorage.setItem(
    "EntityCounts",
    JSON.stringify(state.EntityCounts.toJSON())
  );
  localStorage.setItem(
    "EntityStorageUpgrades",
    JSON.stringify(state.EntityStorageCapacityUpgrades.toJSON())
  );
  localStorage.setItem(
    "EntityProducers",
    JSON.stringify(state.EntityProducers.toJSON())
  );
}
const initialState: State = loadInitialStateFromLocalStorage();

/* Thanks Dan Abramov  for useInterval hook
   https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      if (savedCallback.current != null) savedCallback.current();
    }
    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

function App() {
  const [state, dispatch] = useReducer(entityCountReducer, initialState);
  const entityCount = (e: Entity): number =>
    globalEntityCount(state.EntityCounts, e);
  const storageCapacity = (e: Entity): number =>
    entityStorageCapacity(state.EntityStorageCapacityUpgrades, e);
  useInterval(() => {
    // Your custom logic here
    state.EntityProducers.forEach((p, k) => {
      for (let i = 0; i < p.ProducerCount; i++) {
        dispatch({ producerName: k, type: "Produce" });
      }
    });
  }, 1000);
  useEffect(() => {
    saveStateToLocalStorage(state);
  }, [state]);

  let cards = Recipies.map((r) => (
    <Card
      key={r.Name}
      producer={state.EntityProducers.get(r.Name)}
      dispatch={dispatch}
      globalEntityCount={entityCount}
      entityStorageCapacity={storageCapacity}
    />
  ));

  return (
    <div className="App">
      {cards}
      <a href="https://github.com/compnski/factorymustgrow">Github</a>
    </div>
  );
}

export default App;
