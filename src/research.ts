import { ProduceWithTracker } from "./AddProgressTracker";
import { AvailableResearchList } from "./availableResearch";
import { ReadonlyItemBuffer, ReadonlyResearchState } from "./factoryGameState";
import { GetEntity, GetRecipe } from "./gen/entities";
import { GetResearch } from "./gen/research";
import { ReadonlyFixedInventory } from "./inventory";
import { StackCapacity } from "./movement";
import { StateVMAction } from "./state/action";
import { BuildingAddress } from "./state/address";
import { NewEntityStack, Recipe, Research } from "./types";

export type Lab = {
  kind: "Lab";
  subkind: "lab";
  RecipeId: string;
  ProducerType: string;
  inputBuffers: ReadonlyItemBuffer;
  outputBuffers: ResearchOutput;
  BuildingCount: number;
  progressTrackers: Readonly<number[]>;
};

// TODO Only show science packs that you have access to
const initialLabInput = [
  { Entity: "automation-science-pack", Count: 0 },
  { Entity: "logistic-science-pack", Count: 0 },
  //  { Entity: "military-science-pack", Count: 0 },
  { Entity: "production-science-pack", Count: 0 },
  { Entity: "chemical-science-pack", Count: 0 },
  { Entity: "utility-science-pack", Count: 0 },
  //  { Entity: "space-science-pack", Count: 0 },
];

export class ResearchOutput implements ReadonlyItemBuffer {
  researchId = "";
  progress = 0;
  maxProgress = 0;

  constructor(researchId = "", progress = 0, maxProgress = 0) {
    this.researchId = researchId;
    this.progress = progress;
    this.maxProgress = maxProgress;
  }

  SetResearch(
    researchId: string,
    progress: number,
    maxProgress: number
  ): ResearchOutput {
    return new ResearchOutput(researchId, progress, maxProgress);
  }

  Accepts(entity: string): boolean {
    return entity === this.researchId;
  }

  // How many of this item can fit
  AvailableSpace(entity: string): number {
    if (!this.Accepts(entity)) return 0;
    return this.maxProgress - this.progress;
  }

  Count(entity: string): number {
    if (!this.Accepts(entity)) return 0;
    return this.progress;
  }

  AddItems(researchId: string, count: number): ReadonlyItemBuffer {
    if (!count) return this.SetResearch(researchId, 0, 0);

    // TODO: Use Set item if added?
    const maxProgress = GetResearch(researchId).ProductionRequiredForCompletion;
    return this.SetResearch(researchId, count, maxProgress);
  }

  Entities(): [entity: string, count: number][] {
    return [[this.researchId, this.progress]];
  }

  SlotsUsed(): number {
    return this.Entities().length;
  }

  Capacity = 1;
}

export function NewLab(initialProduceCount = 0): Lab {
  return {
    kind: "Lab",
    subkind: "lab",
    ProducerType: "Lab",
    outputBuffers: new ResearchOutput(),
    inputBuffers: ReadonlyFixedInventory(
      initialLabInput.map((input) => NewEntityStack(input.Entity, 0, 50))
    ),
    RecipeId: "",
    BuildingCount: initialProduceCount,
    progressTrackers: [],
  };
}

export function IsResearchComplete(
  researchState: ReadonlyResearchState
): boolean {
  const researchProgress = researchState.Progress.get(
    researchState.CurrentResearchId
  );
  if (researchProgress)
    return researchProgress.Count >= (researchProgress.MaxCount || Infinity);
  return false;
}

export function setLabResearch(
  lab: Lab,
  researchId: string,
  progress: number
): Lab {
  const maxProgress = researchId
    ? GetResearch(researchId).ProductionRequiredForCompletion
    : 0;
  return {
    ...lab,
    RecipeId: researchId,
    outputBuffers: (lab.outputBuffers as ResearchOutput).SetResearch(
      researchId,
      progress,
      maxProgress
    ),
  };
}

export function ResearchInLab(
  currentTick: number,
  labAddress: BuildingAddress,
  l: Lab,
  researchState: ReadonlyResearchState,
  dispatch: (a: StateVMAction) => void,
  GetResearch: (s: string) => Research
): number {
  // TODO: Fix. Need to properly set state?

  const currentResearchId = researchState.CurrentResearchId;
  if (!l.RecipeId) {
    if (l.outputBuffers.researchId != "") {
      // TODO: We should clear all progress trackers and refund resources (from previous recipe if possible, but i dont think we know it anymore here)
      dispatch({
        kind: "AddItemCount",
        address: { ...labAddress, buffer: "output" },
        entity: currentResearchId,
        count: 0,
      });
    }
    return 0;
  }
  const currentResearchProgress =
    researchState.Progress.get(currentResearchId)?.Count || 0;
  const research = GetResearch(l.RecipeId);
  // TODO: This should be global, otherwise we overproduce
  const existingProgressTrackerCount = l.progressTrackers.length;
  const remainingResearchProgress = Math.max(
    0,
    research.ProductionRequiredForCompletion -
      currentResearchProgress -
      existingProgressTrackerCount
  );

  const recipe = {
    Input: research.Input,
    Output: [NewEntityStack(research.Id, 1)],
    DurationSeconds: research.DurationSeconds,
  };

  const actualProduction = ProduceWithTracker({
    dispatch,
    currentTick,
    buildingAddress: labAddress,
    recipe,
    building: l,
    maxTriggersAdded: remainingResearchProgress,
  });

  if (!actualProduction && (l.outputBuffers as ResearchOutput).researchId)
    return 0;

  dispatch({
    kind: "AddResearchCount",
    researchId: currentResearchId,
    count: actualProduction,
    maxCount: research.ProductionRequiredForCompletion,
  });

  return actualProduction;
}

// Returns all research that is not completed and unlocked
export function unlockedResearch(
  researchState: ReadonlyResearchState
): string[] {
  const unlockedResearch = new Set();
  researchState.Progress.forEach((stack) => {
    if (StackCapacity(stack) === 0) unlockedResearch.add(stack.Entity);
  });

  const availableResearch: string[] = [];
  for (const research of AvailableResearchList) {
    if (unlockedResearch.has(research.Id)) continue;
    if (
      [...research.Prereqs].filter((x) => !unlockedResearch.has(x)).length === 0
    ) {
      availableResearch.push(research.Id);
    }
  }
  availableResearch.sort((a, b) => GetResearch(a).Row - GetResearch(b).Row);
  return availableResearch;
}

const AlwaysUnlockedRecipes = [
  //  "wood",
  "iron-ore",
  "copper-ore",
  "stone",
  "coal",
  "water",
];

const categoryOrder: { [key: string]: number } = {
  fluids: 0,
  logistics: 1,
  production: 2,
  "intermediate-products": 3,
  combat: 4,
};

const IgnoredRecipies: Set<string> = new Set([
  "refined-concrete",
  "hazard-concrete",
  "refined-hazard-concrete",
  "burner-inserter",
  "long-handed-inserter",
  "fast-transport-belt",
  "fast-splitter",
  "splitter",
  "underground-belt",
  "fast-underground-belt",
  "wooden-chest",
  "steel-chest",
  "roboport",
  "pistol",
  "light-armor",
  "storage-tank",
  "small-electric-pole",
  "pump",
  "pipe-to-ground",
  "repair-pack",
  "empty-barrel",
  "raw-fish",
  "medium-electric-pole",
  "big-electric-pole",
  "rail-chain-signal",
  "firearm-magazine",
  "small-lamp",
  // Powergen
  "boiler",
  "steam-engine",
  "electric-mining-drill",
  "electric-furnace",
  "locomotive",
  "cargo-wagon",
  "steel-furnace",
  "assembling-machine-2",
]);

// Returns all recipes that can be crafted given the completed research
export function availableRecipes(
  researchState: ReadonlyResearchState,
  filterFunc?: (r: Recipe) => boolean
): string[] {
  const availableRecipesIds: string[] = [...AlwaysUnlockedRecipes];
  researchState.Progress.forEach((stack) => {
    if (StackCapacity(stack) === 0) {
      const research = GetResearch(stack.Entity);
      if (research) availableRecipesIds.push(...research.Unlocks);
      else console.log("Missing research entity for ", stack.Entity);
    }
  });
  let availableRecipes = availableRecipesIds
    .filter((r) => !IgnoredRecipies.has(r))
    .map((r) => GetRecipe(r));
  if (filterFunc) availableRecipes = availableRecipes.filter(filterFunc);
  availableRecipes.sort((recipeA, recipeB): number => {
    const entA = GetEntity(recipeA.Output[0].Entity),
      entB = GetEntity(recipeB.Output[0].Entity);
    if (!entA || !entB) {
      console.error("missing entity", !entA && recipeA, !entB && recipeB);
      return 0;
    }
    if (entA.Category !== entB.Category)
      return categoryOrder[entA.Category] - categoryOrder[entB.Category];
    if (entA.Row !== entB.Row) return entA.Row - entB.Row;
    return entA.Col - entB.Col;
  });
  return availableRecipes.map((r) => r.Id);
}

export function availableItems(researchState: ReadonlyResearchState): string[] {
  const availableItems: string[] = [],
    seenItems: Set<string> = new Set();
  availableRecipes(researchState).forEach((r: string) => {
    const recipe = GetRecipe(r);
    if (recipe) {
      recipe.Output.forEach((x) => {
        if (!seenItems.has(x.Entity)) {
          availableItems.push(x.Entity);
          seenItems.add(x.Entity);
        }
      });
    }
  });
  return availableItems;
}
