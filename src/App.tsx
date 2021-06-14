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
import * as entities from "./entities";

import { Card } from "./Card";

const Producer = function (r: Recipe): ProducingEntity {
  return {
    Recipe: r,
    ProducerCount: 0,
    ProducerCapacityUpgradeCount: 0,
    ProducerMaxCapacityUpgradeCount: 0,
    ResearchUpgradeCount: 0,
  };
};

const Recipies = [
  entities.IronOreRecipe,
  entities.IronPlateRecipe,
  entities.CopperOreRecipe,
  entities.CopperPlateRecipe,
  entities.CopperWireRecipe,
  entities.GearRecipe,
  entities.GreenChipRecipe,
  entities.MinerRecipe,
  entities.AssemblerRecipe,
];

const initialState: State = {
  EntityCounts: Map(),
  EntityStorageCapacityUpgrades: Map(),
  EntityProducers: Map(Recipies.map((r) => [r.Name, Producer(r)])),
};
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
  let cards = Recipies.map((r) => (
    <Card
      key={r.Name}
      producer={state.EntityProducers.get(r.Name)}
      dispatch={dispatch}
      globalEntityCount={entityCount}
      entityStorageCapacity={storageCapacity}
    />
  ));

  return <div className="App">{cards}</div>;
}

export default App;
