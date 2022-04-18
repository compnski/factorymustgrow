import {
  Building,
  BuildingSlot,
  InserterId,
  NewBuildingSlot,
  NewEmptyLane,
  NextEmptySlot,
} from "./building";
import { fixInserters } from "./factoryGame";
import { GameAction, InventoryTransferAction } from "./GameAction";
import { GetEntity } from "./gen/entities";
import { GetResearch } from "./gen/research";
import { GameWindow } from "./globals";
import { Inserter } from "./inserter";
import { FixedInventory } from "./inventory";
import { CanPushTo } from "./movement";
import {
  Factory,
  NewExtractor,
  NewFactory,
  ProducerTypeFromEntity,
  UpdateBuildingRecipe,
} from "./production";
import { GetRegionInfo, RemainingRegionBuildingCapacity } from "./region";
import { NewLab } from "./research";
import { Chest, NewChest, UpdateChestSize } from "./storage";
import {
  BeltLineDepot,
  FindDepotForBeltLineInRegion,
  NewBeltLinePair,
} from "./transport";
import {
  ItemBuffer,
  NewEntityStack,
  NewRegionFromInfo,
  Producer,
  Region,
} from "./types";
import { GameState, GetRegion, ResetGameState } from "./useGameState";
import { BuildingHasInput, BuildingHasOutput, showUserError } from "./utils";

export const GameDispatch = (action: GameAction) => {
  switch (action.type) {
    case "Reset":
      ResetGameState();
      window.scrollTo(0, 0);
      break;

    case "RemoveLane":
      removeLane(GetRegion(action.regionId), action);
      break;

    case "AddLane":
      GetRegion(action.regionId).Bus.AddLane(action.entity);
      break;

    case "ChangeResearch":
      if (action.producerName) {
        console.log("Set research to ", action.producerName);
        GameState.Research.CurrentResearchId = action.producerName;
      }
      break;

    case "CompleteResearch":
      completeResearch();
      break;

    case "NewLab":
      AddBuildingOverEmptyOrAtEnd(GetRegion(action.regionId), NewLab());
      break;

    case "ChangeRecipe":
      changeRecipe(action);
      break;

    case "ReorderBuildings":
      ReorderBuildings(action, GetRegion(action.regionId));
      break;

    case "RemoveBuilding":
      RemoveBuilding(action, GetRegion(action.regionId));
      break;

    case "PlaceBeltLine":
      PlaceBeltLine(action, GetRegion(action.regionId));
      break;

    case "PlaceBuilding":
      PlaceBuilding(action, GetRegion(action.regionId));
      break;

    case "IncreaseBuildingCount":
      increaseBuildingCount(action);
      break;

    case "DecreaseBuildingCount":
      decreaseBuildingCount(action);
      break;

    case "IncreaseInserterCount":
      increaseInserterCount(action);
      break;

    case "DecreaseInserterCount":
      decreaseInserterCount(action);
      break;

    case "ToggleInserterDirection":
      toggleInserterDirection(action);
      break;

    case "RemoveMainBusConnection":
      removeMainBusConnection(action);
      break;

    case "AddMainBusConnection":
      addMainBusConnection(action);
      break;

    case "TransferToInventory":
      transferToInventory(action);
      break;

    case "TransferFromInventory":
      transferFromInventory(action);
      break;

    case "ClaimRegion":
      claimRegion(action);
      break;

    case "LaunchRocket":
      launchRocket(action);
  }
};

function changeRecipe(action: {
  buildingIdx: number;
  regionId: string;
  recipeId: string;
}) {
  const b = building(action);
  console.log("Change recipe for ", b, "to", action.recipeId);
  // Change Recipe
  // Move any Input / Output that no longer matches a buffer into inventory
  // Update input/output buffers
  if (b && (b.kind === "Factory" || b.kind === "Extractor"))
    UpdateBuildingRecipe(b, action.recipeId);
}

function launchRocket(action: {
  type: "LaunchRocket";
  regionId: string;
  buildingIdx: number;
}) {
  const b = building(action); // as Producer;
  if (!b) return;
  // If RocketSilo, then check for launch
  if (b.subkind === "rocket-silo") {
    if (b.outputBuffers.Count("rocket-part") === 100) {
      // TODO: Better launch update
      // TODO: Use actual tick for launching?
      GameState.RocketLaunchingAt = new Date().getTime();
      showUserError("Congratulations!");
      b.outputBuffers.Remove(NewEntityStack("rocket-part", 0, Infinity), 100);
    }
  }
}

function claimRegion(action: { type: "ClaimRegion"; regionId: string }) {
  if (GameState.Regions.has(action.regionId)) {
    console.log("Region already unlocked", action.regionId);
    return;
  }
  const regionInfo = GetRegionInfo(action.regionId);
  if (regionInfo) {
    GameState.Regions.set(action.regionId, NewRegionFromInfo(regionInfo));
  }
}

function transferFromInventory(
  action:
    | {
        type: "TransferToInventory" | "TransferFromInventory";
        entity: string;
        otherStackKind: "MainBus";
        laneId: number;
        regionId: string;
      }
    | {
        type: "TransferToInventory" | "TransferFromInventory";
        entity: string;
        otherStackKind: "Building"; // Update input/output buffers
        // Update input/output buffers
        buildingIdx: number;
        regionId: string;
      }
    | {
        type: "TransferToInventory" | "TransferFromInventory";
        entity: string;
        otherStackKind: "Void";
        count?: number | undefined;
      }
) {
  const toStack = inventoryTransferStack(action);
  if (toStack) {
    toStack.AddFromItemBuffer(GameState.Inventory, action.entity);
  }
}

function transferToInventory(action: InventoryTransferAction) {
  const fromStack = inventoryTransferStack(action);
  if (fromStack) {
    const fromStackEntity = action.entity;
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
}

function addMainBusConnection(action: {
  type: "AddMainBusConnection";
  regionId: string;
  buildingIdx: number;
  laneId: number;
  direction: "FROM_BUS" | "TO_BUS";
}) {
  const { laneId, direction } = action;
  const slot = buildingSlot(action),
    firstEmptyBeltConn = slot?.BeltConnections.find(
      (beltConn) => beltConn.direction === undefined
    );
  console.log("Add slot", action, firstEmptyBeltConn, slot?.BeltConnections);

  if (firstEmptyBeltConn) {
    firstEmptyBeltConn.direction = direction;
    firstEmptyBeltConn.laneId = laneId;
    firstEmptyBeltConn.Inserter.direction = direction;
    // TODO: If inserter count is 0, try to build one from inventory
    // If the current count is 0, try to build one
    if (
      firstEmptyBeltConn.Inserter.BuildingCount === 0 &&
      GameState.Inventory.Remove(
        NewEntityStack(firstEmptyBeltConn.Inserter.subkind, 0, 1),
        1
      )
    )
      firstEmptyBeltConn.Inserter.BuildingCount = 1;
  }
}

function removeMainBusConnection(action: {
  type: "RemoveMainBusConnection";
  regionId: string;
  buildingIdx: number;
  connectionIdx: number;
}) {
  const conn = buildingSlot(action)?.BeltConnections[action.connectionIdx];
  if (conn) {
    conn.laneId = undefined;
    conn.direction = undefined;
    conn.Inserter.direction = "NONE";
  }
}

function toggleInserterDirection(
  action:
    | ({
        type:
          | "IncreaseInserterCount"
          | "DecreaseInserterCount"
          | "ToggleInserterDirection";
      } & { location: "BUILDING"; regionId: string; buildingIdx: number })
    | ({
        type:
          | "IncreaseInserterCount"
          | "DecreaseInserterCount"
          | "ToggleInserterDirection";
      } & {
        location: "BELT";
        regionId: string;
        buildingIdx: number;
        connectionIdx: number;
      })
) {
  const currentRegion = GetRegion(action.regionId);

  if (action.location === "BELT") {
    const i = inserter(action),
      b = building(action);

    const beltConn =
        currentRegion.BuildingSlots[action.buildingIdx].BeltConnections[
          action.connectionIdx
        ],
      mainBusLaneId = beltConn.laneId;
    if (
      mainBusLaneId !== undefined &&
      currentRegion.Bus.HasLane(mainBusLaneId)
    ) {
      const busLane = currentRegion.Bus.lanes.get(mainBusLaneId);
      // Check if the inserter can be toggled
      // IF so, flip it
      if (i && b && busLane) {
        const canGoLeft = BuildingHasInput(b, busLane.Entities()[0][0]),
          canGoRight = BuildingHasOutput(b, busLane.Entities()[0][0]);

        if (canGoLeft && canGoRight) {
          i.direction =
            i.direction === "TO_BUS"
              ? "FROM_BUS"
              : i.direction === "FROM_BUS"
              ? "NONE"
              : "TO_BUS";
        } else if (canGoLeft) {
          i.direction = i.direction === "NONE" ? "FROM_BUS" : "NONE";
        } else if (canGoRight) {
          i.direction = i.direction === "NONE" ? "TO_BUS" : "NONE";
        }
        if (i.direction === "FROM_BUS" || i.direction === "TO_BUS") {
          beltConn.direction = i.direction;
        }
      }
    }
    return;
  }

  const topB = currentRegion.BuildingSlots[action.buildingIdx].Building,
    bottomB = currentRegion.BuildingSlots[action.buildingIdx + 1].Building,
    i = currentRegion.BuildingSlots[action.buildingIdx].Inserter;

  if (!topB || !bottomB || action.buildingIdx === undefined) return;

  console.log(CanPushTo(bottomB, topB), CanPushTo(topB, bottomB));

  const canGoUp =
      BuildingHasOutput(bottomB.kind) &&
      BuildingHasInput(topB.kind) &&
      CanPushTo(bottomB, topB),
    canGoDown =
      BuildingHasOutput(topB.kind) &&
      BuildingHasInput(bottomB.kind) &&
      CanPushTo(topB, bottomB);

  if (canGoUp && canGoDown) {
    i.direction =
      i.direction === "UP" ? "DOWN" : i.direction === "DOWN" ? "NONE" : "UP";
  } else if (canGoUp) {
    i.direction = i.direction === "NONE" ? "UP" : "NONE";
  } else if (canGoDown) {
    i.direction = i.direction === "NONE" ? "DOWN" : "NONE";
  }
}

function decreaseInserterCount(
  action:
    | ({
        type:
          | "IncreaseInserterCount"
          | "DecreaseInserterCount"
          | "ToggleInserterDirection";
      } & { location: "BUILDING"; regionId: string; buildingIdx: number })
    | ({
        type:
          | "IncreaseInserterCount"
          | "DecreaseInserterCount"
          | "ToggleInserterDirection";
      } & {
        location: "BELT";
        regionId: string;
        buildingIdx: number;
        connectionIdx: number;
      })
) {
  const i = inserter(action);

  if (i && i.BuildingCount > 0) {
    GameState.Inventory.Add(NewEntityStack(i.subkind, 1, 1), 1);
    i.BuildingCount = Math.max(0, i.BuildingCount - 1);
  }
}

function increaseInserterCount(
  action:
    | ({
        type:
          | "IncreaseInserterCount"
          | "DecreaseInserterCount"
          | "ToggleInserterDirection";
      } & { location: "BUILDING"; regionId: string; buildingIdx: number })
    | ({
        type:
          | "IncreaseInserterCount"
          | "DecreaseInserterCount"
          | "ToggleInserterDirection";
      } & {
        location: "BELT";
        regionId: string;
        buildingIdx: number;
        connectionIdx: number;
      })
) {
  const i = inserter(action);

  if (!i || GameState.Inventory.Count(i.subkind) <= 0) {
    return;
  }
  GameState.Inventory.Remove(NewEntityStack(i.subkind, 0, 1), 1);

  if (i) i.BuildingCount = Math.min(50, i.BuildingCount + 1);
}

function decreaseBuildingCount(action: {
  type: "RemoveBuilding" | "IncreaseBuildingCount" | "DecreaseBuildingCount";
  regionId: string;
  buildingIdx: number;
}) {
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
    if (b?.kind === "Chest") UpdateChestSize(b as Chest);
    // TODO: If factory, reduce ProgressTracker and refund materials
    // NOTE: Only if progressTracker == BuildingCount
    //if (b?.kind === "Factory") RemoveProgressTracker(b as Factory);
  }
}

function increaseBuildingCount(action: {
  type: "RemoveBuilding" | "IncreaseBuildingCount" | "DecreaseBuildingCount";
  regionId: string;
  buildingIdx: number;
}) {
  const b = building(action) as Producer;
  // TODO: Handle belt lines
  if (b?.kind === "BeltLineDepot") {
    console.log("Can't add lanes to beltlines");
    return;
  }
  if (GameState.Inventory.Count(b.subkind) <= 0) {
    return;
  }
  GameState.Inventory.Remove(NewEntityStack(b.subkind, 0, 1), 1);

  if (b) b.BuildingCount = Math.min(50, b.BuildingCount + 1);
  if (b?.kind === "Chest") UpdateChestSize(b as Chest);
}

function completeResearch() {
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
}

function removeLane(
  currentRegion: Region,
  action: { type: "RemoveLane"; laneId: number }
) {
  const lane = currentRegion.Bus.RemoveLane(action.laneId),
    laneEntity = lane?.Entities()[0][0];

  if (lane && laneEntity)
    GameState.Inventory.AddFromItemBuffer(lane, laneEntity, Infinity, true);

  // Remove attached inserters
  currentRegion.BuildingSlots.forEach((buildingSlot, buildingSlotIdx) => {
    buildingSlot.BeltConnections.forEach((beltConn, beltConnIdx) => {
      if (beltConn.laneId === action.laneId) {
        GameDispatch({
          type: "RemoveMainBusConnection",
          buildingIdx: buildingSlotIdx,
          connectionIdx: beltConnIdx,
          regionId: currentRegion.Id,
        });
      }
    });
  });
}

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
  const buildAtIdx: number | undefined =
    action.buildingIdx ?? NextEmptySlot(currentRegion.BuildingSlots);
  const newBuilding = NewBuilding(action.entity);
  AddBuildingOverEmptyOrAtEnd(currentRegion, newBuilding, buildAtIdx);

  GameState.Inventory.Remove(NewEntityStack(action.entity, 0, 1), 1);
  // TODO: Show recipe selector
  // TODO: Finish default building recipes
  if (action.entity === "rocket-silo") {
    UpdateBuildingRecipe(newBuilding as Factory, "rocket-part");
  }
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

export function AddBuildingOverEmptyOrAtEnd(
  region: { BuildingSlots: BuildingSlot[] },
  b: Building,
  buildingIdx?: number
): BuildingSlot {
  const buildingSlot = NewBuildingSlot(b);
  if (
    buildingIdx !== undefined &&
    region.BuildingSlots[buildingIdx]?.Building.kind === "Empty"
  ) {
    region.BuildingSlots[buildingIdx] = buildingSlot;
  } else {
    region.BuildingSlots.push(buildingSlot);
  }
  return buildingSlot;
}

function ReorderBuildings(
  action: {
    type: "ReorderBuildings";
    regionId: string;
    buildingIdx: number;
    dropBuildingIdx: number;
    isDropOnLastBuilding: boolean;
  },
  region: { BuildingSlots: BuildingSlot[] }
) {
  const b = building(action);
  if (!b) return;
  // if dropBuilding is the last building AND it's not an empty lane,
  //  then move building to end
  // Otherwise, if not an empty lane, skip (it should never be)
  // If it is an empty lane, swap with the building
  //
  const targetBuilding = building({
      regionId: action.regionId,
      buildingIdx: action.dropBuildingIdx,
    }),
    targetIsEmptyLane = targetBuilding?.kind === "Empty",
    targetIsLastBuilding = action.isDropOnLastBuilding;

  if (targetIsEmptyLane) {
    region.BuildingSlots[action.dropBuildingIdx].Building = b;
    region.BuildingSlots[action.buildingIdx].Building = NewEmptyLane();
  } else if (targetIsLastBuilding) {
    region.BuildingSlots[action.buildingIdx].Building = NewEmptyLane();
    AddBuildingOverEmptyOrAtEnd(region, b);
  }
  fixInserters(region);
}

const allowRemoveEmpty = false;
function RemoveBuilding(
  action: {
    type: "RemoveBuilding" | "IncreaseBuildingCount" | "DecreaseBuildingCount";
    regionId: string;
    buildingIdx: number;
  },
  currentRegion: Region
) {
  const b = building(action); // as Producer;
  if (b) {
    currentRegion.BuildingSlots[action.buildingIdx].Building = NewEmptyLane();
    for (let idx = currentRegion.BuildingSlots.length - 1; idx >= 0; idx--) {
      // Removing the last building and it's an empty lane.
      if (
        allowRemoveEmpty &&
        currentRegion.BuildingSlots[idx].Building.kind === "Empty"
      ) {
        const [slot] = currentRegion.BuildingSlots.splice(idx, 1);
        const inserter = slot && slot.Inserter;
        // Refund inserters
        if (inserter)
          GameState.Inventory.Add(
            NewEntityStack(inserter.subkind, inserter.BuildingCount),
            inserter.BuildingCount,
            true
          );
        slot.BeltConnections.forEach((beltConn) => {
          GameState.Inventory.Add(
            NewEntityStack(
              beltConn.Inserter.subkind,
              beltConn.Inserter.BuildingCount
            ),
            beltConn.Inserter.BuildingCount,
            true
          );
        });
      } else {
        // Until there are no more empty ones
        break;
      }
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
        otherRegion = GameState.Regions.get(depot.otherRegionId);
      if (!otherRegion)
        throw new Error("Cannot find region " + depot.otherRegionId);
      const otherDepot = FindDepotForBeltLineInRegion(
        otherRegion,
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
  let b: Building | undefined;
  switch (action.otherStackKind) {
    case "Void":
      return FixedInventory([
        NewEntityStack(
          action.entity,
          action.count ?? (GetEntity(action.entity).StackSize || 50),
          action.count ?? Infinity
        ),
      ]);

    case "MainBus":
      return GameState.Regions.get(action.regionId)?.Bus.lanes.get(
        action.laneId
      );

    case "Building":
      b = building(action);
      if (b) {
        if (
          BuildingHasOutput(b.kind) &&
          (b.outputBuffers.AvailableSpace(action.entity) > 0 ||
            b.outputBuffers.Count(action.entity) > 0)
        ) {
          return b.outputBuffers;
        }
        if (
          BuildingHasInput(b.kind) &&
          (b?.inputBuffers.AvailableSpace(action.entity) > 0 ||
            b?.inputBuffers.Count(action.entity) > 0)
        ) {
          return b.inputBuffers;
        }
      }
  }
  return;
}

export function NewBuilding(entity: string): Building {
  switch (ProducerTypeFromEntity(entity)) {
    case "Assembler":
    case "Smelter":
    case "ChemPlant":
    case "RocketSilo":
    case "Refinery":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return NewFactory({ subkind: entity } as any, 1);

    case "Miner":
    case "Pumpjack":
    case "WaterPump":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return NewExtractor({ subkind: entity } as any, 1);

    case "Lab":
      return NewLab(1);

    case "Chest":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return NewChest({ subkind: entity } as any, 1);

    case "Empty":
      return NewEmptyLane();

    case "Boiler":
    case "Centrifuge":
      throw new Error("Can't build this entity yet. " + entity);
    case "Depot":
      throw new Error("Wrong constructor for " + entity);
  }
}

function building(action: {
  buildingIdx?: number;
  regionId: string;
}): Building | undefined {
  const currentRegion = GetRegion(action.regionId);

  return action.buildingIdx !== undefined
    ? currentRegion.BuildingSlots[action.buildingIdx].Building
    : undefined;
}

function inserter(action: InserterId): Inserter | undefined {
  console.log(JSON.stringify(action));
  const currentRegion = GetRegion(action.regionId);

  return action.location === "BUILDING"
    ? currentRegion.BuildingSlots[action.buildingIdx].Inserter
    : currentRegion.BuildingSlots[action.buildingIdx].BeltConnections[
        action.connectionIdx
      ].Inserter;
}

function buildingSlot(action: {
  regionId: string;
  buildingIdx?: number;
}): BuildingSlot | undefined {
  const currentRegion = GetRegion(action.regionId);

  return action.buildingIdx !== undefined
    ? currentRegion.BuildingSlots[action.buildingIdx]
    : undefined;
}

(window as unknown as GameWindow).GameDispatch = GameDispatch;
