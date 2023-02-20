import {
  ReadonlyItemBuffer,
  ReadonlyRegion,
  ReadonlyResearchState,
} from "../factoryGameState";
import { GameAction } from "../GameAction";
import { GetRecipe } from "../gen/entities";
import { GeneralDialogConfig } from "../GeneralDialogProvider";
import { ImmutableMap } from "../immutable";
import { deserializeGameState } from "../localstorage";
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
  showDialog: (c: GeneralDialogConfig) => Promise<{
    returnData: string[] | false;
    uxDispatch: (a: GameAction) => void;
  }>,
  title: string,
  recipes: { map(f: (r: string) => string): unknown },
  entityIconLookup?: (entity: string) => string
): Promise<{ selected: string; uxDispatch: (a: GameAction) => void }> {
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
  if (results.returnData) {
    const {
      returnData: [recipe],
      uxDispatch,
    } = results;
    return { selected: recipe, uxDispatch };
  }
  return { selected: "", uxDispatch: results.uxDispatch };
}

export async function showMoveItemToFromInventorySelector(
  showDialog: (c: GeneralDialogConfig) => Promise<{
    returnData: string[] | false;
    uxDispatch: (a: GameAction) => void;
  }>,
  direction: "TransferToInventory" | "TransferFromInventory",
  items: string[],
  regionId?: string,
  buildingIdx?: number
  //filter?: (entity: string) => boolean
): Promise<void> {
  const { selected, uxDispatch } = await showIconSelector(
    showDialog,
    "Add Stack",
    items
  );

  if (selected)
    uxDispatch(
      buildingIdx === undefined || regionId === undefined
        ? {
            type: direction,
            entity: selected,
            otherStackKind: "Void",
          }
        : {
            type: direction,
            entity: selected,
            otherStackKind: "Building",
            buildingIdx: buildingIdx,
            regionId,
          }
    );
}

export async function showSetLaneEntitySelector(
  showDialog: (c: GeneralDialogConfig) => Promise<{
    returnData: string[] | false;
    uxDispatch: (a: GameAction) => void;
  }>,
  regionId: string,
  laneId: number,
  upperSlotIdx: number,
  items: string[]
): Promise<void> {
  const { selected: item, uxDispatch } = await showIconSelector(
    showDialog,
    "Choose Item Filter",
    items
  );
  if (item && item != "") {
    uxDispatch({
      type: "SetLaneEntity",
      entity: item,
      laneId,
      upperSlotIdx,
      regionId,
    });
  }
}

export async function showChangeProducerRecipeSelector(
  producerType: string,
  regionId: string,
  buildingIdx: number,
  showDialog: (c: GeneralDialogConfig) => Promise<{
    returnData: string[] | false;
    uxDispatch: (a: GameAction) => void;
  }>,
  researchState: ReadonlyResearchState
): Promise<void> {
  const { selected: recipeId, uxDispatch } = await showIconSelector(
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
  showDialog: (c: GeneralDialogConfig) => Promise<{
    returnData: string[] | false;
    uxDispatch: (a: GameAction) => void;
  }>,
  inventory: ReadonlyItemBuffer,
  regionId: string,
  buildingIdx: number,
  regions: ImmutableMap<string, ReadonlyRegion>
) {
  const { selected: item, uxDispatch } = await showIconSelector(
    showDialog,
    "Choose Building",
    [
      ...new Set(
        inventory
          .Entities()
          .map((s) => s[0])
          .filter((e) => IsBuilding(e))
      ),
    ]
  );

  if (item === "concrete") {
    await showPlaceTruckLineSelector(
      showDialog,
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
  showDialog: (c: GeneralDialogConfig) => Promise<{
    returnData: string[] | false;
    uxDispatch: (a: GameAction) => void;
  }>,
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
  if (result.returnData) {
    const {
      returnData: [recipe],
      uxDispatch,
    } = result;
    console.log("research ", recipe);
    if (recipe) uxDispatch({ type: "ChangeResearch", producerName: recipe });
  }
}

export async function showPlaceTruckLineSelector(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showDialog: (c: GeneralDialogConfig) => Promise<{
    returnData: string[] | false;
    uxDispatch: (a: GameAction) => void;
  }>,
  inventory: ReadonlyItemBuffer,
  regions: ImmutableMap<string, ReadonlyRegion>,
  regionId: string,
  buildingIdx: number
) {
  const result = await showDialog({
    title: "Ship resources to another region",
    component: (onConfirm) => (
      <PlaceTruckLinePanel
        title="Ship resources to another region"
        inventory={inventory}
        regions={regions}
        onConfirm={onConfirm}
      />
    ),
  });
  if (result.returnData) {
    const {
      returnData: [targetRegion, beltType, beltLength],
      uxDispatch,
    } = result;
    if (targetRegion && beltType)
      uxDispatch({
        type: "PlaceTruckLine",
        targetRegion,
        entity: beltType as "concrete",
        beltLength: beltLength as unknown as number,
        regionId,
        buildingIdx,
      });
  }
}

export async function showClaimRegionSelector(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showDialog: (c: GeneralDialogConfig) => Promise<{
    returnData: string[] | false;
    uxDispatch: (a: GameAction) => void;
  }>,
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
  if (result.returnData) {
    const {
      returnData: [regionId],
      uxDispatch,
    } = result;
    console.log("claim region ", regionId);
    if (regionId) uxDispatch({ type: "ClaimRegion", regionId });
  }
}

export async function showHelpCard(
  showDialog: (c: GeneralDialogConfig) => Promise<{
    returnData: string[] | false;
    uxDispatch: (a: GameAction) => void;
  }>
): Promise<void> {
  await showDialog({
    title: "Help",
    component: (onConfirm) => <HelpCard onConfirm={onConfirm} />,
  });
}

export async function showSaveCard(
  showDialog: (c: GeneralDialogConfig) => Promise<{
    returnData: string[] | false;
    uxDispatch: (a: GameAction) => void;
  }>
): Promise<void> {
  const { returnData: stateToLoad, uxDispatch } = await showDialog({
    title: "Save",
    component: (onConfirm) => (
      <SaveCard onConfirm={onConfirm} showSaveButton={true} />
    ),
  });
  if (!stateToLoad || !stateToLoad[0]) return;
  console.log("Loading ", stateToLoad);
  uxDispatch({
    type: "ResetTo",
    state: deserializeGameState(stateToLoad[0]),
  });
}

export async function showSettingCard(
  showDialog: (c: GeneralDialogConfig) => Promise<{
    returnData: string[] | false;
    uxDispatch: (a: GameAction) => void;
  }>
): Promise<void> {
  await showDialog({
    title: "Setting",
    component: (onConfirm) => <SettingsCard onConfirm={onConfirm} />,
  });
}
