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
//import { Recipies } from "./data";

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

const Recipes = ["iron-ore", "iron-plate"];
function loadInitialStateFromLocalStorage(): State {
  return {
    EntityCounts: Map(
      JSON.parse(localStorage.getItem("EntityCounts") || "false") || {
        Miner: 3,
        Assembler: 1,
      }
    ),
    EntityStorageCapacityUpgrades: Map(
      JSON.parse(localStorage.getItem("EntityStorageUpgrades") || "false") || {}
    ),
    EntityProducers: Map(
      JSON.parse(localStorage.getItem("EntityProducers") || "false") ||
        Recipes.map((r) => [r, Producer(r)])
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

export type TabPaneProps = {
  cardMap: Map<string, typeof Card[]>;
};

export const TabPane = ({ cardMap }: TabPaneProps) => (
  <div>
    <div>Ore</div>
  </div>
);

function App() {
  const [state, dispatch] = useReducer(entityCountReducer, initialState);
  const entityCount = (e: string): number =>
    globalEntityCount(state.EntityCounts, e);
  const storageCapacity = (e: string): number =>
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

  let cards = Recipes.map((r) => (
    <Card
      key={r}
      producer={state.EntityProducers.get(r)}
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
