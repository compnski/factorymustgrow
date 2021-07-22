import { SyntheticEvent, useEffect, useState } from "react";
import {
  Extractor,
  Factory,
  NewFactory,
  ProduceFromExtractor,
  ProduceFromFactory,
} from "./production";
import { NewRegion, NewEntityStack, Region } from "./types";
import { GetRecipe } from "./gen/entities";
import { PushToNeighbors } from "./movement";

export const useGameState = () => useState<FactoryGameState>(GameState);

export type FactoryGameState = {
  UnlockedRecipes: Set<string>;
  Region: Region;
};

const initialFactoryGameState = () => ({
  UnlockedRecipes: new Set([]),
  Region: NewRegion(50, [NewEntityStack("iron-ore", 50)]),
});

export const GameState = initialFactoryGameState();

export const saveStateToLocalStorage = (gs: FactoryGameState) => {};

export const UpdateGameState = (tick: number) => {
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
    | "Reset";
  producerName: string;
  buildingIdx?: number;
};

const NextOutputState = (s: string): "IN" | "OUT" | "NONE" => {
  switch (s) {
    case "OUT":
      return "NONE";
    case "NONE":
      return "IN";
    case "IN":
      return "OUT";
  }
  return "NONE";
};

export const GameDispatch = (action: GameAction) => {
  const building =
    action.buildingIdx != undefined
      ? GameState.Region.Buildings[action.buildingIdx]
      : undefined;
  switch (action.type) {
    case "NewProducer":
      GameState.Region.Buildings.push(
        NewFactory(GetRecipe(action.producerName))
      );
      break;
    case "IncreaseProducerCount":
      if (!building) return;
      building.ProducerCount = Math.min(50, building.ProducerCount + 1);
      break;
    case "DecreaseProducerCount":
      if (!building) return;
      building.ProducerCount = Math.max(0, building.ProducerCount - 1);
      break;
    case "ToggleUpperOutputState":
      if (!building) return;
      building.outputStatus.above = NextOutputState(
        building.outputStatus.above
      );
      break;
    case "ToggleLowerOutputState":
      if (!building) return;
      building.outputStatus.below = NextOutputState(
        building.outputStatus.below
      );
      break;
  }
};
