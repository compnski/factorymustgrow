import {
  NewExtractor,
  NewFactory,
  ProducerTypeFromEntity,
  UpdateBuildingRecipe,
} from "./production";
import {
  NewEntityStack,
  Producer,
  NewRegionFromInfo,
  ItemBuffer,
  Region,
} from "./types";
import { GetEntity } from "./gen/entities";
import { CanPushTo } from "./movement";
import { NewLab } from "./research";
import { GetResearch } from "./gen/research";
import { BuildingHasInput, BuildingHasOutput } from "./utils";
import { GameWindow } from "./globals";
import { GetRegionInfo, RemainingRegionBuildingCapacity } from "./region";
import { Building, NewEmptyLane } from "./building";
import { GameState } from "./useGameState";
import { ResetGameState } from "./useGameState";
import {
  BeltLineDepot,
  FindDepotForBeltLineInRegion,
  NewBeltLinePair,
} from "./transport";
import { FixedInventory } from "./inventory";
import { NewChest } from "./storage";
import { GameAction, InventoryTransferAction } from "./GameAction";
import { fixOutputStatus } from "./factoryGame";

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
      AddBuildingOverEmptyOrAtEnd(currentRegion, NewLab());
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
      ReorderBuildings(action, currentRegion);
      break;

    case "RemoveBuilding":
      RemoveBuilding(action, currentRegion);
      break;

    case "PlaceBeltLine":
      PlaceBeltLine(action, currentRegion);
      break;

    case "PlaceBuilding":
      PlaceBuilding(action, currentRegion);
      break;

    case "IncreaseBuildingCount":
      (() => {
        const b = building(action) as Producer;
        // TODO: Handle belt lines
        if (b?.kind === "BeltLineDepot") {
          console.log("Can't add lanes to beltlines");
          return;
        }
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
        // TODO: Handle belt lines
        if (b?.kind === "BeltLineDepot") {
          console.log("Can't remove lanes to beltlines");
          return;
        }

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
        if (fromStack) {
          const fromStackEntity = fromStack.Entities()[0][0];
          if (GameState.Inventory.AvailableSpace(fromStackEntity) > 0) {
            GameState.Inventory.AddFromItemBuffer(
              fromStack,
              fromStackEntity,
              undefined,
              false,
              false
            );
          }
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

function PlaceBuilding(
  action: {
    type: "PlaceBuilding";
    entity: string;
    buildingIdx?: number | undefined;
  },
  currentRegion: Region
) {
  if (
    GameState.Inventory.Count(action.entity) <= 0 ||
    RemainingRegionBuildingCapacity(currentRegion) <= 0
  ) {
    return;
  }
  // if buildingIdx, and buildingIDx is empty, then build it here.
  const newBuilding = NewBuilding(action.entity);
  AddBuildingOverEmptyOrAtEnd(currentRegion, newBuilding, action.buildingIdx);

  GameState.Inventory.Remove(NewEntityStack(action.entity, 0, 1), 1);
}

function PlaceBeltLine(
  action: {
    type: "PlaceBeltLine";
    entity: "transport-belt" | "fast-transport-belt" | "express-transport-belt";
    beltLength: number;
    targetRegion: string;
    buildingIdx?: number;
  },
  currentRegion: Region
) {
  // TODO: Check for any orphan beltlines that could connect here.

  const targetRegion = GameState.Regions.get(action.targetRegion);

  if (
    targetRegion === undefined ||
    GameState.Inventory.Count(action.entity) < action.beltLength ||
    RemainingRegionBuildingCapacity(currentRegion) <= 0 ||
    RemainingRegionBuildingCapacity(targetRegion) <= 0
  ) {
    console.log("Not enough belts");
    return;
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
  // If buildingIdx is set, and points to an Empty Lane, replace it.
  AddBuildingOverEmptyOrAtEnd(fromRegion, fromDepot, action.buildingIdx);
  AddBuildingOverEmptyOrAtEnd(toRegion, toDepot, (action.buildingIdx || 0) + 1);

  GameState.BeltLines.set(beltLine.beltLineId, beltLine);
  GameState.Inventory.Remove(NewEntityStack(action.entity, 0, 100), 100);
}

function AddBuildingOverEmptyOrAtEnd(
  region: { Inserters: Inserter[]; Buildings: Building[] },
  b: Building,
  buildingIdx?: number
) {
  if (
    buildingIdx !== undefined &&
    region.Buildings[buildingIdx]?.kind === "Empty"
  ) {
    region.Buildings[buildingIdx] = b;
  } else {
    region.Buildings.push(b);
    if (region.Buildings.length > 1) region.Inserters.push(NewInserter());
  }
}

function ReorderBuildings(
  action: {
    type: "ReorderBuildings";
    buildingIdx: number;
    dropBuildingIdx: number;
    isDropOnLastBuilding: boolean;
  },
  region: { Inserters: Inserter[]; Buildings: Building[] }
) {
  (() => {
    const b = building(action);
    if (!b) return;
    // if dropBuilding is the last building AND it's not an empty lane,
    //  then move building to end
    // Otherwise, if not an empty lane, skip (it should never be)
    // If it is an empty lane, swap with the building
    //
    const targetBuilding = building({
        buildingIdx: action.dropBuildingIdx,
      }),
      targetIsEmptyLane = targetBuilding?.kind === "Empty",
      targetIsLastBuilding = action.isDropOnLastBuilding;

    if (targetIsEmptyLane) {
      region.Buildings[action.dropBuildingIdx] = b;
      region.Buildings[action.buildingIdx] = NewEmptyLane();
    } else if (targetIsLastBuilding) {
      region.Buildings[action.buildingIdx] = NewEmptyLane();
      AddBuildingOverEmptyOrAtEnd(region, b);
    }
    fixOutputStatus(region);
  })();
}

function RemoveBuilding(
  action: {
    type:
      | "RemoveBuilding"
      | "IncreaseBuildingCount"
      | "DecreaseBuildingCount"
      | "ToggleUpperOutputState"
      | "ToggleLowerOutputState";
    buildingIdx: number;
  },
  currentRegion: Region
) {
  const b = building(action); // as Producer;
  if (b) {
    if (
      // Removing the last building and it's an empty lane.
      b.kind === "Empty" &&
      action.buildingIdx === currentRegion.Buildings.length - 1
    ) {
      // Remove last empty lane
      currentRegion.Buildings.splice(action.buildingIdx, 1);
    } else {
      // Replace with Empty Lane
      currentRegion.Buildings.splice(action.buildingIdx, 1, NewEmptyLane());
    }

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
          b.BuildingCount * beltLine.length
        );
        beltLine.sharedBeltBuffer.forEach((es) => {
          if (es && es.Entity) GameState.Inventory.Add(es, Infinity, true);
        });
        GameState.BeltLines.delete(beltLine.beltLineId);
      }
    } else {
      if (b.BuildingCount > 0)
        GameState.Inventory.Add(
          NewEntityStack(b.subkind, b.BuildingCount),
          b.BuildingCount,
          true
        );
    }
    // Return space
  }
}

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
          b?.inputBuffers.AvailableSpace(action.entity) > 0
        ) {
          return b.inputBuffers;
        }
      }
  }
  return;
}

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

    case "Chest":
      return NewChest({ subkind: entity } as any);

    case "Empty":
      return NewEmptyLane();

    case "Boiler":
    case "Centrifuge":
      throw new Error("Can't build this entity yet. " + entity);
    case "Depot":
      throw new Error("Wrong constructor for " + entity);
  }
}

function building(action: { buildingIdx?: number }): Building | undefined {
  const currentRegion = GameState.Regions.get(GameState.CurrentRegionId)!;

  return action.buildingIdx !== undefined
    ? currentRegion.Buildings[action.buildingIdx]
    : undefined;
}
(window as unknown as GameWindow).GameDispatch = GameDispatch;
