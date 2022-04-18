import { GetEntity, GetRecipe } from "./gen/entities";
import { FixedInventory } from "./inventory";
import { producableItemsForInput, productionPerTick } from "./productionUtils";
import {
  BuildingType,
  EntityStack,
  ItemBuffer,
  NewEntityStack,
  Recipe,
  Region,
} from "./types";
import { GameState } from "./useGameState";
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

  inputBuffers: ItemBuffer; //Map<string, EntityStack>;
  outputBuffers: ItemBuffer; // Map<string, EntityStack>;
  RecipeId: string;
  BuildingCount: number;
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
  initialProduceCount = 0
): Extractor {
  return {
    kind: "Extractor",
    subkind: subkind,
    ProducerType: ProducerTypeFromEntity(subkind),
    inputBuffers: FixedInventory([]),
    outputBuffers: FixedInventory([]),
    RecipeId: "",
    BuildingCount: initialProduceCount,
  };
}

function inputItemBufferForExtractor(r: Recipe): ItemBuffer {
  return FixedInventory([NewEntityStack(r.Output[0].Entity, 0, 0)]);
}
function outputItemBufferForExtractor(r: Recipe): ItemBuffer {
  return FixedInventory([NewEntityStack(r.Output[0].Entity, 0, 50)]);
}

export function ProduceFromExtractor(e: Extractor, region: Region) {
  if (!e.RecipeId) return 0;
  const recipe = GetRecipe(e.RecipeId);
  recipe.Output.forEach((entityStack) => {
    e.outputBuffers.AddFromItemBuffer(
      region.Ore,
      entityStack.Entity,
      productionPerTick(e, recipe) * entityStack.Count,
      false,
      false
    );
  });
}

// Factory

export function AddProgressTracker(
  producer: {
    progressTrackers: number[];
    BuildingCount: number;
  },
  currentTick: number
): number {
  if (producer.progressTrackers.length >= producer.BuildingCount) return 0;
  producer.progressTrackers.push(currentTick);
  return 1;
}

export function RemoveProgressTracker(producer: {
  progressTrackers: number[];
}): number {
  if (producer.progressTrackers.length === 0) return 0;
  producer.progressTrackers.pop();
  return 1;
}

export function TickProgressTracker(
  producer: { progressTrackers: number[] },
  currentTick: number,
  progressLength: number,
  maxRemoved: number
): number {
  // TODO: Return early for extra speed boost, items *should* be sorted
  const toRemove: number[] = [];
  producer.progressTrackers.forEach((startedAt, idx) => {
    if (
      toRemove.length < maxRemoved &&
      currentTick >= startedAt + progressLength
    ) {
      toRemove.unshift(idx); // Add to front so we can remove back-to-front
    }
  });
  toRemove.forEach((removeIdx) => {
    producer.progressTrackers.splice(removeIdx, 1);
  });
  return toRemove.length;
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

  inputBuffers: ItemBuffer;
  outputBuffers: ItemBuffer;
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
    outputBuffers: FixedInventory([]),
    inputBuffers: FixedInventory([]),
    RecipeId: "",
    BuildingCount: initialProduceCount,
    progressTrackers: [],
  };
}

function inputItemBufferForFactory(r: Recipe): ItemBuffer {
  return FixedInventory(
    r.Input.map((input) => EntityStackForEntity(input.Entity, input.Count))
  );
}
function outputItemBufferForFactory(r: Recipe): ItemBuffer {
  return FixedInventory(
    r.Output.map((output) => EntityStackForEntity(output.Entity, output.Count))
  );
}

export function ProduceFromFactory(f: Factory, currentTick: number) {
  if (!f.RecipeId) return 0;
  const recipe = GetRecipe(f.RecipeId);

  // Check empty factories
  const emptyFactoriesToStart = Math.min(
    producableItemsForInput(f.inputBuffers, recipe.Input),
    Math.max(f.BuildingCount - f.progressTrackers.length, 0)
  );
  for (let idx = 0; idx < emptyFactoriesToStart; idx++) {
    // Check if we have enough ingredients to start producing and add a new tracker
    //console.log(`Starting production of ${recipe.Id} at ${currentTick}`);
    if (AddProgressTracker(f, currentTick)) {
      // Consume resources
      for (const input of recipe.Input) {
        const removed = f.inputBuffers.Remove(
          NewEntityStack(input.Entity, 0, Infinity),
          input.Count
        );

        if (removed !== input.Count) {
          console.error(f.inputBuffers.Entities());
          throw new Error(
            `Produced without enough input. Missing ${removed} ${input.Entity}`
          );
        }
      }
    }
  }

  const availableInventorySpace = recipe.Output.reduce((accum, entityStack) => {
    const spaceInOutputStack = f.outputBuffers.AvailableSpace(
      entityStack.Entity
    );
    return Math.min(
      accum,
      Math.floor(spaceInOutputStack / recipe.Output[0].Count)
    );
  }, Infinity);

  const outputCount = TickProgressTracker(
    f,
    currentTick,
    recipe.DurationSeconds * 1000,
    availableInventorySpace
  );
  //const outputCount = Math.min(producedItems, availableInventorySpace);

  for (let idx = 0; idx < outputCount; idx++) {
    // console.log(
    //   `Produced item ${idx + 1}/${producedItems} ${recipe.Id} at ${currentTick}`
    // );
    recipe.Output.forEach((outputStack) => {
      f.outputBuffers.Add(
        NewEntityStack(outputStack.Entity, outputStack.Count),
        outputStack.Count
      );
    });
  }
}

// Train Station
export type TrainStation = {
  kind: "TrainStation";
  subkind: "";
  ProducerType: string;
  outputBuffers: ItemBuffer;
  inputBuffers: ItemBuffer;
};
