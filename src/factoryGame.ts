import {
  Extractor,
  Factory,
  NewExtractor,
  NewFactory,
  ProduceFromExtractor,
  ProduceFromFactory,
  ProducerTypeFromEntity,
  UpdateBuildingRecipe,
} from "./production";
import {
  NewEntityStack,
  Region,
  Producer,
  NewRegionFromInfo,
  ItemBuffer,
} from "./types";
import { GetEntity, GetRecipe } from "./gen/entities";
import {
  CanPushTo,
  PushPullFromMainBus,
  PushToNeighbors,
  stackTransfer,
} from "./movement";
import { IsResearchComplete, Lab, NewLab, ResearchInLab } from "./research";
import { GetResearch } from "./gen/research";
import { BuildingHasInput, BuildingHasOutput } from "./utils";
import { UIAction } from "./uiState";
import { GameWindow } from "./globals";
import { GetRegionInfo, RemainingRegionBuildingCapacity } from "./region";
import { Building } from "./building";
import { GameState } from "./useGameState";
import { ResetGameState } from "./useGameState";
import {
  BeltLine,
  BeltLineDepot,
  FindDepotForBeltLineInRegion,
  NewBeltLinePair,
  UpdateBeltLine,
} from "./transport";
import { MainBus } from "./mainbus";
import { FixedInventory } from "./inventory";

export const UpdateGameState = (
  tick: number,
  uiDispatch: (a: UIAction) => void
) => {
  try {
    //const currentRegion = GameState.Regions.get(GameState.CurrentRegionId)!;
    for (var [, currentBeltLine] of GameState.BeltLines) {
      UpdateBeltLine(tick, GameState.Regions, currentBeltLine);
    }
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
  | InventoryTransferAction
  | LaneAction
  | RegionAction
  | AddBuildingAction
  | DragBuildingAction
  | ChangeRecipeAction;
//| ChangeBeltLineItemAction;

type AddBuildingAction = {
  type: "AddBuilding";
} & Pick<Building, "kind" | "subkind">;

type LaneAction =
  | {
      type: "RemoveLane";
      laneId: number;
    }
  | {
      type: "AddLane";
      entity: string;
    };

type RegionAction = {
  type: "ClaimRegion" | "ChangeRegion";
  regionId: string;
};

type DragBuildingAction = {
  type: "ReorderBuildings";
  buildingIdx: number;
  dropBuildingIdx?: number;
};

type ProducerAction = {
  type: "ChangeResearch";
  producerName: string;
};

type BasicAction = {
  type: "NewLab" | "CompleteResearch" | "Reset";
};

type BuildingAction =
  | {
      type:
        | "RemoveBuilding"
        | "IncreaseBuildingCount"
        | "DecreaseBuildingCount"
        | "ToggleUpperOutputState"
        | "ToggleLowerOutputState";
      buildingIdx: number;
    }
  | {
      type: "PlaceBuilding";
      entity: string;
    }
  | {
      type: "PlaceBeltLine";
      entity:
        | "transport-belt"
        | "fast-transport-belt"
        | "express-transport-belt";
      beltLength: number;
      targetRegion: string;
    };

type ChangeRecipeAction = {
  type: "ChangeRecipe";
  buildingIdx: number;
  recipeId: string;
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
      count?: number;
    };

function building(action: { buildingIdx: number }): Building | undefined {
  const currentRegion = GameState.Regions.get(GameState.CurrentRegionId)!;

  return action.buildingIdx !== undefined
    ? currentRegion.Buildings[action.buildingIdx]
    : undefined;
}

export const GameDispatch = (action: GameAction) => {
  const currentRegion = GameState?.Regions?.get(GameState.CurrentRegionId)!;

  const Buildings = currentRegion?.Buildings;
  switch (action.type) {
    case "Reset":
      ResetGameState();
      window.scrollTo(0, 0);
      break;

    case "RemoveLane":
      const lane = currentRegion.Bus.RemoveLane(action.laneId),
        laneEntity = lane?.Entities()[0][0];

      if (lane && laneEntity)
        GameState.Inventory.AddFromItemBuffer(lane, laneEntity, Infinity, true);
      break;

    case "AddLane":
      currentRegion.Bus.AddLane(action.entity);
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

    case "ChangeRecipe":
      (() => {
        const b = building(action);
        console.log("Change recipe for ", b, "to", action.recipeId);
        // Change Recipe
        // Move any Input / Output that no longer matches a buffer into inventory
        // Update input/output buffers
        if (b && (b.kind === "Factory" || b.kind === "Extractor"))
          UpdateBuildingRecipe(b, action.recipeId);
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
          Buildings.splice(action.dropBuildingIdx, 0, b as Building);
          fixOutputStatus(Buildings);
        }
      })();
      break;

    case "RemoveBuilding":
      (() => {
        const b = building(action); // as Producer;
        console.log(b?.kind);
        if (b) {
          console.log(b.kind);
          currentRegion.Buildings.splice(action.buildingIdx, 1);
          if (BuildingHasInput(b.kind))
            b.inputBuffers
              .Entities()
              .forEach(([entity, count]) =>
                GameState.Inventory.AddFromItemBuffer(
                  b.inputBuffers,
                  entity,
                  count,
                  true
                )
              );
          if (BuildingHasOutput(b.kind))
            b.outputBuffers
              .Entities()
              .forEach(([entity, count]) =>
                GameState.Inventory.AddFromItemBuffer(
                  b.outputBuffers,
                  entity,
                  count,
                  true
                )
              );
          if (b.kind === "BeltLineDepot") {
            const depot = b as BeltLineDepot,
              otherDepot = FindDepotForBeltLineInRegion(
                GameState.Regions.get(depot.otherRegionId)!,
                depot.beltLineId,
                depot.direction === "TO_REGION" ? "FROM_REGION" : "TO_REGION"
              );
            // Have to remove both depots to remove beltline
            if (!otherDepot) {
              // Remove BeltLine
              const beltLine = GameState.BeltLines.get(depot.beltLineId);
              if (!beltLine) {
                console.error(
                  "No beltline to delete when deleting depot for ",
                  depot.beltLineId
                );
                return;
              }
              GameState.Inventory.Add(
                NewEntityStack(b.subkind, b.BuildingCount * beltLine.length),
                b.BuildingCount
              );
              beltLine.sharedBeltBuffer.forEach((es) => {
                if (es && es.Entity)
                  GameState.Inventory.Add(es, Infinity, true);
              });
              GameState.BeltLines.delete(beltLine.beltLineId);
            }
          } else {
            GameState.Inventory.Add(
              NewEntityStack(b.subkind, b.BuildingCount),
              b.BuildingCount,
              true
            );
          }
          // Return space
        }
      })();
      break;

    case "PlaceBeltLine":
      // TODO: Check for any orphan beltlines that could connect here.
      console.log("place belt line");
      const targetRegion = GameState.Regions.get(action.targetRegion);

      if (
        targetRegion === undefined ||
        GameState.Inventory.Count(action.entity) < action.beltLength ||
        RemainingRegionBuildingCapacity(currentRegion) <= 0 ||
        RemainingRegionBuildingCapacity(targetRegion) <= 0
      ) {
        console.log("Not enough belts");
        break;
      }
      const fromRegion = currentRegion,
        toRegion = targetRegion;
      // Add to list of belt lines
      // Add building to each region's list of buildings
      const [beltLine, fromDepot, toDepot] = NewBeltLinePair(
        fromRegion,
        toRegion,
        action.entity,
        100
      );
      if (GameState.BeltLines.has(beltLine.beltLineId)) {
        throw new Error("Duplicate BeltLine ID");
      }
      fromRegion.Buildings.push(fromDepot);
      toRegion.Buildings.push(toDepot);
      GameState.BeltLines.set(beltLine.beltLineId, beltLine);
      GameState.Inventory.Remove(NewEntityStack(action.entity, 0, 1), 100);
      break;

    case "PlaceBuilding":
      if (
        GameState.Inventory.Count(action.entity) <= 0 ||
        RemainingRegionBuildingCapacity(currentRegion) <= 0
      ) {
        break;
      }
      Buildings.push(NewBuilding(action.entity));
      GameState.Inventory.Remove(NewEntityStack(action.entity, 0, 1), 1);
      // Consume Space
      break;

    case "IncreaseBuildingCount":
      (() => {
        const b = building(action) as Producer;
        if (
          GameState.Inventory.Count(b.subkind) <= 0 ||
          RemainingRegionBuildingCapacity(currentRegion) <= 0
        ) {
          return;
        }
        GameState.Inventory.Remove(NewEntityStack(b.subkind, 0, 1), 1);

        if (b) b.BuildingCount = Math.min(50, b.BuildingCount + 1);
      })();
      break;

    case "DecreaseBuildingCount":
      (() => {
        const b = building(action) as Producer;
        if (b) {
          if (b.BuildingCount > 0) {
            GameState.Inventory.Add(NewEntityStack(b.subkind, 1, 1), 1);
            b.BuildingCount = Math.max(0, b.BuildingCount - 1);
          }
        }
      })();
      break;

    case "ToggleUpperOutputState":
      (() => {
        const b = building(action);
        if (
          !BuildingHasOutput(b?.kind) ||
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
          !BuildingHasOutput(b?.kind) ||
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

    case "TransferToInventory":
      (() => {
        const fromStack = inventoryTransferStack(action);
        if (fromStack)
          if (GameState.Inventory.CanFit(fromStack)) {
            const fromStackEntity = fromStack.Entities()[0][0];
            GameState.Inventory.AddFromItemBuffer(
              fromStack,
              fromStackEntity,
              undefined,
              false,
              false
            );
          }
      })();
      break;

    case "TransferFromInventory":
      (() => {
        const toStack = inventoryTransferStack(action);
        if (toStack) {
          toStack.AddFromItemBuffer(GameState.Inventory, action.entity);
        }
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
): ItemBuffer | undefined {
  const currentRegion = GameState.Regions.get(GameState.CurrentRegionId)!;

  switch (action.otherStackKind) {
    case "Void":
      const stackSize = GetEntity(action.entity).StackSize || 50;
      return FixedInventory([
        NewEntityStack(
          action.entity,
          action.count ?? stackSize,
          action.count ?? Infinity
        ),
      ]);

    case "MainBus":
      return currentRegion.Bus.lanes.get(action.laneId);

    case "Building":
      const b = building(action);
      if (b) {
        if (
          BuildingHasOutput(b.kind) &&
          b.outputBuffers.Count(action.entity) > 0
        ) {
          return b.outputBuffers;
        }
        if (
          BuildingHasInput(b.kind) &&
          b?.inputBuffers.Count(action.entity) > 0
        ) {
          return b.inputBuffers;
        }
      }
  }
  return;
}

function fixBeltConnections(buildings: Building[], bus: MainBus) {
  buildings.forEach((p) => {
    p.outputStatus.beltConnections.forEach((beltConn, idx) => {
      if (!bus.HasLane(beltConn.beltId))
        p.outputStatus.beltConnections.splice(idx, 1);
    });
  });
}

function fixOutputStatus(buildings: Building[]) {
  buildings.forEach((p, idx) => {
    if (p.outputStatus.above === "OUT" && !CanPushTo(p, buildings[idx - 1]))
      p.outputStatus.above = "NONE";
    if (p.outputStatus.below === "OUT" && !CanPushTo(p, buildings[idx + 1]))
      p.outputStatus.below = "NONE";
  });
}

(window as unknown as GameWindow).GameState = () => GameState;
(window as unknown as GameWindow).GameDispatch = GameDispatch;

function NewBuilding(entity: string): Building {
  switch (ProducerTypeFromEntity(entity)) {
    case "Assembler":
    case "Smelter":
    case "ChemPlant":
    case "RocketSilo":
    case "Refinery":
      return NewFactory({ subkind: entity } as any, 1);

    case "Miner":
    case "Pumpjack":
    case "WaterPump":
      return NewExtractor({ subkind: entity } as any, 1);

    case "Lab":
      return NewLab(1);

    case "Boiler":
    case "Centrifuge":
      throw new Error("Can't build this entity yet. " + entity);
    case "Depot":
      throw new Error("Wrong constructor for " + entity);
  }
}
