import { AvailableResearchList } from "./availableResearch";
import { GetEntity, GetRecipe } from "./gen/entities";
import { GetResearch } from "./gen/research";
import { ReadonlyFixedInventory } from "./inventory";
import { StackCapacity } from "./movement";
import { producableItemsForInput, productionPerTick } from "./productionUtils";
import { StateVMAction } from "./stateVm";
import { NewEntityStack, Recipe, Research } from "./types";
import { ReadonlyItemBuffer, ReadonlyResearchState } from "./useGameState";

export type Lab = {
  kind: "Lab";
  subkind: "lab";
  RecipeId: string;
  ProducerType: string;
  inputBuffers: ReadonlyItemBuffer;
  outputBuffers: ReadonlyItemBuffer; //ResearchOutput;
  BuildingCount: number;
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

  SetProgress(progress: number): ResearchOutput {
    return new ResearchOutput(this.researchId, progress, this.maxProgress);
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
    if (!researchId) return this.SetResearch(researchId, 0, 0);

    const maxProgress = GetResearch(researchId).ProductionRequiredForCompletion;
    return this.SetResearch(researchId, this.progress + count, maxProgress);
  }

  Remove(): number {
    throw new Error("NYI");
  }
  Add(): number {
    throw new Error("NYI");
  }

  AddFromItemBuffer(): number {
    throw new Error("NYI");
  }

  RemoveItems(): ReadonlyItemBuffer {
    throw new Error("NYI");
  }

  Entities(): [entity: string, count: number][] {
    return [[this.researchId, this.progress]];
  }

  SlotsUsed(): number {
    return this.Entities().length;
  }

  Capacity = 0;
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
  };
}

export function IsResearchComplete(
  researchState: ReadonlyResearchState
): boolean {
  const researchProgress = researchState.Progress.get(
    researchState.CurrentResearchId
  );
  if (researchProgress)
    return researchProgress.Count === researchProgress.MaxCount;
  return false;
}

export function ResearchInLab(
  regionId: string,
  buildingSlot: number,
  l: Lab,
  researchState: ReadonlyResearchState,
  dispatch: (a: StateVMAction) => void,
  GetResearch: (s: string) => Research
): number {
  const currentResearchId = (l.RecipeId = researchState.CurrentResearchId);
  if (!l.RecipeId) {
    dispatch({
      kind: "AddItemCount",
      address: { regionId, buildingSlot, buffer: "output" },
      entity: currentResearchId,
      count: 0,
    });

    return 0;
  }
  const currentResearchProgress =
    researchState.Progress.get(currentResearchId)?.Count || 0;
  const research = GetResearch(l.RecipeId);

  // if (!researchState.Progress.has(currentResearchId))
  //   researchState.Progress.set(
  //     currentResearchId,
  //     NewEntityStack(
  //       currentResearchId,
  //       0,
  //       research.ProductionRequiredForCompletion
  //     )
  //   );
  const currentProgress = researchState.Progress.get(currentResearchId);
  const availableInventorySpace = l.outputBuffers.Accepts(currentResearchId)
    ? l.outputBuffers.AvailableSpace(currentResearchId)
    : GetResearch(currentResearchId).ProductionRequiredForCompletion;

  const maxProduction = productionPerTick(l, research),
    availableInputs = producableItemsForInput(l.inputBuffers, research.Input),
    actualProduction = Math.min(
      maxProduction,
      availableInputs,
      availableInventorySpace
    );

  // console.log(
  //   l.outputBuffers.Accepts(currentResearchId),
  //   GetResearch(currentResearchId).ProductionRequiredForCompletion,
  //   l.outputBuffers.AvailableSpace(currentResearchId)
  // );

  // console.log(maxProduction, availableInputs, availableInventorySpace);
  // console.log("ap", actualProduction);

  if (!actualProduction) return 0;

  for (const input of research.Input) {
    const entity = input.Entity;
    const count = input.Count * actualProduction;

    dispatch({
      kind: "AddItemCount",
      address: { regionId, buildingSlot, buffer: "input" },
      entity,
      count: -count,
    });
  }

  dispatch({
    kind: "SetResearchCount",
    researchId: currentResearchId,
    count: currentResearchProgress + actualProduction,
    maxCount: research.ProductionRequiredForCompletion,
  });

  dispatch({
    kind: "AddItemCount",
    address: { regionId, buildingSlot, buffer: "output" },
    entity: currentResearchId,
    count: actualProduction,
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
]);

// Returns all recipes that can be crafted given the completed research
export function availableRecipes(
  researchState: ReadonlyResearchState,
  filterFunc?: (r: Recipe) => boolean
): string[] {
  const availableRecipesIds: string[] = [...AlwaysUnlockedRecipes];
  researchState.Progress.forEach((stack) => {
    if (stack.Count === stack.MaxCount) {
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
