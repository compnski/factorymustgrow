import { SyntheticEvent, useEffect, useState } from "react";
import {
  Extractor,
  Factory,
  NewExtractor,
  NewFactory,
  ProduceFromExtractor,
  ProduceFromFactory,
} from "./production";
import { NewRegion, NewEntityStack, Region, Producer } from "./types";
import { GetRecipe } from "./gen/entities";
import { CanPushTo, PushToNeighbors } from "./movement";
import { loadStateFromLocalStorage } from "./localstorage";

export const useGameState = () => useState<FactoryGameState>(GameState);

const UnlockedRecipes = new Set([
  "iron-ore",
  "copper-ore",
  "stone",
  "stone-furnace",
  "iron-plate",
  "copper-plate",
  "copper-cable",
  "iron-gear-wheel",
  "electronic-circuit",
  "electric-mining-drill",
  "assembling-machine-1",
  "iron-chest",
]);

export type FactoryGameState = {
  UnlockedRecipes: Set<string>;
  Region: Region;
};

const initialFactoryGameState = () => ({
  UnlockedRecipes: UnlockedRecipes,
  Region: NewRegion(50, [NewEntityStack("iron-ore", 50)]),
});

export var GameState = loadStateFromLocalStorage(initialFactoryGameState());
(window as any).GameState = GameState;

export const UpdateGameState = (tick: number) => {
  fixOutputStatus(GameState.Region.Buildings);

  GameState.Region.Buildings.forEach((p) => {
    switch (p.kind) {
      case "Factory":
        ProduceFromFactory(p as Factory, GetRecipe);
        break;
      case "Extractor":
        ProduceFromExtractor(p as Extractor, GameState.Region, GetRecipe);
        break;
    }
  });

  GameState.Region.Buildings.forEach((p, idx) => {
    PushToNeighbors(
      p,
      GameState.Region.Buildings[idx - 1],
      GameState.Region.Buildings[idx + 1]
    );
  });
};

export type GameAction = {
  type:
    | "NewProducer"
    | "IncreaseProducerCount"
    | "DecreaseProducerCount"
    | "ToggleUpperOutputState"
    | "ToggleLowerOutputState"
    | "ReorderBuildings"
    | "Reset";
  producerName?: string;
  buildingIdx?: number;
  dropBuildingIdx?: number;
};

export const GameDispatch = (action: GameAction) => {
  const Buildings = GameState.Region.Buildings;
  const building =
    action.buildingIdx !== undefined
      ? GameState.Region.Buildings[action.buildingIdx]
      : undefined;
  switch (action.type) {
    case "Reset":
      GameState = initialFactoryGameState();
      break;
    case "NewProducer":
      if (action.producerName) {
        const r = GetRecipe(action.producerName);
        if (r && r.ProducerType === "Assembler") Buildings.push(NewFactory(r));
        if (r && r.ProducerType === "Smelter") Buildings.push(NewFactory(r));
        if (r && r.ProducerType === "Miner") Buildings.push(NewExtractor(r));
      }
      break;
    case "IncreaseProducerCount":
      if (building)
        building.ProducerCount = Math.min(50, building.ProducerCount + 1);
      break;
    case "DecreaseProducerCount":
      if (building)
        building.ProducerCount = Math.max(0, building.ProducerCount - 1);
      break;
    case "ToggleUpperOutputState":
      if (!building || action.buildingIdx === undefined) return;
      building.outputStatus.above =
        building.outputStatus.above === "NONE" &&
        CanPushTo(building, Buildings[action.buildingIdx - 1])
          ? "OUT"
          : "NONE";

      break;
    case "ToggleLowerOutputState":
      if (!building || action.buildingIdx === undefined) return;
      building.outputStatus.below =
        building.outputStatus.below === "NONE" &&
        CanPushTo(building, Buildings[action.buildingIdx + 1])
          ? "OUT"
          : "NONE";
      break;
    case "ReorderBuildings":
      if (
        action.buildingIdx !== undefined &&
        action.dropBuildingIdx !== undefined
      ) {
        Buildings.splice(action.buildingIdx, 1);
        Buildings.splice(action.dropBuildingIdx, 0, building as Producer);
        fixOutputStatus(Buildings);
      }
      break;
  }
};

function fixOutputStatus(buildings: Producer[]) {
  buildings.forEach((p, idx) => {
    if (p.outputStatus.above === "OUT" && !CanPushTo(p, buildings[idx - 1]))
      p.outputStatus.above = "NONE";
    if (p.outputStatus.below === "OUT" && !CanPushTo(p, buildings[idx + 1]))
      p.outputStatus.below = "NONE";
  });
}
