import { TicksPerSecond } from "./constants";
import { ResearchState } from "./useGameState";
import { GetEntity, GetRecipe } from "./gen/entities";
import { GetResearch, ResearchMap } from "./gen/research";
import {
  EntityStack,
  NewEntityStack,
  OutputStatus,
  Producer,
  Recipe,
  Research,
} from "./types";

export type Lab = {
  kind: "Lab";
  subkind: "lab";
  RecipeId: string;
  ProducerType: string;
  inputBuffers: Map<string, EntityStack>;
  outputBuffers: Map<string, EntityStack>;
  ProducerCount: number;
  outputStatus: OutputStatus;
};

// TODO Only show science packs that you have access to
const initialLabInput = [
  { Entity: "automation-science-pack", Count: 0 },
  { Entity: "logistic-science-pack", Count: 0 },
  { Entity: "military-science-pack", Count: 0 },
  { Entity: "production-science-pack", Count: 0 },
  { Entity: "chemical-science-pack", Count: 0 },
  { Entity: "utility-science-pack", Count: 0 },
  //  { Entity: "space-science-pack", Count: 0 },
];

export function NewLab(initialProduceCount: number = 0): Lab {
  return {
    kind: "Lab",
    subkind: "lab",
    ProducerType: "Lab",
    outputBuffers: new Map(),
    inputBuffers: new Map(
      initialLabInput.map((input) => [
        input.Entity,
        NewEntityStack(input.Entity, 0, 50),
      ])
    ),
    outputStatus: { above: "NONE", below: "NONE", beltConnections: [] },
    RecipeId: "",
    ProducerCount: initialProduceCount,
  };
}

function productionPerTick(p: Producer, r: Research): number {
  return (p.ProducerCount * r.ProductionPerTick) / TicksPerSecond;
}

// Requires at least Input items to produce anything
function producableItemsForInput(
  inputBuffers: Map<string, EntityStack>,
  recipeInputs: EntityStack[]
): number {
  return Math.min(
    ...recipeInputs.map(({ Entity, Count }) =>
      Math.floor((inputBuffers.get(Entity)?.Count || 0) / Count)
    )
  );
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
    l.outputBuffers = new Map();
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
  if (
    l.outputBuffers.size > 1 ||
    (l.outputBuffers.size > 0 && !l.outputBuffers.has(currentResearchId))
  ) {
    l.outputBuffers.clear();
  }
  if (currentProgress) l.outputBuffers.set(currentResearchId, currentProgress);

  const maxProduction = productionPerTick(l, research),
    availableInputs = producableItemsForInput(l.inputBuffers, research.Input),
    availableInventorySpace = [...l.outputBuffers.values()].reduce(
      (accum, entityStack) => {
        const outputStack = l.outputBuffers.get(entityStack.Entity);
        return Math.min(
          accum,
          (outputStack?.MaxCount || Infinity) - (outputStack?.Count || 0)
        );
      },
      Infinity
    ),
    actualProduction = Math.min(
      maxProduction,
      availableInputs,
      availableInventorySpace
    );
  for (var input of research.Input) {
    const inputItem = l.inputBuffers.get(input.Entity);
    if (inputItem) inputItem.Count -= input.Count * actualProduction;
  }
  currentProgress!.Count += actualProduction;
  return actualProduction;
}

// Returns all research that is not completed and unlocked
export function availableResearch(researchState: ResearchState): string[] {
  const unlockedResearch = new Set();
  researchState.Progress.forEach((stack) => {
    if (stack.Count === stack.MaxCount) unlockedResearch.add(stack.Entity);
  });
  var availableResearch: string[] = [];
  for (var research of ResearchMap.values()) {
    if (unlockedResearch.has(research.Id)) continue;
    if (
      [...research.Prereqs].filter((x) => !unlockedResearch.has(x)).length === 0
    ) {
      availableResearch.push(research.Id);
    }
  }
  availableResearch = availableResearch.filter((r) => !IgnoredResearch.has(r));
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
  "iron-chest",
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

const IgnoredResearch: Set<string> = new Set([
  "stone-walls",
  "military",
  "turrets",
  "fast-inserter",
  "steel-axe",
  "electric-energy-distribution-2",
  "circuit-network",
  "automobilism",
  "explosives",
  "uranium-processing",
  "effectivity-module",
  "effect-transmission",
  "laser",

  //
  "research-speed-1",
  "toolbelt",
  "mining-productivity-1",
  "braking-force-1",

  //
  "automated-rail-transportation",
  "fluid-wagon",
  "worker-robots-storage-1",
  "logistic-robotics",
  "worker-robots-speed-1",
  "coal-liquefaction",
  "automation-3",
  "logistics-3",
]);

// Returns all recipes that can be crafted given the completed research
export function availableRecipes(
  researchState: ResearchState,
  filterFunc?: (r: Recipe) => boolean
): string[] {
  var availableRecipesIds: string[] = [...AlwaysUnlockedRecipes];
  researchState.Progress.forEach((stack) => {
    if (stack.Count === stack.MaxCount) {
      const research = GetResearch(stack.Entity);
      if (research) availableRecipesIds.push(...research.Unlocks);
      else console.log("Missing research entity for ", stack.Entity);
    }
  });
  var availableRecipes = availableRecipesIds
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
