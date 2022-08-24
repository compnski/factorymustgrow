import { useEffect, useState } from "react";
import { Recipes } from "../../gen/entities";
import { ReadonlyFixedInventory } from "../../inventory";
import { EntityStack, MergeEntityStacks, Recipe } from "../../types";
import { InventoryDisplay } from "../InventoryDisplay";

function canProduce(
  {
    Input,
    Output,
  }: {
    Input: EntityStack[];
    Output: EntityStack[];
  },
  availableItems: Set<string>
) {
  return (
    (Input.length && Output.length && Input[0].Entity == Output[0].Entity) ||
    Input.every(({ Entity }) => availableItems.has(Entity))
  );
}

const iterationByItem: Record<string, number> = {};
const iterationByRecipe: Record<string, number> = {};
const rawCostByItem: Record<string, EntityStack[]> = {};
const rawCostByRecipe: Record<string, EntityStack[]> = {};

function calcRawCost(
  { Input }: { Input: EntityStack[]; DurationSeconds: number },
  costByItem: Record<string, EntityStack[]>
) {
  return MergeEntityStacks(
    ...Input.map((stack) => {
      const cost = costByItem[stack.Entity];
      if (!cost) return stack;
      return cost.map<EntityStack>(({ Entity, Count, MaxCount }) => ({
        Entity,
        Count: Count * stack.Count,
        MaxCount,
      }));
    })
      .flat()
      .sort(({ Entity: a }, { Entity: b }) => a.localeCompare(b))
  );
}

function initItemMaps() {
  let remainingRecipies = [...Recipes.values()];
  console.log("init item maps");
  for (
    let iteration = 0;
    remainingRecipies.length > 0 && iteration < 100;
    iteration++
  ) {
    const availableItems = new Set(Object.keys(iterationByItem));
    remainingRecipies = remainingRecipies.filter((r) => {
      if (canProduce(r, availableItems)) {
        const rawCost = calcRawCost(r, rawCostByItem);
        iterationByRecipe[r.Id] = iteration;
        rawCostByRecipe[r.Id] = rawCost;
        r.Output.forEach(({ Entity }) => {
          iterationByItem[Entity] = iteration;
          rawCostByItem[Entity] = rawCost;
        });
        return false;
      }
      return true;
    });
  }
}
initItemMaps();

function topoSortRecipes(recipes: Recipe[]) {
  // Topological recipe sort
  // Start by finding bases, recipes that have same input + output.
  // Then find anything you can produce with unlocked recipes.
  // repeated, each time note the iteration, that is the sort index

  const r = recipes.slice();
  r.sort(({ Id: a }, { Id: b }) => {
    const iterA = iterationByRecipe[a],
      iterB = iterationByRecipe[b];
    if (isNaN(iterA)) return 1;
    if (isNaN(iterB)) return -1;

    return iterA - iterB;
  });
  return r;
}

function toRawResources(recipe: Recipe): EntityStack[] {
  return calcRawCost(recipe, rawCostByItem);
}

export function ItemTable() {
  const [sortedRecipes, setSortedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const r = topoSortRecipes(
      [...Recipes.values()].filter(({ Id }) => !Id.startsWith("test-"))
    );
    setSortedRecipes(r);
  }, []);
  const [intervalSec, setIntervalSec] = useState(60);

  function recipeRows() {
    return [
      sortedRecipes.map((recipe) => (
        <tr key={recipe.Id}>
          <td>
            <span className={`icon ${recipe.Icon}`}></span>
          </td>
          <td>
            <span>{recipe.Id}</span>
          </td>
          <td className="text-left">{recipe.DurationSeconds}s</td>
          <td>
            <InventoryDisplay
              infiniteStackSize={true}
              inventory={ReadonlyFixedInventory(
                scaleForProduction(
                  recipe.Input,
                  recipe.DurationSeconds,
                  intervalSec
                )
              )}
            />
          </td>
          <td>
            <InventoryDisplay
              infiniteStackSize={true}
              inventory={ReadonlyFixedInventory(
                scaleForProduction(
                  toRawResources(recipe),
                  recipe.DurationSeconds,
                  intervalSec
                )
              )}
            />
          </td>
          <td>
            <InventoryDisplay
              infiniteStackSize={true}
              inventory={ReadonlyFixedInventory(
                scaleForProduction(
                  recipe.Output,
                  recipe.DurationSeconds,
                  intervalSec
                )
              )}
            />
          </td>
        </tr>
      )),
    ];
  }

  return (
    <div className="bg-slate-400 ">
      Interval:{" "}
      <input
        type="text "
        value={intervalSec || 0}
        className="w-12 text-right pr-2"
        onChange={(evt) => setIntervalSec(parseInt(evt.target.value))}
      />
      <table className="table-auto border-spacing-2 border-separate">
        <thead>
          <tr>
            <th></th>
            <th className="text-left">Item</th>
            <th>🕓</th>
            <th className="text-left">Input</th>
            <th className="text-left">Raw Input</th>
            <th className="text-left">Output/min</th>
          </tr>
        </thead>
        <tbody>{recipeRows()}</tbody>
      </table>
    </div>
  );
}

function scaleForProduction(
  Output: EntityStack[],
  DurationSeconds: number,
  interval: number
): EntityStack[] {
  return Output.map(({ Entity, Count }) => ({
    Entity,
    Count: (Count * interval) / DurationSeconds,
  }));
}
