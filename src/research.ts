import { TicksPerSecond } from "./constants";
import { ResearchState } from "./factoryGame";
import { GetEntity } from "./gen/entities";
import { GetResearch, ResearchMap } from "./gen/research";
import {
  EntityStack,
  NewEntityStack,
  OutputStatus,
  Producer,
  Research,
} from "./types";

export type Lab = {
  kind: "Lab";
  RecipeId: string;
  inputBuffers: Map<string, EntityStack>;
  outputBuffer: EntityStack;
  ProducerCount: number;
  outputStatus: OutputStatus;
};

const initialLabInput = [
  { Entity: "automation-science-pack", Count: 0 },
  { Entity: "logistic-science-pack", Count: 0 },
  { Entity: "military-science-pack", Count: 0 },
  { Entity: "production-science-pack", Count: 0 },
  { Entity: "chemical-science-pack", Count: 0 },
  { Entity: "utility-science-pack", Count: 0 },
  { Entity: "space-science-pack", Count: 0 },
];

export function NewLab(initialProduceCount: number = 0): Lab {
  return {
    kind: "Lab",
    outputBuffer: NewEntityStack(""),
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
    // TODO No research icon?
    l.outputBuffer = NewEntityStack("");
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
  if (currentProgress) l.outputBuffer = currentProgress;

  const maxProduction = productionPerTick(l, research),
    availableInputs = producableItemsForInput(l.inputBuffers, research.Input),
    availableInventorySpace =
      (l.outputBuffer.MaxCount || Infinity) - l.outputBuffer.Count,
    actualProduction = Math.min(
      maxProduction,
      availableInputs,
      availableInventorySpace
    );
  for (var input of research.Input) {
    const inputItem = l.inputBuffers.get(input.Entity);
    if (inputItem) inputItem.Count -= input.Count * actualProduction;
  }
  l.outputBuffer.Count += actualProduction;
  return actualProduction;
}

export function availableResearch(researchState: ResearchState): string[] {
  const unlockedResearch = new Set();
  researchState.Progress.forEach((stack) => {
    if (stack.Count === stack.MaxCount) unlockedResearch.add(stack.Entity);
  });
  const availableResearch: string[] = [];
  for (var research of ResearchMap.values()) {
    if (unlockedResearch.has(research.Id)) continue;
    if (
      [...research.Prereqs].filter((x) => !unlockedResearch.has(x)).length == 0
    ) {
      availableResearch.push(research.Id);
    }
  }
  availableResearch.sort((a, b) => GetResearch(a).Row - GetResearch(b).Row);
  return availableResearch;
}

const AlwaysUnlockedRecipes = [
  "wood",
  "iron-ore",
  "copper-ore",
  "stone",
  "coal",
  "automation-science-pack",
  "boiler",
  "burner-inserter",
  "burner-mining-drill",
  "copper-cable",
  "copper-plate",
  "electric-mining-drill",
  "electronic-circuit",
  "firearm-magazine",
  "inserter",
  "iron-chest",
  "iron-gear-wheel",
  "iron-plate",
  "iron-stick",
  "lab",
  "light-armor",
  "offshore-pump",
  "pipe",
  "pipe-to-ground",
  "pistol",
  "radar",
  "repair-pack",
  "small-electric-pole",
  "steam-engine",
  "stone-brick",
  "stone-furnace",
  "transport-belt",
  "wooden-chest",
];

const categoryOrder: { [key: string]: number } = {
  fluids: 0,
  logistics: 1,
  production: 2,
  "intermediate-products": 3,
  combat: 4,
};

export function availableRecipes(researchState: ResearchState): string[] {
  const availableRecipes: string[] = [...AlwaysUnlockedRecipes];
  researchState.Progress.forEach((stack) => {
    if (stack.Count === stack.MaxCount) {
      const research = GetResearch(stack.Entity);
      availableRecipes.push(...research.Unlocks);
    }
  });
  availableRecipes.sort((a, b): number => {
    const entA = GetEntity(a),
      entB = GetEntity(b);
    if (entA.Category !== entB.Category)
      return categoryOrder[entA.Category] - categoryOrder[entB.Category];
    if (entA.Row !== entB.Row) return entA.Row - entB.Row;
    return entA.Col - entB.Col;
  });
  return availableRecipes;
}
