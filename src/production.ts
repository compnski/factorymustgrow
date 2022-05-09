import { ProduceWithTracker } from "./AddProgressTracker";
import { GetEntity, GetRecipe, MaybeGetRecipe } from "./gen/entities";
import { ReadonlyFixedInventory, ReadonlyInventory } from "./inventory";
import { StateVMAction } from "./state/action";
import { BuildingAddress } from "./state/address";
import { BuildingType, EntityStack, NewEntityStack, Recipe } from "./types";
import { ReadonlyItemBuffer, ReadonlyRegion } from "./factoryGameState";
import { BuildingHasInput, BuildingHasOutput } from "./utils";

// Extractor
export type Extractor = {
  kind: "Extractor";
  subkind:
    | "burner-mining-drill"
    | "electric-mining-drill"
    | "offshore-pump"
    | "pumpjack";
  ProducerType: string; //"Miner" | "Pumpjack" | "WaterPump";

  inputBuffers: ReadonlyItemBuffer;
  outputBuffers: ReadonlyItemBuffer;
  RecipeId: string;
  BuildingCount: number;
  progressTrackers: number[];
};

export function UpdateBuildingRecipe(
  Inventory: ReadonlyInventory,
  b: Factory | Extractor,
  RecipeId: string
): { Building: Factory | Extractor; Inventory: ReadonlyInventory } {
  const recipe = MaybeGetRecipe(RecipeId),
    priorRecipe = MaybeGetRecipe(b.RecipeId);

  //Not in output, add to inventory
  if (BuildingHasInput(b.kind)) {
    b.inputBuffers.Entities().forEach(([entity, count]) => {
      if (
        count > 0 &&
        (!recipe || recipe.Input.findIndex((e) => e.Entity === entity) < 0)
      ) {
        Inventory = Inventory.AddItems(entity, count);
      }
    });
  }
  if (BuildingHasOutput(b.kind)) {
    b.outputBuffers.Entities().forEach(([entity, count]) => {
      if (
        count > 0 &&
        (!recipe || recipe.Output.findIndex((e) => e.Entity === entity) < 0)
      ) {
        Inventory = Inventory.AddItems(entity, count);
      }
    });
  }

  //

  switch (b.kind) {
    case "Extractor":
      return {
        Inventory,
        Building: {
          ...b,
          RecipeId,
          inputBuffers: inputItemBufferForExtractor(recipe, b.inputBuffers),
          outputBuffers: outputItemBufferForExtractor(recipe, b.outputBuffers),
          progressTrackers: [],
        },
      };

    case "Factory":
      if (priorRecipe)
        for (const input of priorRecipe.Input)
          Inventory = Inventory.AddItems(
            input.Entity,
            input.Count * b.progressTrackers.length
          );
      return {
        Inventory,
        Building: {
          ...b,
          RecipeId,
          inputBuffers: inputItemBufferForFactory(recipe, b.inputBuffers),
          outputBuffers: outputItemBufferForFactory(recipe, b.outputBuffers),
          progressTrackers: [],
        },
      };
  }
}

export function NewExtractorForRecipe(
  { subkind }: Pick<Extractor, "subkind">,
  recipeId: string,
  initialProduceCount = 0
): Extractor {
  const recipe = GetRecipe(recipeId);

  return {
    kind: "Extractor",
    subkind: subkind,
    ProducerType: ProducerTypeFromEntity(subkind),
    inputBuffers: inputItemBufferForExtractor(recipe),
    outputBuffers: outputItemBufferForExtractor(recipe),
    RecipeId: recipeId,
    BuildingCount: initialProduceCount,
    progressTrackers: [],
  };
}

export function NewExtractor(
  { subkind }: Pick<Extractor, "subkind">,
  initialProduceCount = 0,
  recipeId?: string
): Extractor {
  if (recipeId)
    return NewExtractorForRecipe({ subkind }, recipeId, initialProduceCount);

  return {
    kind: "Extractor",
    subkind: subkind,
    ProducerType: ProducerTypeFromEntity(subkind),
    inputBuffers: ReadonlyFixedInventory([]),
    outputBuffers: ReadonlyFixedInventory([]),
    RecipeId: "",
    BuildingCount: initialProduceCount,
    progressTrackers: [],
  };
}

function inputItemBufferForExtractor(
  r: Recipe | undefined,
  existingItems?: ReadonlyItemBuffer
): ReadonlyItemBuffer {
  if (!r) return ReadonlyFixedInventory([]);
  const entity = r.Output[0].Entity;
  const count = existingItems ? existingItems.Count(entity) : 0;
  return ReadonlyFixedInventory([NewEntityStack(entity, count, 0)]);
}

function outputItemBufferForExtractor(
  r: Recipe | undefined,
  existingItems?: ReadonlyItemBuffer
): ReadonlyItemBuffer {
  if (!r) return ReadonlyFixedInventory([]);
  const entity = r.Output[0].Entity;
  const count = existingItems ? existingItems.Count(entity) : 0;
  return ReadonlyFixedInventory([NewEntityStack(entity, count, 50)]);
}

export function ProduceFromExtractor(
  e: Extractor,
  region: ReadonlyRegion,
  dispatch: (a: StateVMAction) => void,
  address: BuildingAddress,
  currentTick: number
) {
  if (!e.RecipeId) return 0;
  const recipe = GetRecipe(e.RecipeId);

  return ProduceWithTracker({
    dispatch,
    currentTick,
    buildingAddress: address,
    recipe,
    building: e,
    inputBuffers: region.Ore,
    inputAddress: { regionId: address.regionId, buffer: "ore" },
  });
}

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

  inputBuffers: ReadonlyItemBuffer;
  outputBuffers: ReadonlyItemBuffer;
  RecipeId: string;
  BuildingCount: number;
  progressTrackers: number[];
};

function EntityStackForEntity(
  entity: string,
  initialCount = 0,
  stackSizeMinimum = 0
): EntityStack {
  const e = GetEntity(entity);
  return NewEntityStack(
    entity,
    initialCount,
    Math.max(stackSizeMinimum, e?.StackSize || Infinity)
  );
}

const entityToProducerTypeMap: { [key: string]: BuildingType } = {
  "assembling-machine-1": "Assembler",
  "electric-mining-drill": "Miner",
  "burner-mining-drill": "Miner",
  "stone-furnace": "Smelter",
  "chemical-plant": "ChemPlant",
  "oil-refinery": "Refinery",
  "rocket-silo": "RocketSilo",
  lab: "Lab",
  "iron-chest": "Chest",
  "steel-chest": "Chest",
  "transport-belt": "Depot",
  pumpjack: "Pumpjack",
  incinerator: "Chest",
  "offshore-pump": "WaterPump",
};

export function IsBuilding(entity: string): boolean {
  return entity in entityToProducerTypeMap;
}

export function ProducerTypeFromEntity(entity: string): BuildingType {
  switch (entity) {
    case "assembling-machine-1":
      return "Assembler";
    case "electric-mining-drill":
      return "Miner";
    case "burner-mining-drill":
      return "Miner";
    case "stone-furnace":
      return "Smelter";
    case "chemical-plant":
      return "ChemPlant";
    case "oil-refinery":
      return "Refinery";
    case "rocket-silo":
      return "RocketSilo";
    case "lab":
      return "Lab";
    case "iron-chest":
      return "Chest";
    case "steel-chest":
      return "Chest";
    case "transport-belt":
      return "Depot";
    case "pumpjack":
      return "Pumpjack";
    case "incinerator":
      return "Chest";
    case "offshore-pump":
      return "WaterPump";
  }
  // const producerType = entityToProducerTypeMap[entity];
  // if (producerType) return producerType;
  throw new Error("Failed to get ProducerTypeFromEntity " + entity);
}

export function NewFactoryForRecipe(
  { subkind }: Pick<Factory, "subkind">,
  recipeId: string,
  initialProduceCount = 0
): Factory {
  const recipe = GetRecipe(recipeId);

  return {
    kind: "Factory",
    subkind: subkind,
    ProducerType: ProducerTypeFromEntity(subkind),
    inputBuffers: inputItemBufferForFactory(recipe),
    outputBuffers: outputItemBufferForFactory(recipe),
    RecipeId: recipeId,
    BuildingCount: initialProduceCount,
    progressTrackers: [],
  };
}

export function NewFactory(
  { subkind }: Pick<Factory, "subkind">,
  initialProduceCount = 0,
  recipeId?: string
): Factory {
  if (recipeId)
    return NewFactoryForRecipe({ subkind }, recipeId, initialProduceCount);
  return {
    kind: "Factory",
    ProducerType: ProducerTypeFromEntity(subkind),
    subkind,
    outputBuffers: ReadonlyFixedInventory([]),
    inputBuffers: ReadonlyFixedInventory([]),
    RecipeId: "",
    BuildingCount: initialProduceCount,
    progressTrackers: [],
  };
}

function inputItemBufferForFactory(
  r: Recipe | undefined,
  existingItems?: ReadonlyItemBuffer
): ReadonlyItemBuffer {
  if (!r) return ReadonlyFixedInventory([]);

  return ReadonlyFixedInventory(
    r.Input.map((input) =>
      EntityStackForEntity(
        input.Entity,
        existingItems ? existingItems.Count(input.Entity) : 0,
        input.Count
      )
    )
  );
}
function outputItemBufferForFactory(
  r: Recipe | undefined,
  existingItems?: ReadonlyItemBuffer
): ReadonlyItemBuffer {
  if (!r) return ReadonlyFixedInventory([]);
  return ReadonlyFixedInventory(
    r.Output.map((output) =>
      EntityStackForEntity(
        output.Entity,
        existingItems ? existingItems.Count(output.Entity) : 0,
        output.Count
      )
    )
  );
}

export function ProduceFromFactory(
  f: Factory,
  dispatch: (a: StateVMAction) => void,
  address: BuildingAddress,
  currentTick: number
) {
  if (!f.RecipeId) return 0;
  const recipe = GetRecipe(f.RecipeId);

  return ProduceWithTracker({
    dispatch,
    currentTick,
    buildingAddress: address,
    recipe,
    building: f,
  });
}

// Train Station
export type TrainStation = {
  kind: "TrainStation";
  subkind: "";
  ProducerType: string;
  outputBuffers: ReadonlyItemBuffer;
  inputBuffers: ReadonlyItemBuffer;
};
