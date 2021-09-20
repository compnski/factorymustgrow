import {
  Producer,
  NewEntityStack,
  EntityStack,
  Recipe,
  Region,
  OutputStatus,
  Entity,
  ProducerType,
  ItemBuffer,
} from "./types";
import { stackTransfer } from "./movement";
import { GetEntity, GetRecipe } from "./gen/entities";
import { BuildingHasInput, BuildingHasOutput } from "./utils";
import { GameState } from "./useGameState";
import { FixedInventory } from "./inventory";
import { productionPerTick, producableItemsForInput } from "./productionUtils";

// Extractor
export type Extractor = {
  kind: "Extractor";
  subkind:
    | "burner-mining-drill"
    | "electric-mining-drill"
    | "offshore-pump"
    | "pumpjack";
  ProducerType: string; //"Miner" | "Pumpjack" | "WaterPump";

  inputBuffers: ItemBuffer; //Map<string, EntityStack>;
  outputBuffers: ItemBuffer; // Map<string, EntityStack>;
  outputStatus: OutputStatus;
  RecipeId: string;
  BuildingCount: number;
};

export function UpdateBuildingRecipe(
  b: Factory | Extractor,
  recipeId: string,
  getEntity: (e: string) => Entity = GetEntity,
  getRecipe: (e: string) => Recipe = GetRecipe
) {
  const recipe = getRecipe(recipeId);
  if (!recipe) throw new Error("No recipe found for " + recipeId);
  const oldInputBuffers = b.inputBuffers,
    oldOutputBuffers = b.outputBuffers;

  switch (b.kind) {
    case "Extractor":
      b.inputBuffers = inputItemBufferForExtractor(recipe, getEntity);
      b.outputBuffers = outputItemBufferForExtractor(recipe, getEntity);
      break;

    case "Factory":
      b.inputBuffers = inputItemBufferForFactory(recipe, getEntity);
      b.outputBuffers = outputItemBufferForFactory(recipe, getEntity);
  }
  b.RecipeId = recipeId;

  // Remove from input buffers
  if (BuildingHasInput(b.kind)) {
    oldInputBuffers.Entities().forEach(([entity]) => {
      if (recipe.Input.findIndex((e) => e.Entity === entity) < 0) {
        //Not in input, remove
        console.log("remove ", entity);
        GameState.Inventory.AddFromItemBuffer(
          oldInputBuffers,
          entity,
          Infinity,
          true,
          false
        );
      } else {
        b.inputBuffers.AddFromItemBuffer(
          oldInputBuffers,
          entity,
          Infinity,
          false,
          false
        );
      }
    });
  }

  // Remove from output buffers
  if (BuildingHasOutput(b.kind)) {
    oldOutputBuffers.Entities().forEach(([entity]) => {
      if (recipe.Output.findIndex((e) => e.Entity === entity) < 0) {
        //Not in output, remove
        console.log("remove ", entity);
        GameState.Inventory.AddFromItemBuffer(
          oldOutputBuffers,
          entity,
          Infinity,
          true,
          false
        );
      } else {
        b.outputBuffers.AddFromItemBuffer(
          oldOutputBuffers,
          entity,
          Infinity,
          false,
          false
        );
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
    inputBuffers: FixedInventory([]),
    outputBuffers: FixedInventory([]),
    outputStatus: { above: "NONE", below: "NONE", beltConnections: [] },
    RecipeId: "",
    BuildingCount: initialProduceCount,
  };
}

function inputItemBufferForExtractor(
  r: Recipe,
  getEntity: (e: string) => Entity
): ItemBuffer {
  return FixedInventory([NewEntityStack(r.Output[0].Entity, 0, 0)], getEntity);
}
function outputItemBufferForExtractor(
  r: Recipe,
  getEntity: (e: string) => Entity
): ItemBuffer {
  return FixedInventory([NewEntityStack(r.Output[0].Entity, 0, 50)], getEntity);
}

export function ProduceFromExtractor(
  e: Extractor,
  region: Region,
  GetRecipe: (s: string) => Recipe | undefined
) {
  const recipe = GetRecipe(e.RecipeId);
  if (recipe) {
    recipe.Output.forEach((entityStack) => {
      e.outputBuffers.AddFromItemBuffer(
        region.Ore,
        entityStack.Entity,
        productionPerTick(e, recipe),
        false,
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

  inputBuffers: ItemBuffer;
  outputBuffers: ItemBuffer;
  RecipeId: string;
  BuildingCount: number;
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
    outputBuffers: FixedInventory([]),
    inputBuffers: FixedInventory([]),
    outputStatus: { above: "NONE", below: "NONE", beltConnections: [] },
    RecipeId: "",
    BuildingCount: initialProduceCount,
  };
}

function inputItemBufferForFactory(
  r: Recipe,
  getEntity: (e: string) => Entity
): ItemBuffer {
  return FixedInventory(
    r.Input.map((input) => EntityStackForEntity(input.Entity, getEntity)),
    getEntity
  );
}
function outputItemBufferForFactory(
  r: Recipe,
  getEntity: (e: string) => Entity
): ItemBuffer {
  return FixedInventory(
    r.Output.map((output) => EntityStackForEntity(output.Entity, getEntity)),
    getEntity
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
      var spaceInOutputStack = f.outputBuffers.AvailableSpace(
        entityStack.Entity
      );

      //if (spaceInOutputStack < entityStack.Count) spaceInOutputStack = 0;
      return Math.min(accum, spaceInOutputStack);
    }, Infinity),
    actualProduction = Math.min(
      maxProduction,
      availableInputs,
      availableInventorySpace
    );
  for (var input of recipe.Input) {
    const removed = f.inputBuffers.Remove(
      NewEntityStack(input.Entity, 0, Infinity),
      input.Count * actualProduction,
      false
    );

    if (removed !== input.Count * actualProduction) {
      console.error(f.inputBuffers.Entities());
      throw new Error(
        `Produced without enough input. Missing ${removed} ${input.Entity}`
      );
    }
  }

  recipe.Output.forEach((entityStack) => {
    f.outputBuffers.Add(
      NewEntityStack(entityStack.Entity, entityStack.Count * actualProduction),
      entityStack.Count * actualProduction,
      false,
      false
    );
  });
}

// Train Station
export type TrainStation = {
  kind: "TrainStation";
  subkind: "";
  ProducerType: string;
  outputBuffers: ItemBuffer;
  inputBuffers: ItemBuffer;
  outputStatus: OutputStatus;
};
