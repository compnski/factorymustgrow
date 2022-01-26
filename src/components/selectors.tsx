import { GameDispatch } from "../GameDispatch";
import { GameState } from "../useGameState";
import { GetRecipe } from "../gen/entities";
import { Inventory } from "../inventory";
import { availableItems, availableRecipes } from "../research";
import { IsBuilding } from "../production";
import { RecipeSelector } from "./RecipeSelector";
import { PlaceBeltLinePanel } from "./PlaceBeltLinePanel";
import { GeneralDialogConfig } from "../GeneralDialogProvider";
import { Region } from "../types";
import { SelectResearchPanel } from "./SelectResearchPanel";
import { RegionSelector } from "./RegionSelector";
import { HelpCard } from "./HelpCard";

async function showIconSelector(
  showDialog: (c: GeneralDialogConfig) => Promise<string[] | false>,
  title: string,
  recipes: { map(f: (r: string) => any): any },
  entityIconLookup?: (entity: string) => string
): Promise<string> {
  const results = await showDialog({
    title: title,
    component: (onConfirm) => (
      <RecipeSelector
        title={title}
        recipes={recipes}
        entityIconLookup={entityIconLookup}
        onConfirm={onConfirm}
      />
    ),
  });
  if (results) {
    const [recipe] = results;
    return recipe;
  }
  return "";
}

export async function showMoveItemToFromInventorySelector(
  showDialog: (c: GeneralDialogConfig) => Promise<string[] | false>,
  direction: "TransferToInventory" | "TransferFromInventory",
  buildingIdx?: number,
  filter?: (entity: string) => boolean
): Promise<void> {
  if (!filter && direction === "TransferFromInventory")
    filter = (e) => GameState.Inventory.Count(e) > 0;
  var items = availableItems(GameState.Research);
  if (filter) items = items.filter(filter);
  const recipe = await showIconSelector(showDialog, "Add Stack", items);

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
  showDialog: (c: GeneralDialogConfig) => Promise<string[] | false>
): Promise<void> {
  const item = await showIconSelector(
    showDialog,
    "Add Bus Lane",
    availableItems(GameState.Research)
  );
  if (item)
    GameDispatch({
      type: "AddLane",
      entity: item,
    });
}

export async function showChangeProducerRecipeSelector(
  producerType: string,
  buildingIdx: number,
  showDialog: (c: GeneralDialogConfig) => Promise<string[] | false>
): Promise<void> {
  const recipeId = await showIconSelector(
    showDialog,
    "Choose Recipe",
    availableRecipes(GameState.Research).filter(function filterRecipes(
      recipeId: string
    ): boolean {
      const r = GetRecipe(recipeId);
      return r.ProducerType === producerType;
    })
  );
  if (recipeId) GameDispatch({ type: "ChangeRecipe", buildingIdx, recipeId });
}

export async function showPlaceBuildingSelector(
  showDialog: (c: GeneralDialogConfig) => Promise<string[] | false>,
  inventory: Inventory,
  buildingIdx?: number
) {
  const item = await showIconSelector(showDialog, "Choose Building", [
    ...new Set(
      inventory
        .Slots()
        .map((s) => s[0])
        .filter((e) => IsBuilding(e))
    ),
  ]);

  if (item === "transport-belt") {
    showPlaceBeltLineSelector(
      showDialog,
      inventory,
      GameState.Regions,
      buildingIdx
    );
  } else if (item)
    GameDispatch({
      type: "PlaceBuilding",
      entity: item,
      buildingIdx,
    });
}

export async function showResearchSelector(
  showDialog: (c: GeneralDialogConfig) => Promise<any[] | false>
): Promise<void> {
  const result = await showDialog({
    title: "Choose Research",
    component: (onConfirm) => (
      <SelectResearchPanel
        onConfirm={onConfirm}
        researchState={GameState.Research}
      />
    ),
  });
  if (result) {
    const [recipe] = result;
    console.log("research ", recipe);
    if (recipe) GameDispatch({ type: "ChangeResearch", producerName: recipe });
  }
}

export async function showPlaceBeltLineSelector(
  showDialog: (c: GeneralDialogConfig) => Promise<any[] | false>,
  inventory: Inventory,
  regions: Map<string, Region>,
  buildingIdx?: number
) {
  const result = await showDialog({
    title: "Place Belt Line",
    component: (onConfirm) => (
      <PlaceBeltLinePanel
        title="Place Belt Line"
        inventory={inventory}
        regions={regions}
        onConfirm={onConfirm}
      />
    ),
  });
  if (result) {
    const [targetRegion, beltType] = result;
    GameDispatch({
      type: "PlaceBeltLine",
      targetRegion,
      entity: beltType,
      beltLength: 100,
      buildingIdx,
    });
  }
}

export async function showClaimRegionSelector(
  showDialog: (c: GeneralDialogConfig) => Promise<any[] | false>,
  inventory: Inventory,
  regionIds: string[]
): Promise<void> {
  const result = await showDialog({
    title: "Claim Region",
    component: (onConfirm) => (
      <RegionSelector
        inventory={inventory}
        regionIds={regionIds}
        onConfirm={onConfirm}
      />
    ),
  });
  if (result) {
    const [regionId] = result;
    console.log("claim region ", regionId);
    if (regionId) GameDispatch({ type: "ClaimRegion", regionId });
  }
}

export async function showHelpCard(
  showDialog: (c: GeneralDialogConfig) => Promise<string[] | false>
): Promise<void> {
  await showDialog({
    title: "Help",
    component: (onConfirm) => <HelpCard onConfirm={onConfirm} />,
  });
}
