import {
  Producer,
  NewEntityStack,
  EntityStack,
  Recipe,
  Region,
  OutputStatus,
} from "./types";
import { stackTransfer } from "./movement";

// Extractor
export type Extractor = {
  kind: "Extractor";
  outputBuffer: EntityStack;
  outputStatus: OutputStatus;
  RecipeId: string;
  ProducerCount: number;
};

export function NewExtractor(
  r: Recipe,
  initialProduceCount: number = 0
): Extractor {
  return {
    kind: "Extractor",
    outputBuffer: NewEntityStack(r.Output.Entity, 0, 50),
    outputStatus: { above: "NONE", below: "NONE", beltConnections: [] },
    RecipeId: r.Id,
    ProducerCount: initialProduceCount,
  };
}

function productionPerTick(p: Producer, r: Recipe): number {
  return p.ProducerCount * r.ProductionPerTick;
}

export function ProduceFromExtractor(
  e: Extractor,
  region: Region,
  GetRecipe: (s: string) => Recipe | undefined
) {
  const recipe = GetRecipe(e.RecipeId);
  const regionalOre = region.Ore.get(recipe?.Output.Entity || "");
  if (recipe && regionalOre) {
    return stackTransfer(
      regionalOre,
      e.outputBuffer,
      productionPerTick(e, recipe)
    );
  }
  return 0;
}

// Factory

export type Factory = {
  kind: "Factory";
  outputBuffer: EntityStack;
  inputBuffers: Map<string, EntityStack>;
  outputStatus: OutputStatus;
  RecipeId: string;
  ProducerCount: number;
};

export function NewFactory(
  r: Recipe,
  initialProduceCount: number = 0
): Factory {
  return {
    kind: "Factory",
    outputBuffer: NewEntityStack(r.Output.Entity, 0, 50),
    inputBuffers: new Map(
      r.Input.map((input) => [
        input.Entity,
        NewEntityStack(input.Entity, 0, 50),
      ])
    ),
    outputStatus: { above: "NONE", below: "NONE", beltConnections: [] },
    RecipeId: r.Id,
    ProducerCount: initialProduceCount,
  };
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

export function ProduceFromFactory(
  f: Factory,
  GetRecipe: (s: string) => Recipe | undefined
): number {
  const recipe = GetRecipe(f.RecipeId);
  if (!recipe) return 0;

  const maxProduction = productionPerTick(f, recipe),
    availableInputs = producableItemsForInput(f.inputBuffers, recipe.Input),
    availableInventorySpace =
      (f.outputBuffer.MaxCount || Infinity) - f.outputBuffer.Count,
    actualProduction = Math.min(
      maxProduction,
      availableInputs,
      availableInventorySpace
    );
  for (var input of recipe.Input) {
    const inputItem = f.inputBuffers.get(input.Entity);
    if (inputItem) inputItem.Count -= input.Count * actualProduction;
  }
  f.outputBuffer.Count += actualProduction;
  return actualProduction;
}

// Train Station

export type TrainStation = {
  kind: "TrainStation";
  outputBuffers: Map<string, EntityStack>;
  inputBuffers: Map<string, EntityStack>;
  outputStatus: OutputStatus;
};
