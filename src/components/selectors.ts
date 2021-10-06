import { GameDispatch } from "../GameDispatch";
import { GameState } from "../useGameState";
import { GetRecipe } from "../gen/entities";
import { IconSelectorConfig } from "../IconSelectorProvider";
import { Inventory } from "../inventory";
import {
  availableItems,
  availableRecipes,
  availableResearch,
} from "../research";
import { entityIconLookupByKind } from "../utils";
import { IsBuilding } from "../production";
import { GeneralDialogConfig } from "../GeneralDialogProvider";
import { ItemBuffer } from "../types";

export async function showResearchSelector(
  showIconSelector: (c: IconSelectorConfig) => Promise<string | false>
): Promise<void> {
  const recipe = await showIconSelector({
    title: "Choose Research",
    recipes: availableResearch(GameState.Research),
    entityIconLookup: entityIconLookupByKind("Lab"),
  });
  if (recipe) GameDispatch({ type: "ChangeResearch", producerName: recipe });
}

export async function showMoveItemToFromInventorySelector(
  selectIcon: (c: IconSelectorConfig) => Promise<string | false>,
  direction: "TransferToInventory" | "TransferFromInventory",
  buildingIdx?: number,
  filter?: (entity: string) => boolean
): Promise<void> {
  if (!filter && direction === "TransferFromInventory")
    filter = (e) => GameState.Inventory.Count(e) > 0;
  var recipes = availableItems(GameState.Research);
  if (filter) recipes = recipes.filter(filter);
  const recipe = await selectIcon({
    title: "Add Stack",
    recipes: recipes,
  });
  console.log(recipe);
  if (recipe)
    GameDispatch(
      buildingIdx === undefined
        ? {
            type: direction,
            entity: recipe,
            otherStackKind: "Void",
          }
        : {
            type: direction,
            entity: recipe,
            otherStackKind: "Building",
            buildingIdx: buildingIdx,
          }
    );
}

export async function showAddLaneItemSelector(
  selectRecipe: (c: IconSelectorConfig) => Promise<string | false>
): Promise<void> {
  const item = await selectRecipe({
    title: "Add Bus Lane",
    recipes: availableItems(GameState.Research),
  });
  if (item)
    GameDispatch({
      type: "AddLane",
      entity: item,
    });
}

export async function showChangeProducerRecipeSelector(
  producerType: string,
  buildingIdx: number,
  selectRecipe: (c: IconSelectorConfig) => Promise<string | false>
): Promise<void> {
  const recipeId = await selectRecipe({
    title: "Choose Recipe",
    recipes: availableRecipes(GameState.Research).filter(function filterRecipes(
      recipeId: string
    ): boolean {
      const r = GetRecipe(recipeId);
      return r.ProducerType === producerType;
    }),
  });
  if (recipeId) GameDispatch({ type: "ChangeRecipe", buildingIdx, recipeId });
}

export async function showPlaceBuildingSelector(
  selectRecipe: (c: IconSelectorConfig) => Promise<string | false>,
  inventory: Inventory
) {
  const item = await selectRecipe({
    title: "Place Building",
    recipes: [
      ...new Set(
        inventory
          .Slots()
          .map((s) => s[0])
          .filter((e) => IsBuilding(e))
      ),
    ],
  });
  if (item)
    GameDispatch({
      type: "PlaceBuilding",
      entity: item,
    });
}
