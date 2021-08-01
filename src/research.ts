import { TicksPerSecond } from "./constants";
import { ResearchState } from "./factoryGame";
import { GetResearch } from "./gen/research";
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
