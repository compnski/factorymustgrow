import { NewEntityStack, EntityStack, Recipe, Region } from "./types";

interface Producer {
  kind: string;
  inputBuffers?: Map<string, EntityStack>;
  outputBuffer?: EntityStack;
  ProducerCount: number;
  //  produce(): Producer;
}

type MainBus = {
  lanes: Map<number, EntityStack>;
};

type OutputStatus = {
  above: "OUT" | "IN" | "NONE";
  below: "OUT" | "IN" | "NONE";
  beltConnections: { beltId: number; direction: "OUT" | "IN" }[];
};

type Extractor = {
  kind: "Extractor";
  outputBuffer: EntityStack;
  outputStatus: OutputStatus;
  RecipeId: string;
  ProducerCount: number;
};

function GetRecipe(s: string): Recipe {}

function productionPerTick(p: Producer, r: Recipe): number {
  return p.ProducerCount * r.ProductionPerTick;
}

function ProduceFromExtractor(e: Extractor, region: Region) {
  const recipe = GetRecipe(e.RecipeId),
    regionalOre = region.Ore.get(recipe.Output.Entity);
  if (regionalOre) {
    const maxProduction = productionPerTick(e, recipe),
      availableOre = regionalOre.Count,
      availableInventorySpace =
        (e.outputBuffer.MaxCount || Infinity) - e.outputBuffer.Count,
      actualProduction = Math.min(
        maxProduction,
        availableOre,
        availableInventorySpace
      );
    console.log(maxProduction, availableOre, availableInventorySpace);
    regionalOre.Count -= actualProduction;
    e.outputBuffer.Count += actualProduction;
  }
}

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
    outputBuffer: NewEntityStack(r.Output.Entity, 50),
    inputBuffers: new Map(
      r.Input.map((input) => [input.Entity, NewEntityStack(input.Entity, 50)])
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

type TrainStation = {
  kind: "TrainStation";
  outputBuffers: Map<string, EntityStack>;
  inputBuffers: Map<string, EntityStack>;
  outputStatus: OutputStatus;
};
