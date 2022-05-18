import {
  ReadonlyItemBuffer,
  ReadonlyRegion,
  ReadonlyResearchState,
} from "../factoryGameState";
import { GameAction } from "../GameAction";
import { GetRecipe } from "../gen/entities";
import { GeneralDialogConfig } from "../GeneralDialogProvider";
import { ImmutableMap } from "../immutable";
import { IsBuilding } from "../production";
import { availableRecipes } from "../research";
import { HelpCard } from "./HelpCard";
import { PlaceTruckLinePanel } from "./PlaceTruckLinePanel";
import { RecipeSelector } from "./RecipeSelector";
import { RegionSelector } from "./RegionSelector";
import { SaveCard } from "./SaveCard";
import { SelectResearchPanel } from "./SelectResearchPanel";
import { SettingsCard } from "./SettingsCard";

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
  uxDispatch: (a: GameAction) => void,
  direction: "TransferToInventory" | "TransferFromInventory",
  items: string[],
  regionId?: string,
  buildingIdx?: number
  //filter?: (entity: string) => boolean
): Promise<void> {
  const recipe = await showIconSelector(showDialog, "Add Stack", items);

  if (recipe)
    uxDispatch(
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
  uxDispatch: (a: GameAction) => void,
  regionId: string,
  items: string[]
): Promise<void> {
  const item = await showIconSelector(showDialog, "Add Bus Lane", items);
  if (item)
    uxDispatch({
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
  uxDispatch: (a: GameAction) => void,
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
    uxDispatch({ type: "ChangeRecipe", buildingIdx, regionId, recipeId });
}

export async function showPlaceBuildingSelector(
  showDialog: (c: GeneralDialogConfig) => Promise<string[] | false>,
  uxDispatch: (a: GameAction) => void,
  inventory: ReadonlyItemBuffer,
  regionId: string,
  buildingIdx: number,
  regions: ImmutableMap<string, ReadonlyRegion>
) {
  const item = await showIconSelector(showDialog, "Choose Building", [
    ...new Set(
      inventory
        .Entities()
        .map((s) => s[0])
        .filter((e) => IsBuilding(e))
    ),
  ]);

  if (item === "concrete") {
    await showPlaceTruckLineSelector(
      showDialog,
      uxDispatch,
      inventory,
      regions,
      regionId,
      buildingIdx
    );
  } else if (item)
    uxDispatch({
      type: "PlaceBuilding",
      entity: item,
      buildingIdx,
      regionId,
    });
  return item;
}

export async function showResearchSelector(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showDialog: (c: GeneralDialogConfig) => Promise<any[] | false>,
  uxDispatch: (a: GameAction) => void,
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
    if (recipe) uxDispatch({ type: "ChangeResearch", producerName: recipe });
  }
}

export async function showPlaceTruckLineSelector(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showDialog: (c: GeneralDialogConfig) => Promise<any[] | false>,
  uxDispatch: (a: GameAction) => void,
  inventory: ReadonlyItemBuffer,
  regions: ImmutableMap<string, ReadonlyRegion>,
  regionId: string,
  buildingIdx: number
) {
  const result = await showDialog({
    title: "Place Belt Line",
    component: (onConfirm) => (
      <PlaceTruckLinePanel
        title="Place Belt Line"
        inventory={inventory}
        regions={regions}
        onConfirm={onConfirm}
      />
    ),
  });
  if (result) {
    const [targetRegion, beltType, beltLength] = result;
    if (targetRegion && beltType)
      uxDispatch({
        type: "PlaceTruckLine",
        targetRegion,
        entity: beltType,
        beltLength,
        regionId,
        buildingIdx,
      });
  }
}

export async function showClaimRegionSelector(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showDialog: (c: GeneralDialogConfig) => Promise<any[] | false>,
  uxDispatch: (a: GameAction) => void,
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
    if (regionId) uxDispatch({ type: "ClaimRegion", regionId });
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

export async function showSaveCard(
  showDialog: (c: GeneralDialogConfig) => Promise<string[] | false>
): Promise<void> {
  const stateToLoad = await showDialog({
    title: "Save",
    component: (onConfirm) => <SaveCard onConfirm={onConfirm} />,
  });
  if (!stateToLoad) return;
  console.log("Loading ", stateToLoad);
}

export async function showSettingCard(
  showDialog: (c: GeneralDialogConfig) => Promise<any[] | false>
): Promise<void> {
  await showDialog({
    title: "Setting",
    component: (onConfirm) => <SettingsCard onConfirm={onConfirm} />,
  });
}
