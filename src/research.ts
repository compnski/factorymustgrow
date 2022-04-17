import { AvailableResearchList } from "./availableResearch";
import { GetEntity, GetRecipe } from "./gen/entities";
import { GetResearch } from "./gen/research";
import { FixedInventory } from "./inventory";
import { StackCapacity } from "./movement";
import { producableItemsForInput, productionPerTick } from "./productionUtils";
import {
  ItemBuffer,
  NewEntityStack,
  OutputStatus,
  Recipe,
  Research,
} from "./types";
import { ResearchState } from "./state/FactoryGameState";

export type Lab = {
  kind: "Lab";
  subkind: "lab";
  RecipeId: string;
  ProducerType: string;
  inputBuffers: ItemBuffer;
  outputBuffers: ResearchOutput;
  BuildingCount: number;
  outputStatus: OutputStatus;
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

export class ResearchOutput implements ItemBuffer {
  researchId = "";
  progress = 0;
  maxProgress = 0;

  constructor(researchId = "", progress = 0, maxProgress = 0) {
    this.SetResearch(researchId, progress, maxProgress);
  }

  SetProgress(progress: number) {
    this.progress = progress;
  }

  SetResearch(researchId: string, progress: number, maxProgress: number) {
    this.researchId = researchId;
    this.progress = progress;
    this.maxProgress = maxProgress;
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

  Add(): number {
    throw new Error("NYI");
  }

  AddFromItemBuffer(): number {
    throw new Error("NYI");
  }

  Remove(): number {
    throw new Error("NYI");
  }

  Entities(): [entity: string, count: number][] {
    return [[this.researchId, this.progress]];
  }

  Slots(): [entity: string, count: number][] {
    return this.Entities();
  }

  Capacity = 0;
}

export function NewLab(initialProduceCount = 0): Lab {
  return {
    kind: "Lab",
    subkind: "lab",
    ProducerType: "Lab",
    outputBuffers: new ResearchOutput(),
    inputBuffers: FixedInventory(
      initialLabInput.map((input) => NewEntityStack(input.Entity, 0, 50))
    ),
    outputStatus: { beltConnections: [] },
    RecipeId: "",
    BuildingCount: initialProduceCount,
  };
}

export function IsResearchComplete(researchState: ResearchState): boolean {
  const researchProgress = researchState.Progress.get(
    researchState.CurrentResearchId
  );
  if (researchProgress)
    return researchProgress.Count === researchProgress.MaxCount;
  return false;
}

export function ResearchInLab(
  l: Lab,
  researchState: ResearchState,
  GetResearch: (s: string) => Research | undefined
): number {
  const currentResearchId = (l.RecipeId = researchState.CurrentResearchId);
  const research = GetResearch(l.RecipeId);
  if (!research) {
    l.outputBuffers.SetResearch("", 0, 0);
    return 0;
  }
  if (!researchState.Progress.has(currentResearchId))
    researchState.Progress.set(
      currentResearchId,
      NewEntityStack(
        currentResearchId,
        0,
        research.ProductionRequiredForCompletion
      )
    );
  const currentProgress = researchState.Progress.get(currentResearchId);
  l.outputBuffers.SetResearch(
    currentResearchId,
    currentProgress?.Count || 0,
    research.ProductionRequiredForCompletion
  );

  const maxProduction = productionPerTick(l, research),
    availableInputs = producableItemsForInput(l.inputBuffers, research.Input),
    availableInventorySpace = l.outputBuffers.AvailableSpace(currentResearchId),
    actualProduction = Math.min(
      maxProduction,
      availableInputs,
      availableInventorySpace
    );
  for (const input of research.Input) {
    const removed = l.inputBuffers.Remove(
      NewEntityStack(input.Entity, 0, Infinity),
      input.Count * actualProduction,
      false
    );
    if (removed !== input.Count * actualProduction) {
      console.error(l.inputBuffers.Entities());
      throw new Error(
        `Produced without enough input. Missing ${removed} ${input.Entity}`
      );
    }
  }
  if (currentProgress) {
    currentProgress.Count += actualProduction;
  }
  l.outputBuffers.SetProgress(currentProgress?.Count || 0);

  return actualProduction;
}

// Returns all research that is not completed and unlocked
export function unlockedResearch(researchState: ResearchState): string[] {
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
  researchState: ResearchState,
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

export function availableItems(researchState: ResearchState): string[] {
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
