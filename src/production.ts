import {
  AddProgressTrackers,
  ProduceWithTracker,
  TickProgressTracker,
} from "./AddProgressTracker";
import { GetEntity, GetRecipe } from "./gen/entities";
import { ReadonlyFixedInventory, FixedInventory } from "./inventory";
import { productionRunsForInput, productionPerTick } from "./productionUtils";
import { BuildingAddress, StateVMAction } from "./stateVm";
import {
  BuildingType,
  EntityStack,
  ItemBuffer,
  NewEntityStack,
  Recipe,
  Region,
} from "./types";
import { GameState, ReadonlyItemBuffer } from "./useGameState";
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

export function UpdateBuildingRecipe(b: Factory | Extractor, recipeId: string) {
  const recipe = GetRecipe(recipeId);
  const oldInputBuffers = b.inputBuffers,
    oldOutputBuffers = b.outputBuffers;

  switch (b.kind) {
    case "Extractor":
      b.inputBuffers = inputItemBufferForExtractor(recipe);
      b.outputBuffers = outputItemBufferForExtractor(recipe);
      break;

    case "Factory":
      b.inputBuffers = inputItemBufferForFactory(recipe);
      b.outputBuffers = outputItemBufferForFactory(recipe);
  }
  b.RecipeId = recipeId;

  // Remove from input buffers
  if (BuildingHasInput(b.kind)) {
    oldInputBuffers.Entities().forEach(([entity]) => {
      if (recipe.Input.findIndex((e) => e.Entity === entity) < 0) {
        //Not in input, remove
        GameState.Inventory
          .AddFromItemBuffer
          // oldInputBuffers,
          // entity,
          // Infinity,
          // true,
          // false
          ();
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

        GameState.Inventory
          .AddFromItemBuffer
          // oldOutputBuffers,
          // entity,
          // Infinity,
          // true,
          // false
          ();
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
  initialProduceCount = 0
): Extractor {
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

function inputItemBufferForExtractor(r: Recipe): ItemBuffer {
  return ReadonlyFixedInventory([NewEntityStack(r.Output[0].Entity, 0, 0)]);
}
function outputItemBufferForExtractor(r: Recipe): ItemBuffer {
  return ReadonlyFixedInventory([NewEntityStack(r.Output[0].Entity, 0, 50)]);
}

export function ProduceFromExtractor(
  e: Extractor,
  region: Region,
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
  stackSizeMinimum = 0
): EntityStack {
  const e = GetEntity(entity);
  return NewEntityStack(
    entity,
    0,
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

export function NewFactory(
  { subkind }: Pick<Factory, "subkind">,
  initialProduceCount = 0
): Factory {
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

function inputItemBufferForFactory(r: Recipe): ReadonlyItemBuffer {
  return ReadonlyFixedInventory(
    r.Input.map((input) => EntityStackForEntity(input.Entity, input.Count))
  );
}
function outputItemBufferForFactory(r: Recipe): ReadonlyItemBuffer {
  return ReadonlyFixedInventory(
    r.Output.map((output) => EntityStackForEntity(output.Entity, output.Count))
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
  outputBuffers: ItemBuffer;
  inputBuffers: ItemBuffer;
};
