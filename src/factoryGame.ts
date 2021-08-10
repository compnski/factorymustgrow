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
  RegionInfo,
} from "./types";
import { GetEntity, GetRecipe } from "./gen/entities";
import { CanPushTo, PushPullFromMainBus, PushToNeighbors } from "./movement";
import { loadStateFromLocalStorage } from "./localstorage";
import { IsResearchComplete, Lab, NewLab, ResearchInLab } from "./research";
import { GetResearch } from "./gen/research";
import { ProducerHasInput, ProducerHasOutput } from "./utils";
import { UIAction } from "./uiState";
import { GameWindow } from "./globals";
import { Inventory } from "./inventory";
import { GetRegionInfo } from "./region";

export const useGameState = () => useState<FactoryGameState>(GameState);

export type ResearchState = {
  CurrentResearchId: string;
  Progress: Map<string, EntityStack>;
};

export type FactoryGameState = {
  CurrentRegionId: string;
  Research: ResearchState;
  Inventory: Inventory;
  Regions: Map<string, Region>;
};

function NewRegionFromInfo(info: RegionInfo): Region {
  return NewRegion(info.Id, info.Capacity, info.MainBusCapacity, [
    ...info.Provides,
  ]);
}

const initialInventorySize = 8;
export const initialFactoryGameState = () => ({
  Research: {
    Progress: new Map([["start", NewEntityStack("start", 0, 0)]]),
    CurrentResearchId: "",
  },
  CurrentRegionId: "start",
  Inventory: new Inventory(initialInventorySize, [
    NewEntityStack(GetEntity("burner-mining-drill"), 5),
    NewEntityStack(GetEntity("assembling-machine-1"), 5),
    NewEntityStack(GetEntity("stone-furnace"), 5),
  ]),
  Regions: new Map([["start", NewRegionFromInfo(GetRegionInfo("start"))]]),
});

export var GameState = loadStateFromLocalStorage(initialFactoryGameState());

export const UpdateGameState = (
  tick: number,
  uiDispatch: (a: UIAction) => void
) => {
  try {
    //const currentRegion = GameState.Regions.get(GameState.CurrentRegionId)!;
    for (var [, currentRegion] of GameState.Regions) {
      UpdateGameStateForRegion(tick, currentRegion);
    }
    // Check Research Completion
    if (IsResearchComplete(GameState.Research)) {
      console.log("Research Complete!");
      GameDispatch({ type: "CompleteResearch" });
      uiDispatch({ type: "ShowResearchSelector" });
    }
  } catch (e) {
    //TODO Show error dialog
    console.error("Failed to update game state:", e);
  }
};

function UpdateGameStateForRegion(tick: number, currentRegion: Region) {
  fixOutputStatus(currentRegion.Buildings);
  fixBeltConnections(currentRegion.Buildings, currentRegion.Bus);

  currentRegion.Buildings.forEach((p) => {
    switch (p.kind) {
      case "Factory":
        ProduceFromFactory(p as Factory, GetRecipe);
        break;
      case "Extractor":
        ProduceFromExtractor(p as Extractor, currentRegion, GetRecipe);
        break;
      case "Lab":
        ResearchInLab(p as Lab, GameState.Research, GetResearch);
        break;
    }
  });

  currentRegion.Buildings.forEach((p, idx) => {
    PushToNeighbors(
      p,
      currentRegion.Buildings[idx - 1],
      currentRegion.Buildings[idx + 1]
    );
    PushPullFromMainBus(p, currentRegion.Bus);
  });
}

export type GameAction =
  | BasicAction
  | ProducerAction
  | BuildingAction
  | DragBuildingAction
  | InventoryTransferAction
  | LaneAction
  | RegionAction;

type LaneAction = {
  type: "RemoveLane";
  laneId: number;
};

type RegionAction = {
  type: "ClaimRegion" | "ChangeRegion";
  regionId: string;
};

type ProducerAction = {
  type: "NewProducer" | "ChangeResearch";
  producerName: string;
};

type BasicAction = {
  type: "NewLab" | "CompleteResearch" | "Reset";
};

type BuildingAction = {
  type:
    | "RemoveBuilding"
    | "IncreaseProducerCount"
    | "DecreaseProducerCount"
    | "ToggleUpperOutputState"
    | "ToggleLowerOutputState";
  buildingIdx: number;
};

type DragBuildingAction = {
  type: "ReorderBuildings";
  buildingIdx: number;
  dropBuildingIdx?: number;
};

type InventoryTransferAction =
  | {
      type: "TransferToInventory" | "TransferFromInventory";
      entity: string;
      otherStackKind: "MainBus";
      laneId: number;
    }
  | {
      type: "TransferToInventory" | "TransferFromInventory";
      entity: string;
      otherStackKind: "Building";
      buildingIdx: number;
    }
  | {
      type: "TransferToInventory" | "TransferFromInventory";
      entity: string;
      otherStackKind: "Void";
    };

function building(action: { buildingIdx: number }): Producer | undefined {
  const currentRegion = GameState.Regions.get(GameState.CurrentRegionId)!;

  return action.buildingIdx !== undefined
    ? currentRegion.Buildings[action.buildingIdx]
    : undefined;
}

export const GameDispatch = (action: GameAction) => {
  const currentRegion = GameState.Regions.get(GameState.CurrentRegionId)!;

  const Buildings = currentRegion.Buildings;
  switch (action.type) {
    case "Reset":
      GameState = initialFactoryGameState();
      break;

    case "RemoveBuilding":
      (() => {
        const b = building(action);
        if (b) {
          currentRegion.Buildings.splice(action.buildingIdx, 1);
          if (ProducerHasInput(b.kind))
            b.inputBuffers.forEach((s: EntityStack) =>
              GameState.Inventory.Add(s, Infinity, true)
            );
          if (ProducerHasOutput(b.kind))
            b.outputBuffers.forEach((s: EntityStack) =>
              GameState.Inventory.Add(s, Infinity, true)
            );
        }
      })();
      break;

    case "RemoveLane":
      const stack = currentRegion.Bus.RemoveLane(action.laneId);
      if (stack) GameState.Inventory.Add(stack, Infinity, true);
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
      else {
        const r = GetResearch(currentResearchId);
        if (r)
          GameState.Research.Progress.set(
            currentResearchId,
            NewEntityStack(
              currentResearchId,
              r.ProductionRequiredForCompletion,
              r.ProductionRequiredForCompletion
            )
          );
        else console.log("No Research");
      }
      //else console.log("No research", currentResearchId);
      GameState.Research.CurrentResearchId = "";
      break;

    case "NewLab":
      Buildings.push(NewLab());
      break;

    case "NewProducer":
      if (action.producerName) {
        const r = GetRecipe(action.producerName);
        if (r && r.ProducerType === "RocketSilo") Buildings.push(NewFactory(r));
        if (r && r.ProducerType === "Assembler") Buildings.push(NewFactory(r));
        if (r && r.ProducerType === "Smelter") Buildings.push(NewFactory(r));
        if (r && r.ProducerType === "Miner") Buildings.push(NewExtractor(r));
        if (r && r.ProducerType === "ChemPlant") Buildings.push(NewFactory(r));
        if (r && r.ProducerType === "Refinery") Buildings.push(NewFactory(r));
        if (r && r.ProducerType === "Pumpjack") Buildings.push(NewExtractor(r));
        if (r && r.ProducerType === "WaterPump")
          Buildings.push(NewExtractor(r));
      }
      break;

    case "IncreaseProducerCount":
      (() => {
        const b = building(action);
        if (b) b.ProducerCount = Math.min(50, b.ProducerCount + 1);
      })();
      break;

    case "DecreaseProducerCount":
      (() => {
        const b = building(action);
        if (b) b.ProducerCount = Math.max(0, b.ProducerCount - 1);
      })();
      break;

    case "ToggleUpperOutputState":
      (() => {
        const b = building(action);
        if (
          !ProducerHasOutput(b?.kind) ||
          !b ||
          action.buildingIdx === undefined
        )
          return;
        b.outputStatus.above =
          b.outputStatus.above === "NONE" &&
          CanPushTo(b, Buildings[action.buildingIdx - 1])
            ? "OUT"
            : "NONE";
      })();
      break;

    case "ToggleLowerOutputState":
      (() => {
        const b = building(action);
        if (
          !ProducerHasOutput(b?.kind) ||
          !b ||
          action.buildingIdx === undefined
        )
          return;
        b.outputStatus.below =
          b.outputStatus.below === "NONE" &&
          CanPushTo(b, Buildings[action.buildingIdx + 1])
            ? "OUT"
            : "NONE";
      })();
      break;

    case "ReorderBuildings":
      (() => {
        const b = building(action);

        if (
          action.buildingIdx !== undefined &&
          action.dropBuildingIdx !== undefined
        ) {
          Buildings.splice(action.buildingIdx, 1);
          Buildings.splice(action.dropBuildingIdx, 0, b as Producer);
          fixOutputStatus(Buildings);
        }
      })();
      break;

    case "TransferToInventory":
      (() => {
        const fromStack = inventoryTransferStack(action);
        if (fromStack)
          if (GameState.Inventory.CanFit(fromStack)) {
            GameState.Inventory.Add(fromStack);
          }
      })();
      break;

    case "TransferFromInventory":
      (() => {
        const toStack = inventoryTransferStack(action);
        if (toStack) GameState.Inventory.Remove(toStack);
      })();
      break;

    case "ChangeRegion":
      if (GameState.Regions.has(action.regionId))
        GameState.CurrentRegionId = action.regionId;
      break;

    case "ClaimRegion":
      if (GameState.Regions.has(action.regionId)) {
        console.log("Region already unlocked", action.regionId);
        return;
      }
      const regionInfo = GetRegionInfo(action.regionId);
      if (regionInfo) {
        GameState.Regions.set(action.regionId, NewRegionFromInfo(regionInfo));
        GameState.CurrentRegionId = action.regionId;
      }
      break;
  }
};

function inventoryTransferStack(
  action: InventoryTransferAction
): EntityStack | undefined {
  const currentRegion = GameState.Regions.get(GameState.CurrentRegionId)!;

  switch (action.otherStackKind) {
    case "Void":
      return NewEntityStack(action.entity, Infinity, Infinity);

    case "MainBus":
      return currentRegion.Bus.lanes.get(action.laneId);

    case "Building":
      const b = building(action);
      if (b) {
        if (ProducerHasOutput(b.kind) && b.outputBuffers.has(action.entity)) {
          return b.outputBuffers.get(action.entity);
        }
        if (ProducerHasInput(b.kind) && b?.inputBuffers.has(action.entity)) {
          return b.inputBuffers.get(action.entity);
        }
      }
  }
  return;
}

function fixBeltConnections(buildings: Producer[], bus: MainBus) {
  buildings.forEach((p) => {
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

(window as unknown as GameWindow).GameState = () => GameState;
(window as unknown as GameWindow).GameDispatch = GameDispatch;
