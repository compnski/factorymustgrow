import { useState } from "react";
import {
  Extractor,
  Factory,
  NewExtractor,
  NewFactory,
  ProduceFromExtractor,
  ProduceFromFactory,
} from "./production";
import {
  NewRegion,
  NewEntityStack,
  Region,
  Producer,
  MainBus,
  EntityStack,
} from "./types";
import { GetRecipe } from "./gen/entities";
import { CanPushTo, PushPullFromMainBus, PushToNeighbors } from "./movement";
import { loadStateFromLocalStorage } from "./localstorage";
import { IsResearchComplete, Lab, NewLab, ResearchInLab } from "./research";
import { GetResearch } from "./gen/research";
import { ProducerHasOutput } from "./utils";
import { UIAction } from "./uiState";
import { GameWindow } from "./globals";

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
  "automation-science-pack",
]);

export type ResearchState = {
  CurrentResearchId: string;
  Progress: Map<string, EntityStack>;
};

export type FactoryGameState = {
  UnlockedRecipes: Set<string>;
  Region: Region;
  Research: ResearchState;
};

export const initialFactoryGameState = () => ({
  UnlockedRecipes: UnlockedRecipes,
  Research: {
    Progress: new Map([["start", NewEntityStack("start", 0, 0)]]),
    CurrentResearchId: "",
  },
  Region: NewRegion(50, [
    NewEntityStack("iron-ore", 9000),
    NewEntityStack("copper-ore", 9000),
    NewEntityStack("stone", 9000),
    NewEntityStack("coal", 9000),
  ]),
});

export var GameState = loadStateFromLocalStorage(initialFactoryGameState());

export const UpdateGameState = (
  tick: number,
  uiDispatch: (a: UIAction) => void
) => {
  try {
    fixOutputStatus(GameState.Region.Buildings);
    fixBeltConnections(GameState.Region.Buildings, GameState.Region.Bus);

    GameState.Region.Buildings.forEach((p) => {
      switch (p.kind) {
        case "Factory":
          ProduceFromFactory(p as Factory, GetRecipe);
          break;
        case "Extractor":
          ProduceFromExtractor(p as Extractor, GameState.Region, GetRecipe);
          break;
        case "Lab":
          ResearchInLab(p as Lab, GameState.Research, GetResearch);
          break;
      }
    });

    // Check Research Completion
    if (IsResearchComplete(GameState.Research)) {
      console.log("Research Complete!");
      GameDispatch({ type: "CompleteResearch" });
      uiDispatch({ type: "ShowResearchSelector" });
      GameState.Research.CurrentResearchId = "";
    }
    GameState.Region.Buildings.forEach((p, idx) => {
      PushToNeighbors(
        p,
        GameState.Region.Buildings[idx - 1],
        GameState.Region.Buildings[idx + 1]
      );
      PushPullFromMainBus(p, GameState.Region.Bus);
    });
  } catch (e) {
    //TODO Show error dialog
    console.error("Failed to update game state:", e);
  }
};

export type GameAction = {
  type:
    | "NewProducer"
    | "NewLab"
    | "RemoveBuilding"
    | "IncreaseProducerCount"
    | "DecreaseProducerCount"
    | "ToggleUpperOutputState"
    | "ToggleLowerOutputState"
    | "ReorderBuildings"
    | "ChangeResearch"
    | "CompleteResearch"
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

    case "RemoveBuilding":
      if (action.buildingIdx !== undefined) {
        GameState.Region.Buildings.splice(action.buildingIdx, 1);
      }
      break;

    case "ChangeResearch":
      if (action.producerName) {
        console.log("Set research to ", action.producerName);
        GameState.Research.CurrentResearchId = action.producerName;
      }
      break;

    case "CompleteResearch":
      const currentResearchId = GameState.Research.CurrentResearchId,
        currentResearchProgress =
          GameState.Research.Progress.get(currentResearchId);
      if (currentResearchProgress)
        currentResearchProgress.Count = currentResearchProgress.MaxCount || 0;
      else console.log("No research", currentResearchId);
      console.log(currentResearchId, currentResearchProgress);
      break;

    case "NewLab":
      Buildings.push(NewLab());
      break;

    case "NewProducer":
      if (action.producerName) {
        const r = GetRecipe(action.producerName);
        if (r && r.ProducerType === "Assembler") Buildings.push(NewFactory(r));
        if (r && r.ProducerType === "Smelter") Buildings.push(NewFactory(r));
        if (r && r.ProducerType === "Miner") Buildings.push(NewExtractor(r));
        if (r && r.ProducerType === "ChemPlant") Buildings.push(NewFactory(r));
        if (r && r.ProducerType === "Refinery") Buildings.push(NewFactory(r));
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
      if (
        !ProducerHasOutput(building?.kind) ||
        !building ||
        action.buildingIdx === undefined
      )
        return;
      building.outputStatus.above =
        building.outputStatus.above === "NONE" &&
        CanPushTo(building, Buildings[action.buildingIdx - 1])
          ? "OUT"
          : "NONE";
      break;

    case "ToggleLowerOutputState":
      if (
        !ProducerHasOutput(building?.kind) ||
        !building ||
        action.buildingIdx === undefined
      )
        return;
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

function fixBeltConnections(buildings: Producer[], bus: MainBus) {
  buildings.forEach((p, idx) => {
    p.outputStatus.beltConnections.forEach((beltConn, idx) => {
      if (!bus.HasLane(beltConn.beltId))
        p.outputStatus.beltConnections.splice(idx, 1);
    });
  });
}

function fixOutputStatus(buildings: Producer[]) {
  buildings.forEach((p, idx) => {
    if (p.outputStatus.above === "OUT" && !CanPushTo(p, buildings[idx - 1]))
      p.outputStatus.above = "NONE";
    if (p.outputStatus.below === "OUT" && !CanPushTo(p, buildings[idx + 1]))
      p.outputStatus.below = "NONE";
  });
}

(window as unknown as GameWindow).GameState = GameState;
(window as unknown as GameWindow).GameDispatch = GameDispatch;
