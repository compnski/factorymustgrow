import {
  Producer,
  NewEntityStack,
  EntityStack,
  Recipe,
  Region,
  OutputStatus,
} from "./types";
import { stackTransfer } from "./movement";
import { TicksPerSecond } from "./constants";

// Extractor
export type Extractor = {
  kind: "Extractor";
  inputBuffers: Map<string, EntityStack>;
  outputBuffers: Map<string, EntityStack>;
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
    inputBuffers: new Map([
      [r.Output[0].Entity, NewEntityStack(r.Output[0].Entity, 0, 0)],
    ]),
    outputBuffers: new Map([
      [r.Output[0].Entity, NewEntityStack(r.Output[0].Entity, 0, 50)],
    ]),
    outputStatus: { above: "NONE", below: "NONE", beltConnections: [] },
    RecipeId: r.Id,
    ProducerCount: initialProduceCount,
  };
}

function productionPerTick(p: Producer, r: Recipe): number {
  return (p.ProducerCount * r.ProductionPerTick) / TicksPerSecond;
}

export function ProduceFromExtractor(
  e: Extractor,
  region: Region,
  GetRecipe: (s: string) => Recipe | undefined
) {
  const recipe = GetRecipe(e.RecipeId);
  const regionalOre = region.Ore.get(recipe?.Input[0].Entity || "");
  if (recipe && regionalOre) {
    recipe.Output.forEach((entityStack) => {
      stackTransfer(
        regionalOre,
        e.outputBuffers.get(entityStack.Entity)!,
        productionPerTick(e, recipe),
        false
      );
    });
  }
}

// Factory

export type Factory = {
  kind: "Factory";
  inputBuffers: Map<string, EntityStack>;
  outputBuffers: Map<string, EntityStack>;
  RecipeId: string;
  ProducerCount: number;
  outputStatus: OutputStatus;
};

export function NewFactory(
  r: Recipe,
  initialProduceCount: number = 0
): Factory {
  return {
    kind: "Factory",
    outputBuffers: new Map(
      r.Output.map((output) => [
        output.Entity,
        NewEntityStack(output.Entity, 0, 50),
      ])
    ),
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
) {
  const recipe = GetRecipe(f.RecipeId);
  if (!recipe) return 0;

  const maxProduction = productionPerTick(f, recipe),
    availableInputs = producableItemsForInput(f.inputBuffers, recipe.Input),
    availableInventorySpace = recipe.Output.reduce((accum, entityStack) => {
      const outputStack = f.outputBuffers.get(entityStack.Entity);
      return Math.min(
        accum,
        (outputStack?.MaxCount || Infinity) - (outputStack?.Count || 0)
      );
    }, Infinity),
    actualProduction = Math.min(
      maxProduction,
      availableInputs,
      availableInventorySpace
    );
  for (var input of recipe.Input) {
    const inputItem = f.inputBuffers.get(input.Entity);
    if (inputItem) inputItem.Count -= input.Count * actualProduction;
  }

  recipe.Output.forEach((entityStack) => {
    f.outputBuffers.get(entityStack.Entity)!.Count +=
      entityStack.Count * actualProduction;
  });
}

// Train Station

export type TrainStation = {
  kind: "TrainStation";
  outputBuffers: Map<string, EntityStack>;
  inputBuffers: Map<string, EntityStack>;
  outputStatus: OutputStatus;
};
