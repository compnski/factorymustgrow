import { GameDispatch, GameState } from "../factoryGame";
import { GetRecipe } from "../gen/entities";
import { IconSelectorConfig } from "../IconSelectorProvider";
import {
  availableItems,
  availableRecipes,
  availableResearch,
} from "../research";
import { entityIconLookupByKind } from "../utils";

export async function showResearchSelector(
  selectRecipe: (c: IconSelectorConfig) => Promise<string | false>
): Promise<void> {
  const recipe = await selectRecipe({
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

export async function showAddProducerSelector(
  selectRecipe: (c: IconSelectorConfig) => Promise<string | false>
): Promise<void> {
  const recipe = await selectRecipe({
    title: "Choose Recipe",
    recipes: availableRecipes(GameState.Research),
  });
  if (recipe) GameDispatch({ type: "NewProducer", producerName: recipe });
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
