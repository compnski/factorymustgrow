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
import { ProducerHasInput, ProducerHasOutput } from "./utils";
import { UIAction } from "./uiState";
import { GameWindow } from "./globals";
import { Inventory } from "./inventory";

export const useGameState = () => useState<FactoryGameState>(GameState);

export type ResearchState = {
  CurrentResearchId: string;
  Progress: Map<string, EntityStack>;
};

export type FactoryGameState = {
  CurrentRegion: Region;
  Research: ResearchState;
  Inventory: Inventory;
};

export const initialFactoryGameState = () => ({
  Research: {
    Progress: new Map([["start", NewEntityStack("start", 0, 0)]]),
    CurrentResearchId: "",
  },
  CurrentRegion: NewRegion(50, [
    NewEntityStack("iron-ore", 9000),
    NewEntityStack("copper-ore", 9000),
    NewEntityStack("stone", 9000),
    NewEntityStack("coal", 9000),
    NewEntityStack("crude-oil", 9000),
    NewEntityStack("water", Infinity),
  ]),
  Inventory: new Inventory(),
});

export var GameState = loadStateFromLocalStorage(initialFactoryGameState());

export const UpdateGameState = (
  tick: number,
  uiDispatch: (a: UIAction) => void
) => {
  try {
    fixOutputStatus(GameState.CurrentRegion.Buildings);
    fixBeltConnections(
      GameState.CurrentRegion.Buildings,
      GameState.CurrentRegion.Bus
    );

    GameState.CurrentRegion.Buildings.forEach((p) => {
      switch (p.kind) {
        case "Factory":
          ProduceFromFactory(p as Factory, GetRecipe);
          break;
        case "Extractor":
          ProduceFromExtractor(
            p as Extractor,
            GameState.CurrentRegion,
            GetRecipe
          );
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
    }
    GameState.CurrentRegion.Buildings.forEach((p, idx) => {
      PushToNeighbors(
        p,
        GameState.CurrentRegion.Buildings[idx - 1],
        GameState.CurrentRegion.Buildings[idx + 1]
      );
      PushPullFromMainBus(p, GameState.CurrentRegion.Bus);
    });
  } catch (e) {
    //TODO Show error dialog
    console.error("Failed to update game state:", e);
  }
};

export type GameAction =
  | BasicAction
  | ProducerAction
  | BuildingAction
  | DragBuildingAction
  | InventoryTransferAction;

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
  return action.buildingIdx !== undefined
    ? GameState.CurrentRegion.Buildings[action.buildingIdx]
    : undefined;
}

export const GameDispatch = (action: GameAction) => {
  const Buildings = GameState.CurrentRegion.Buildings;
  switch (action.type) {
    case "Reset":
      GameState = initialFactoryGameState();
      break;

    case "RemoveBuilding":
      (() => {
        const b = building(action);
        if (b) {
          GameState.CurrentRegion.Buildings.splice(action.buildingIdx, 1);
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
      GameState.Research.CurrentResearchId = "";
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
  }
};

function inventoryTransferStack(
  action: InventoryTransferAction
): EntityStack | undefined {
  switch (action.otherStackKind) {
    case "Void":
      return NewEntityStack(action.entity, Infinity, Infinity);

    case "MainBus":
      return GameState.CurrentRegion.Bus.lanes.get(action.laneId);

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
