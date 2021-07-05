import { useRef, useEffect } from "react";
import "./icons.scss";
import "./App.scss";
import { Map } from "immutable";
import {
  GameAction,
  useGameState,
  globalEntityCount,
  entityStorageCapacity,
  saveStateToLocalStorage,
} from "./logic";

import { UIAction, useUIState } from "./uiState";

import { Card } from "./Card";

const UnlockedRecipes = new Set([
  "iron-ore",
  "copper-ore",
  "stone",
  "stone-furnace",
  "iron-plate",
  "copper-plate",
  "copper-cable",
  "iron-gear-wheel",
  "electronic-circuit",
  "electric-mining-drill",
  "assembling-machine-1",
  "iron-chest",
]);

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

export type RecipeSelectorProps = {
  dispatch(a: UIAction | GameAction): void;
  recipes: string[];
};

export const RecipeSelector = ({ recipes, dispatch }: RecipeSelectorProps) => {
  const recipeIcons = recipes.map((r) => {
    return (
      <div
        key={r}
        className={`clickable icon ${r}`}
        onClick={(evt) => {
          dispatch({ type: "CloseDialog", evt });
          dispatch({ type: "NewProducer", producerName: r });
        }}
      />
    );
  });
  return (
    <div className="recipeSelector modal">
      <p>Select Recipe</p>
      <div className="recipeList">{recipeIcons}</div>
    </div>
  );
};

function App() {
  const [gameState, gameDispatch] = useGameState();
  const [uiState, uiDispatch] = useUIState();

  const dispatch = (action: UIAction | GameAction) =>
    (action as GameAction).producerName == null
      ? uiDispatch(action as UIAction)
      : gameDispatch(action as GameAction);

  const entityCount = (e: string): number =>
    globalEntityCount(gameState.EntityCounts, e);
  const storageCapacity = (e: string): number =>
    entityStorageCapacity(gameState.EntityStorageCapacityUpgrades, e);
  useInterval(() => {
    // Your custom logic here
    gameState.EntityProducers.forEach((p, k) => {
      for (let i = 0; i < p.ProducerCount; i++) {
        gameDispatch({ producerName: k, type: "Produce" });
      }
    });
  }, 1000);
  useEffect(() => {
    saveStateToLocalStorage(gameState);
  }, [gameState]);

  const recipeSelector = uiState.dialogs.recipeSelectorOpen ? (
    <RecipeSelector
      recipes={[...UnlockedRecipes].filter(
        (r) => !gameState.EntityProducers.has(r)
      )}
      dispatch={dispatch}
    />
  ) : null;

  let cards;
  try {
    cards = gameState.EntityProducers.valueSeq().map((ep) => {
      const r = ep.RecipeName;
      return (
        <Card
          key={r}
          producer={gameState.EntityProducers.get(r)}
          dispatch={dispatch}
          globalEntityCount={entityCount}
          entityStorageCapacity={storageCapacity}
        />
      );
    });
  } finally {
    return (
      <div
        className="App"
        onClick={(evt) => {
          if ((evt.target as Element).classList.contains("clickable")) return;
          dispatch({ type: "CloseDialog", evt });
        }}
      >
        {recipeSelector}
        {cards}
        <div
          className="addProducer clickable"
          onClick={(evt) =>
            dispatch({
              type: "ShowRecipeSelector",
              evt,
            })
          }
        >
          Add Recipe
        </div>
        <p
          className="clickable resetButton"
          onClick={() =>
            dispatch({
              producerName: "",
              type: "Reset",
            })
          }
        >
          Reset
        </p>

        <p>
          <a href="https://github.com/compnski/factorymustgrow">Github</a>
        </p>
      </div>
    );
  }
}

export default App;
