import React, { useRef, useEffect, useReducer } from "react";
import sprite from "./icon_sprite.png";
import "./icons.scss";
import "./App.scss";
import { Map } from "immutable";
import {
  Entity,
  EntityStack,
  ProducerType,
  Recipe,
  ProducingEntity,
} from "./types";
import {
  State,
  entityCountReducer,
  Action,
  CurrentMaxProducerCount,
} from "./logic";
import * as entities from "./entities";
//enum ProducerType {}

const ProducerTypeIconMap: { [key: string]: string } = {
  Assembler: "assembling-machine-1",
  Smelter: "stone-furnace",
  Miner: "electric-mining-drill",
  ChemFactory: "",
  Refinery: "",
  Pumpjack: "",
};

const rateToTime = function (rate: number): string {
  return `${rate}/m`;
};

const CurrentProducerRate = function (p: ProducingEntity): number {
  return (1 / p.Recipe.DurationSeconds) * p.ProducerCount;
};

const ProducerIcon = (p: ProducingEntity): string =>
  ProducerTypeIconMap[p.Recipe.ProducerType];

type RecipeProps = {
  recipe: Recipe;
};

const RecipeDisplay = ({ recipe }: RecipeProps) => (
  <div className="recipe">
    {recipe.Input.map((x, i) => (
      <span key={i}>
        <span>{x.Count}</span>
        <div className={`icon ${x.Entity.Icon}`} />
      </span>
    ))}
    <span>=</span>
    {recipe.Output.map((x, i) => (
      <span key={i}>
        <span>{x.Count}</span>
        <div className={`icon ${x.Entity.Icon}`} />
      </span>
    ))}
  </div>
);

var IronOreProducer: ProducingEntity = {
  Recipe: entities.IronOreRecipe,
  ProducerCount: 0,
  ProducerCapacityUpgradeCount: 0,
  ProducerMaxCapacityUpgradeCount: 0,
  ResearchUpgradeCount: 0,
};

var IronPlateProducer: ProducingEntity = {
  Recipe: entities.IronPlateRecipe,
  ProducerCount: 0,
  ProducerCapacityUpgradeCount: 0,
  ProducerMaxCapacityUpgradeCount: 0,
  ResearchUpgradeCount: 0,
};

const initialState: State = {
  EntityCounts: Map(),
  EntityStorageCapacityUpgrades: Map(),
  EntityProducers: Map({
    "Iron Ore": IronOreProducer,
    "Iron Plate": IronPlateProducer,
  }),
};

type CardProps = {
  producer?: ProducingEntity;
  dispatch(a: Action): void;
  globalEntityCount: (e: Entity) => number;
};

export const Card = ({ producer, dispatch, globalEntityCount }: CardProps) => {
  if (!producer) return <div className="NoProducer" />;
  return (
    <div className="Producer">
      <div className="title">
        <span>{producer.Recipe.Name} </span>
      </div>
      <div className="infoRow">
        <div
          onClick={() => {
            dispatch({ producer: producer, type: "Produce" });
          }}
          className={producer.Recipe.Icon + " icon clickable"}
        />
        <div className="rate">{rateToTime(CurrentProducerRate(producer))}</div>
        <div className="plusMinus">
          <span
            onClick={() =>
              dispatch({ producer: producer, type: "AddProducer" })
            }
            className="clickable"
          >
            +
          </span>
          <span
            onClick={() =>
              dispatch({ producer: producer, type: "RemoveProducer" })
            }
            className="clickable"
          >
            -
          </span>
        </div>
        <span className={`icon producerTypeIcon ${ProducerIcon(producer)}`} />
        <div className="producerCount">
          <span className="currentCapacity">{producer.ProducerCount}</span>
          <span>/</span>

          <span className="maxCapacity">
            {CurrentMaxProducerCount(producer)}
          </span>
        </div>
        <div className="plusMinus maxCapacity">
          <span
            onClick={() =>
              dispatch({ producer: producer, type: "AddProducerCapacity" })
            }
            className="clickable"
          >
            +
          </span>
          <span
            onClick={() =>
              dispatch({ producer: producer, type: "RemoveProducerCapacity" })
            }
            className="clickable"
          >
            -
          </span>
        </div>
        <div className="filler" />
        <div className="icon space-science-pack clickable" />
      </div>
      <div className="infoRow">
        <div className="count">
          {globalEntityCount(producer.Recipe.Output[0].Entity)}
        </div>
        {producer.Recipe.Input.length > 0 ? (
          <RecipeDisplay recipe={producer.Recipe} />
        ) : (
          <div />
        )}
      </div>
    </div>
  );
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
  const globalEntityCount = (e: Entity): number =>
    state.EntityCounts.get(e.Name) || 0;
  return (
    <div className="App">
      return{" "}
      <Card
        producer={state.EntityProducers.get("Iron Ore")}
        dispatch={dispatch}
        globalEntityCount={globalEntityCount}
      />
      return{" "}
      <Card
        producer={state.EntityProducers.get("Iron Plate")}
        dispatch={dispatch}
        globalEntityCount={globalEntityCount}
      />
    </div>
  );
}

export default App;
