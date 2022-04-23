import { GameDispatch } from "../GameDispatch";
import { GetRecipe } from "../gen/entities";
import { GeneralDialogConfig } from "../GeneralDialogProvider";
import { IsBuilding } from "../production";
import { availableRecipes } from "../research";
import { Region } from "../types";
import {
  GameState,
  ReadonlyItemBuffer,
  ReadonlyResearchState,
} from "../useGameState";
import { HelpCard } from "./HelpCard";
import { PlaceBeltLinePanel } from "./PlaceBeltLinePanel";
import { RecipeSelector } from "./RecipeSelector";
import { RegionSelector } from "./RegionSelector";
import { SelectResearchPanel } from "./SelectResearchPanel";

async function showIconSelector(
  showDialog: (c: GeneralDialogConfig) => Promise<string[] | false>,
  title: string,
  recipes: { map(f: (r: string) => string): unknown },
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
  items: string[],
  regionId?: string,
  buildingIdx?: number
  //filter?: (entity: string) => boolean
): Promise<void> {
  const recipe = await showIconSelector(showDialog, "Add Stack", items);

  if (recipe)
    GameDispatch(
      buildingIdx === undefined || regionId === undefined
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
            regionId,
          }
    );
}

export async function showAddLaneItemSelector(
  showDialog: (c: GeneralDialogConfig) => Promise<string[] | false>,
  regionId: string,
  items: string[]
): Promise<void> {
  const item = await showIconSelector(showDialog, "Add Bus Lane", items);
  if (item)
    GameDispatch({
      type: "AddLane",
      entity: item,
      regionId,
    });
}

export async function showChangeProducerRecipeSelector(
  producerType: string,
  regionId: string,
  buildingIdx: number,
  showDialog: (c: GeneralDialogConfig) => Promise<string[] | false>,
  researchState: ReadonlyResearchState
): Promise<void> {
  const recipeId = await showIconSelector(
    showDialog,
    "Choose Recipe",
    availableRecipes(researchState).filter(function filterRecipes(
      recipeId: string
    ): boolean {
      const r = GetRecipe(recipeId);
      return r.ProducerType === producerType;
    })
  );
  if (recipeId)
    GameDispatch({ type: "ChangeRecipe", buildingIdx, regionId, recipeId });
}

export async function showPlaceBuildingSelector(
  showDialog: (c: GeneralDialogConfig) => Promise<string[] | false>,
  inventory: ReadonlyItemBuffer,
  regionId: string,
  buildingIdx?: number
) {
  const item = await showIconSelector(showDialog, "Choose Building", [
    ...new Set(
      inventory
        .Entities()
        .map((s) => s[0])
        .filter((e) => IsBuilding(e))
    ),
  ]);

  if (item === "transport-belt") {
    await showPlaceBeltLineSelector(
      showDialog,
      inventory,
      GameState.Regions,
      regionId,
      buildingIdx
    );
  } else if (item)
    GameDispatch({
      type: "PlaceBuilding",
      entity: item,
      buildingIdx,
      regionId,
    });
}

export async function showResearchSelector(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showDialog: (c: GeneralDialogConfig) => Promise<any[] | false>,
  researchState: ReadonlyResearchState
): Promise<void> {
  const result = await showDialog({
    title: "Choose Research",
    component: (onConfirm) => (
      <SelectResearchPanel
        onConfirm={onConfirm}
        researchState={researchState}
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showDialog: (c: GeneralDialogConfig) => Promise<any[] | false>,
  inventory: ReadonlyItemBuffer,
  regions: Map<string, Region>,
  regionId: string,
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
      regionId,
      buildingIdx,
    });
  }
}

export async function showClaimRegionSelector(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showDialog: (c: GeneralDialogConfig) => Promise<any[] | false>,
  inventory: ReadonlyItemBuffer,
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
