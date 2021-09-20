import { GameDispatch } from "../factoryGame";
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

export async function showDebugAddItemSelector(
  selectRecipe: (c: IconSelectorConfig) => Promise<string | false>
): Promise<void> {
  const recipe = await selectRecipe({
    title: "Add Stack",
    recipes: availableItems(GameState.Research),
  });
  if (recipe)
    GameDispatch({
      type: "TransferToInventory",
      otherStackKind: "Void",
      entity: recipe,
    });
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
