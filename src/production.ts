import {
  Producer,
  NewEntityStack,
  EntityStack,
  Recipe,
  Region,
  OutputStatus,
  Entity,
  ProducerType,
} from "./types";
import { stackTransfer } from "./movement";
import { TicksPerSecond } from "./constants";
import { GetEntity, GetRecipe } from "./gen/entities";
import { ProducerHasInput, ProducerHasOutput } from "./utils";
import { GameState } from "./useGameState";

// Extractor
export type Extractor = {
  kind: "Extractor";
  subkind:
    | "burner-mining-drill"
    | "electric-mining-drill"
    | "offshore-pump"
    | "pumpjack";
  ProducerType: string; //"Miner" | "Pumpjack" | "WaterPump";

  inputBuffers: Map<string, EntityStack>;
  outputBuffers: Map<string, EntityStack>;
  outputStatus: OutputStatus;
  RecipeId: string;
  ProducerCount: number;
};

export function UpdateBuildingRecipe(
  b: Producer | Extractor,
  recipeId: string,
  getEntity: (e: string) => Entity | undefined = GetEntity,
  getRecipe: (e: string) => Recipe | undefined = GetRecipe
) {
  const recipe = getRecipe(recipeId);
  if (!recipe) throw new Error("No recipe found for " + recipeId);
  const oldInputBuffers = b.inputBuffers,
    oldOutputBuffers = b.outputBuffers;

  switch (b.kind) {
    case "Extractor":
      b.inputBuffers = inputBuffersForExtractor(recipe);
      b.outputBuffers = outputBuffersForExtractor(recipe);
      break;

    case "Factory":
      b.inputBuffers = inputBuffersForFactory(recipe, getEntity);
      b.outputBuffers = outputBuffersForFactory(recipe, getEntity);
  }
  b.RecipeId = recipeId;

  // Remove from input buffers
  if (ProducerHasInput(b.kind)) {
    oldInputBuffers.forEach((stack, entity) => {
      if (recipe.Input.findIndex((e) => e.Entity === entity) < 0) {
        //Not in input, remove
        console.log("remove ", entity);
        GameState.Inventory.Add(stack, Infinity, true);
      } else {
        b.inputBuffers.get(entity)!.Count = stack.Count;
      }
    });
  }

  // Remove from output buffers
  if (ProducerHasOutput(b.kind)) {
    oldOutputBuffers.forEach((stack, entity) => {
      if (recipe.Output.findIndex((e) => e.Entity === entity) < 0) {
        //Not in output, remove
        console.log("remove ", entity);
        GameState.Inventory.Add(stack, Infinity, true);
      } else {
        b.outputBuffers.get(entity)!.Count = stack.Count;
      }
    });
  }
}

export function NewExtractor(
  { subkind }: Pick<Extractor, "subkind">,
  initialProduceCount: number = 0
): Extractor {
  return {
    kind: "Extractor",
    subkind: subkind,
    ProducerType: ProducerTypeFromEntity(subkind),
    inputBuffers: new Map(),
    outputBuffers: new Map(),
    outputStatus: { above: "NONE", below: "NONE", beltConnections: [] },
    RecipeId: "",
    ProducerCount: initialProduceCount,
  };
}

function inputBuffersForExtractor(r: Recipe): Map<string, EntityStack> {
  return new Map([
    [r.Output[0].Entity, NewEntityStack(r.Output[0].Entity, 0, 0)],
  ]);
}
function outputBuffersForExtractor(r: Recipe): Map<string, EntityStack> {
  return new Map([
    [r.Output[0].Entity, NewEntityStack(r.Output[0].Entity, 0, 50)],
  ]);
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
  subkind:
    | "assembling-machine-1"
    | "assembling-machine-2"
    | "assembling-machine-3"
    | "boiler"
    | "centrifuge"
    | "chemical-plant"
    | "electric-furnace"
    | "oil-refinery"
    | "rocket-silo"
    | "steel-furnace"
    | "stone-furnace";
  ProducerType: string; //"Assembler" | "RocketSilo" | "ChemPlant" | "Refinery";

  inputBuffers: Map<string, EntityStack>;
  outputBuffers: Map<string, EntityStack>;
  RecipeId: string;
  ProducerCount: number;
  outputStatus: OutputStatus;
};

function EntityStackForEntity(
  entity: string,
  getEntity: (e: string) => Entity | undefined
): EntityStack {
  const e = getEntity(entity);
  if (!e) console.error("Failed to find entity for ", entity);
  return NewEntityStack(entity, 0, e?.StackSize || Infinity);
}

const entityToProducerTypeMap: { [key: string]: ProducerType } = {
  "assembling-machine-1": "Assembler",
  "electric-mining-drill": "Miner",
  "burner-mining-drill": "Miner",
  "stone-furnace": "Smelter",
  "chemical-plant": "ChemPlant",
  "rocket-silo": "RocketSilo",
  lab: "Lab",
};

export function IsBuilding(entity: string): boolean {
  return entity in entityToProducerTypeMap;
}

export function ProducerTypeFromEntity(entity: string): ProducerType {
  const producerType = entityToProducerTypeMap[entity];
  if (producerType) return producerType;
  throw new Error("Failed to get ProducerTypeFromEntity " + entity);
}

export function NewFactory(
  { subkind }: Pick<Factory, "subkind">,
  initialProduceCount: number = 0
): Factory {
  return {
    kind: "Factory",
    ProducerType: ProducerTypeFromEntity(subkind),
    subkind,
    outputBuffers: new Map(), //outputBuffersForFactory(r, getEntity),
    inputBuffers: new Map(), //inputBuffersForFactory(r, getEntity),
    outputStatus: { above: "NONE", below: "NONE", beltConnections: [] },
    RecipeId: "",
    ProducerCount: initialProduceCount,
  };
}

function inputBuffersForFactory(
  r: Recipe,
  getEntity: (e: string) => Entity | undefined
): Map<string, EntityStack> {
  return new Map(
    r.Input.map((input) => [
      input.Entity,
      EntityStackForEntity(input.Entity, getEntity),
    ])
  );
}
function outputBuffersForFactory(
  r: Recipe,
  getEntity: (e: string) => Entity | undefined
): Map<string, EntityStack> {
  return new Map(
    r.Output.map((output) => [
      output.Entity,
      EntityStackForEntity(output.Entity, getEntity),
    ])
  );
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
      var spaceInOutputStack =
        (outputStack?.MaxCount || Infinity) - (outputStack?.Count || 0);
      if (spaceInOutputStack < entityStack.Count) spaceInOutputStack = 0;
      return Math.min(accum, spaceInOutputStack);
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
  subkind: "";
  ProducerType: string;
  outputBuffers: Map<string, EntityStack>;
  inputBuffers: Map<string, EntityStack>;
  outputStatus: OutputStatus;
};
