import { HasProgressTrackers } from "./AddProgressTracker";
import {
  Building,
  findFirstEmptyLane,
  InserterId,
  NewEmptyLane,
} from "./building";
import { fixInserters } from "./factoryGame";
import { GameAction, InventoryTransferAction } from "./GameAction";
import { GetEntity, MaybeGetRecipe } from "./gen/entities";
import { GetResearch } from "./gen/research";
import { Inserter } from "./inserter";
import { CanPushTo, moveToInventory } from "./movement";
import { NewExtractor, NewFactory, ProducerTypeFromEntity } from "./production";
import { GetRegionInfo, RemainingRegionBuildingCapacity } from "./region";
import { NewLab } from "./research";
import { DispatchFunc } from "./stateVm";
import { StateAddress } from "./state/address";
import { NewChest } from "./storage";
import { Producer } from "./types";
import {
  FactoryGameState,
  ReadonlyBuilding,
  ReadonlyBuildingSlot,
  ReadonlyRegion,
} from "./factoryGameState";
import { BuildingHasInput, BuildingHasOutput, showUserError } from "./utils";

export function GetRegion(
  gameState: FactoryGameState,
  regionId: string
): ReadonlyRegion {
  const r = gameState.Regions.get(regionId);
  if (!r) throw new Error(`No region found for ${regionId}`);
  return r;
}

export const GameDispatch = (
  dispatch: DispatchFunc,
  gameState: FactoryGameState,
  action: GameAction
) => {
  console.log(action);
  switch (action.type) {
    case "UpdateState":
      dispatch(action.action);
      break;

    case "Reset":
      dispatch({ kind: "Reset" });
      window.scrollTo(0, 0);
      break;

    case "ResetTo":
      dispatch({ kind: "ResetTo", state: action.state });
      window.scrollTo(0, 0);
      break;

    case "RemoveLane":
      removeLane(
        dispatch,
        GetRegion(gameState, action.regionId),
        action,
        gameState
      );
      break;

    case "AddLane":
      dispatch({
        kind: "AddMainBusLane",
        address: {
          regionId: action.regionId,
          laneId: action.laneId,
          upperSlotIdx: action.upperSlotIdx,
        },
        lowerSlotIdx: action.lowerSlotIdx,
        beltDirection: action.beltDirection,
      });
      break;

    case "SetLaneEntity":
      dispatch({
        kind: "SetProperty",
        address: {
          regionId: action.regionId,
          laneId: action.laneId,
          upperSlotIdx: action.upperSlotIdx,
        },
        property: "entity",
        value: action.entity,
      });
      break;

    case "ChangeResearch":
      if (action.producerName) {
        dispatch({
          kind: "SetCurrentResearch",
          researchId: action.producerName,
        });
      }
      break;

    case "CompleteResearch":
      completeResearch(dispatch, gameState);
      break;

    case "ChangeRecipe":
      dispatch({
        kind: "SetRecipe",
        address: action,
        recipeId: action.recipeId,
      });
      break;

    case "ReorderBuildings":
      ReorderBuildings(dispatch, action, GetRegion(gameState, action.regionId));
      break;

    case "RemoveBuilding":
      RemoveBuilding(dispatch, action, gameState);
      break;

    case "PlaceTruckLine":
      PlaceTruckLine(
        dispatch,
        action,
        GetRegion(gameState, action.regionId),
        gameState
      );
      break;

    case "PlaceBuilding":
      PlaceBuilding(dispatch, action, gameState);
      break;

    case "IncreaseBuildingCount":
      increaseBuildingCount(dispatch, action, gameState);
      break;

    case "DecreaseBuildingCount":
      decreaseBuildingCount(dispatch, action, gameState);
      break;

    case "IncreaseInserterCount":
      increaseInserterCount(dispatch, action, gameState);
      break;

    case "DecreaseInserterCount":
      decreaseInserterCount(dispatch, action, gameState);
      break;

    case "ToggleInserterDirection":
      toggleInserterDirection(
        dispatch,
        action,
        GetRegion(gameState, action.regionId),
        gameState
      );
      break;

    case "RemoveMainBusConnection":
      removeMainBusConnection(dispatch, action, gameState);
      break;

    case "AddMainBusConnection":
      addMainBusConnection(dispatch, action, gameState);
      break;

    case "TransferToInventory":
      transferToInventory(dispatch, gameState, action);
      break;

    case "TransferFromInventory":
      transferFromInventory(dispatch, gameState, action);
      break;

    case "ClaimRegion":
      if (gameState.Regions.has(action.regionId)) {
        showUserError(`Region ${action.regionId} already unlocked.`);
        return;
      }
      dispatch({
        kind: "AddRegion",
        regionId: action.regionId,
        regionInfo: GetRegionInfo(action.regionId),
      });
      break;

    case "LaunchRocket":
      launchRocket(dispatch, action, gameState);
  }
};

function launchRocket(
  dispatch: DispatchFunc,
  {
    regionId,
    buildingIdx,
  }: {
    regionId: string;
    buildingIdx: number;
  },
  gameState: FactoryGameState
) {
  const b = building(gameState, { buildingIdx, regionId }); // as Producer;
  if (!b) return;
  // If RocketSilo, then check for launch
  if (b.subkind === "rocket-silo") {
    if (b.outputBuffers.Count("rocket-part") === 100) {
      // TODO: Better launch update
      // TODO: Use actual tick for launching?
      showUserError("Congratulations!");

      dispatch({
        kind: "SetProperty",
        address: "global",
        property: "RocketLaunchingAt",
        value: Date.now(),
      });
      dispatch({
        kind: "AddItemCount",
        address: { regionId, buildingIdx, buffer: "output" },
        count: -100,
        entity: "rocket-part",
      });
    }
  }
}

function transferFromInventory(
  dispatch: DispatchFunc,
  gameState: FactoryGameState,
  action: InventoryTransferAction
) {
  const target = addressAndCountForTransfer(gameState, action, "to");
  const entity = GetEntity(action.entity);
  const count = Math.min(
    target.count || 0,
    gameState.Inventory.Count(action.entity),
    entity.StackSize
  );

  if (count) {
    if (!target.address)
      return moveToInventory(dispatch, action.entity, -count);
    moveToInventory(dispatch, action.entity, -count, target.address);
  }
}

function transferToInventory(
  dispatch: DispatchFunc,
  gameState: FactoryGameState,
  action: InventoryTransferAction
) {
  const target = addressAndCountForTransfer(gameState, action, "from");
  const entity = GetEntity(action.entity);
  const count = Math.min(
    target.count || 0,
    gameState.Inventory.AvailableSpace(action.entity),
    entity.StackSize
  );

  if (count) {
    if (!target.address) return moveToInventory(dispatch, action.entity, count);
    moveToInventory(dispatch, action.entity, count, target.address);
  }
}

function addMainBusConnection(
  dispatch: DispatchFunc,
  action: {
    type: "AddMainBusConnection";
    regionId: string;
    buildingIdx: number;
    laneId: number;
    direction: "FROM_BUS" | "TO_BUS";
  },
  gameState: FactoryGameState
) {
  const { laneId, direction, regionId, buildingIdx } = action;
  const slot = buildingSlot(gameState, action);
  if (!slot) throw new Error("Can't find building slot");
  const connectionIdx = slot.BeltConnections.findIndex(
    (beltConn) => beltConn.Inserter.direction === "NONE"
  );

  console.log("Add slot", action, connectionIdx, slot?.BeltConnections);

  if (connectionIdx < 0) {
    showUserError("No slots");
    return;
  }
  dispatch({
    kind: "SetProperty",
    address: { regionId, buildingIdx, connectionIdx },
    property: "laneId",
    value: laneId,
  });

  dispatch({
    kind: "SetProperty",
    address: { regionId, buildingIdx, location: "BELT", connectionIdx },
    property: "direction",
    value: direction,
  });
  const inserter = slot.BeltConnections[connectionIdx].Inserter;
  if (
    inserter.BuildingCount === 0 &&
    gameState.Inventory.Count(inserter.subkind) > 1
  ) {
    dispatch({
      kind: "SetProperty",
      address: { regionId, buildingIdx, location: "BELT", connectionIdx },
      property: "BuildingCount",
      value: 1,
    });
    moveToInventory(dispatch, inserter.subkind, -1);
  }
}

function removeMainBusConnection(
  dispatch: DispatchFunc,
  action: {
    regionId: string;
    buildingIdx: number;
    connectionIdx: number;
  },
  gameState: FactoryGameState
) {
  const conn = buildingSlot(gameState, action)?.BeltConnections[
    action.connectionIdx
  ];

  if (!conn) throw new Error("Cannot find belt connection");

  const { regionId, buildingIdx, connectionIdx } = action;

  dispatch({
    kind: "SetProperty",
    address: { regionId, buildingIdx, connectionIdx },
    property: "laneId",
    value: undefined,
  });

  dispatch({
    kind: "SetProperty",
    address: { regionId, buildingIdx, location: "BELT", connectionIdx },
    property: "direction",
    value: "NONE",
  });

  const inserter = conn.Inserter;
  dispatch({
    kind: "SetProperty",
    address: { regionId, buildingIdx, location: "BELT", connectionIdx },
    property: "BuildingCount",
    value: 0,
  });
  moveToInventory(dispatch, inserter.subkind, inserter.BuildingCount);
}

function toggleBeltInserterDirection(
  dispatch: DispatchFunc,
  action: {
    location: "BELT";
    regionId: string;
    buildingIdx: number;
    connectionIdx: number;
  },
  gameState: FactoryGameState
) {
  const i = inserter(gameState, action),
    b = building(gameState, action);
  const region = GetRegion(gameState, action.regionId);
  const beltConn =
      region.BuildingSlots[action.buildingIdx].BeltConnections[
        action.connectionIdx
      ],
    mainBusLaneId = beltConn.laneId;

  if (mainBusLaneId !== undefined) {
    const busLane = region.Bus.Belts.find(
      (belt) =>
        belt.laneIdx == beltConn.laneId &&
        action.buildingIdx >= belt.upperSlotIdx &&
        action.buildingIdx <= belt.lowerSlotIdx
    );
    // Check if the inserter can be toggled
    // IF so, flip it
    if (i && b && busLane) {
      const canGoLeft = BuildingHasInput(b, busLane.entity),
        canGoRight = BuildingHasOutput(b, busLane.entity);
      const newDirection =
        canGoLeft && canGoRight
          ? i.direction === "TO_BUS"
            ? "FROM_BUS"
            : i.direction === "FROM_BUS"
            ? "NONE"
            : "TO_BUS"
          : canGoLeft
          ? i.direction === "NONE"
            ? "FROM_BUS"
            : "NONE"
          : canGoRight
          ? i.direction === "NONE"
            ? "TO_BUS"
            : "NONE"
          : "NONE";
      dispatch({
        kind: "SetProperty",
        address: { ...action, location: "BELT" },
        property: "direction",
        value: newDirection,
      });
    }
  }
}

function toggleInserterDirection(
  dispatch: DispatchFunc,
  action:
    | { location: "BUILDING"; regionId: string; buildingIdx: number }
    | {
        location: "BELT";
        regionId: string;
        buildingIdx: number;
        connectionIdx: number;
      },
  region: ReadonlyRegion,
  gameState: FactoryGameState
) {
  if (action.location === "BELT")
    return toggleBeltInserterDirection(dispatch, action, gameState);
  else return toggleBuildingInserterDirection(dispatch, action, gameState);
}

function toggleBuildingInserterDirection(
  dispatch: DispatchFunc,
  action: { location: "BUILDING"; regionId: string; buildingIdx: number },
  gameState: FactoryGameState
) {
  const { regionId, buildingIdx, location } = action;
  const region = GetRegion(gameState, action.regionId);
  const topB = building(gameState, action);
  const bottomB = region.BuildingSlots[action.buildingIdx + 1].Building;
  const i = inserter(gameState, action);

  if (!topB || !bottomB || !i || action.buildingIdx === undefined) return;

  const canGoUp =
      BuildingHasOutput(bottomB.kind) &&
      BuildingHasInput(topB.kind) &&
      CanPushTo(bottomB, topB),
    canGoDown =
      BuildingHasOutput(topB.kind) &&
      BuildingHasInput(bottomB.kind) &&
      CanPushTo(topB, bottomB);

  const newDirection =
    canGoUp && canGoDown
      ? i.direction === "UP"
        ? "DOWN"
        : i.direction === "DOWN"
        ? "NONE"
        : "UP"
      : canGoUp
      ? i.direction === "NONE"
        ? "UP"
        : "NONE"
      : canGoDown
      ? i.direction === "NONE"
        ? "DOWN"
        : "NONE"
      : i.direction;

  dispatch({
    kind: "SetProperty",
    address: { regionId, buildingIdx, location },
    property: "direction",
    value: newDirection,
  });
  if (
    i.BuildingCount == 0 &&
    newDirection != "NONE" &&
    newDirection != i.direction &&
    gameState.Inventory.Count(i.subkind) > 0
  ) {
    dispatch({
      kind: "SetProperty",
      address: { regionId, buildingIdx, location },
      property: "BuildingCount",
      value: 1,
    });
    moveToInventory(dispatch, i.subkind, -1);
  }
}

function decreaseInserterCount(
  dispatch: DispatchFunc,
  action:
    | { location: "BUILDING"; regionId: string; buildingIdx: number }
    | {
        location: "BELT";
        regionId: string;
        buildingIdx: number;
        connectionIdx: number;
      },
  gameState: FactoryGameState,
  count = 1
) {
  const { regionId, buildingIdx, location } = action;
  const i = inserter(gameState, action);

  if (i && i.BuildingCount > 0) {
    if (location == "BELT")
      i.BuildingCount = Math.max(0, i.BuildingCount - count);
    else
      dispatch({
        kind: "SetProperty",
        address: { regionId, buildingIdx, location: "BUILDING" },
        property: "BuildingCount",
        value: Math.max(i.BuildingCount - count, 0),
      });
    moveToInventory(dispatch, i.subkind, count);
  }
}

function increaseInserterCount(
  dispatch: DispatchFunc,
  action:
    | { location: "BUILDING"; regionId: string; buildingIdx: number }
    | {
        location: "BELT";
        regionId: string;
        buildingIdx: number;
        connectionIdx: number;
      },
  gameState: FactoryGameState,
  count = 1
) {
  const i = inserter(gameState, action);
  const { regionId, buildingIdx, location } = action;

  if (
    !i ||
    gameState.Inventory.Count(i.subkind) <= 0 ||
    i.BuildingCount >= 50
  ) {
    return;
  }
  const newCount = Math.min(50, i.BuildingCount + count);
  if (newCount == i.BuildingCount) return;
  if (location == "BELT") i.BuildingCount = newCount;
  else
    dispatch({
      kind: "SetProperty",
      address: { regionId, buildingIdx, location: "BUILDING" },
      property: "BuildingCount",
      value: newCount,
    });
  moveToInventory(dispatch, i.subkind, i.BuildingCount - newCount);
}

function decreaseBuildingCount(
  dispatch: DispatchFunc,
  action: {
    regionId: string;
    buildingIdx: number;
  },
  gameState: FactoryGameState
) {
  const b = building(gameState, action) as Producer;
  // TODO: Handle belt lines
  if (b?.kind === "TruckLineDepot") {
    console.log("Can't remove lanes to beltlines");
    return;
  }

  if (!b || b.BuildingCount <= 0) return;
  const newCount = Math.max(0, b.BuildingCount - 1);
  dispatch({
    kind: "SetProperty",
    address: action,
    property: "BuildingCount",
    value: newCount,
  });
  moveToInventory(dispatch, b.subkind, b.BuildingCount - newCount);

  if (HasProgressTrackers(b) && b.progressTrackers.length > newCount)
    // Reduce ProgressTracker and refund materials
    // NOTE: Only if progressTracker == BuildingCount
    dispatch({
      kind: "AddProgressTrackers",
      address: action,
      count: newCount - b.BuildingCount,
      currentTick: 0,
    });
}

function increaseBuildingCount(
  dispatch: DispatchFunc,
  action: {
    regionId: string;
    buildingIdx: number;
  },
  gameState: FactoryGameState
) {
  const b = building(gameState, action) as Producer;
  // TODO: Handle belt lines
  if (b?.kind === "TruckLineDepot") {
    console.log("Can't add lanes to beltlines");
    return;
  }
  if (gameState.Inventory.Count(b.subkind) <= 0) {
    return;
  }
  if (!b || b.BuildingCount >= 50) return;
  const newCount = Math.min(50, b.BuildingCount + 1);
  dispatch({
    kind: "SetProperty",
    address: action,
    property: "BuildingCount",
    value: newCount,
  });
  moveToInventory(dispatch, b.subkind, b.BuildingCount - newCount);
}

function completeResearch(dispatch: DispatchFunc, gameState: FactoryGameState) {
  const currentResearchId = gameState.Research.CurrentResearchId;
  const r = GetResearch(currentResearchId);
  if (r)
    dispatch({
      kind: "AddResearchCount",
      count: Infinity,
      researchId: currentResearchId,
      maxCount: r.ProductionRequiredForCompletion,
    });
}

function removeLane(
  dispatch: DispatchFunc,
  currentRegion: ReadonlyRegion,
  action: {
    type: "RemoveLane";
    laneId: number;
    upperSlotIdx: number;
    lowerSlotIdx: number;
  },
  gameState: FactoryGameState
) {
  //throw new Error("NYI");
  dispatch({
    kind: "RemoveMainBusLane",
    address: {
      regionId: currentRegion.Id,
      laneId: action.laneId,
      upperSlotIdx: action.upperSlotIdx,
    },
  });

  // TODO: Refunds

  // for (const [entity, count] of currentRegion.Bus.Lane(
  //   action.laneId
  // ).Entities()) {
  //   if (count > 0) moveToInventory(dispatch, entity, count);
  // }

  // Remove attached inserters
  currentRegion.BuildingSlots.forEach((buildingSlot, buildingSlotIdx) => {
    if (
      buildingSlotIdx >= action.upperSlotIdx &&
      buildingSlotIdx <= action.lowerSlotIdx
    )
      buildingSlot.BeltConnections.forEach((beltConn, beltConnIdx) => {
        if (beltConn.laneId === action.laneId) {
          removeMainBusConnection(
            dispatch,
            {
              buildingIdx: buildingSlotIdx,
              connectionIdx: beltConnIdx,
              regionId: currentRegion.Id,
            },
            gameState
          );
        }
      });
  });
}

function PlaceBuilding(
  dispatch: DispatchFunc,
  action: {
    entity: string;
    buildingIdx: number;
    regionId: string;
  },
  gameState: FactoryGameState
) {
  const currentRegion = GetRegion(gameState, action.regionId);
  if (
    gameState.Inventory.Count(action.entity) <= 0 ||
    RemainingRegionBuildingCapacity(currentRegion) <= 0
  ) {
    return;
  }
  const { entity, buildingIdx, regionId } = action;

  dispatch({
    kind: "PlaceBuilding",
    entity,
    address: { regionId, buildingIdx },
    BuildingCount: 1,
  });

  moveToInventory(dispatch, action.entity, -1);
}

function PlaceTruckLine(
  dispatch: DispatchFunc,
  action: {
    regionId: string;
    entity: "concrete";
    beltLength: number;
    targetRegion: string;
    buildingIdx: number;
  },
  currentRegion: ReadonlyRegion,
  gameState: FactoryGameState
) {
  // TODO: Check for any orphan beltlines that could connect here.
  const targetRegion = gameState.Regions.get(action.targetRegion);
  if (!targetRegion)
    throw new Error("Cannot find target region " + action.targetRegion);
  if (
    gameState.Inventory.Count(action.entity) < action.beltLength ||
    RemainingRegionBuildingCapacity(currentRegion) <= 0 ||
    RemainingRegionBuildingCapacity(targetRegion) <= 0
  ) {
    console.log("Not enough belts");
    return;
  }
  const toRegion = targetRegion;

  // find first empty slot in other region
  const toRegionBuildingIdx = findFirstEmptyLane(
    toRegion.BuildingSlots,
    toRegion.Id == action.regionId ? action.buildingIdx : undefined
  );
  if (toRegionBuildingIdx < 0)
    throw new Error("No empty lane in region " + action.targetRegion);

  const truckLineId = (new Date().getTime() % 100000).toString();

  if (gameState.TruckLines.has(truckLineId)) {
    throw new Error("Duplicate TruckLine ID");
  }
  dispatch({
    kind: "PlaceTruckLine",
    entity: action.entity,
    address: { truckLineId },
    BuildingCount: 1,
    length: action.beltLength,
  });

  moveToInventory(dispatch, action.entity, -action.beltLength);
  dispatch({
    kind: "PlaceBuilding",
    entity: action.entity,
    address: { regionId: currentRegion.Id, buildingIdx: action.buildingIdx },
    BuildingCount: 1,
    direction: "TO_BELT",
    truckLineAddress: { truckLineId },
  });

  dispatch({
    kind: "PlaceBuilding",
    entity: action.entity,
    address: { regionId: toRegion.Id, buildingIdx: toRegionBuildingIdx },
    BuildingCount: 1,
    direction: "FROM_BELT",
    truckLineAddress: { truckLineId },
  });
}

function ReorderBuildings(
  dispatch: DispatchFunc,
  {
    regionId,
    buildingIdx,
    dropBuildingIdx,
  }: {
    regionId: string;
    buildingIdx: number;
    dropBuildingIdx: number;
    isDropOnLastBuilding: boolean;
  },
  region: { Id: string; BuildingSlots: ReadonlyBuildingSlot[] }
) {
  if (
    dropBuildingIdx != buildingIdx &&
    dropBuildingIdx < region.BuildingSlots.length - 1
  )
    dispatch({
      kind: "SwapBuildings",
      address: { regionId, buildingIdx },
      moveToAddress: { regionId, buildingIdx: dropBuildingIdx },
    });
  fixInserters(dispatch, region);
}

function removeTruckLine(
  dispatch: DispatchFunc,
  action: { regionId: string; buildingIdx: number },
  gameState: FactoryGameState
) {
  const b = building(gameState, action);
  if (!b || b.kind != "TruckLineDepot" || !b.truckLineId)
    throw new Error("Only removes belt line depots");
  const truckLineId = b.truckLineId;
  const truckLine = gameState.TruckLines.get(truckLineId);

  let removedCount = 0;
  // Find other depots for this belt line
  gameState.Regions.forEach((region, regionId) => {
    region.BuildingSlots.forEach(({ Building }, buildingIdx) => {
      if (
        Building.kind === "TruckLineDepot" &&
        Building.truckLineId === truckLineId
      ) {
        dispatch({
          kind: "PlaceBuilding",
          entity: "empty-lane",
          address: { regionId, buildingIdx },
          BuildingCount: 0,
        });
        //RefundBuildingMaterial(dispatch, Building); //disabled --Currently depots have no cost
        removedCount++;
      }
    });
  });
  if (removedCount != 2)
    console.warn(
      `Removed ${removedCount} buildings when trying to remove truckLine ${truckLineId}`
    );
  if (removedCount > 0 && truckLine) {
    // Refund entities on beltline
    const refundMap = new Map<string, number>();
    truckLine.internalBeltBuffer.forEach((stack) => {
      if (stack.Entity && stack.Count)
        refundMap.set(
          stack.Entity,
          (refundMap.get(stack.Entity) || 0) + stack.Count
        );
    });
    refundMap.forEach((count, entity) =>
      moveToInventory(dispatch, entity, count)
    );
    // Refund belt itself
    moveToInventory(dispatch, b.subkind, truckLine.length);
    dispatch({
      kind: "RemoveTruckLine",
      address: { truckLineId },
    });
  }
}

function RemoveBuilding(
  dispatch: DispatchFunc,
  action: {
    regionId: string;
    buildingIdx: number;
  },
  gameState: FactoryGameState
) {
  const { regionId, buildingIdx } = action;
  const address = { regionId, buildingIdx };
  const b = building(gameState, action); // as Producer;
  if (!b) return;
  if (b.kind === "TruckLineDepot") {
    // Remove beltline, refund
    // search all regions, find other depot, remove
    removeTruckLine(dispatch, action, gameState);
  } else {
    dispatch({
      kind: "PlaceBuilding",
      entity: "empty-lane",
      address,
      BuildingCount: 0,
    });
    RefundBuildingMaterial(dispatch, b);
  }
}

function RefundBuildingMaterial(dispatch: DispatchFunc, b: ReadonlyBuilding) {
  if (HasProgressTrackers(b)) {
    const recipe = MaybeGetRecipe(b.RecipeId);
    if (recipe) {
      recipe.Input.forEach(({ Count, Entity }) => {
        if (b.progressTrackers.length)
          moveToInventory(dispatch, Entity, Count * b.progressTrackers.length);
      });
    }
    b.progressTrackers.length;
  }
  if (b.BuildingCount > 0)
    moveToInventory(dispatch, b.subkind, b.BuildingCount);
  if (BuildingHasInput(b.kind))
    b.inputBuffers
      .Entities()
      .forEach(
        ([entity, count]) =>
          count > 0 && moveToInventory(dispatch, entity, count)
      );

  if (BuildingHasOutput(b.kind) && !BuildingHasUnifiedInputOutput(b.kind))
    b.outputBuffers
      .Entities()
      .forEach(
        ([entity, count]) =>
          count > 0 && moveToInventory(dispatch, entity, count)
      );
}

function addressAndCountForTransfer(
  gameState: FactoryGameState,
  action: InventoryTransferAction,
  direction: "to" | "from"
): { address: StateAddress | undefined; count: number } {
  let b: ReadonlyBuilding;
  switch (action.otherStackKind) {
    case "Void":
      return { address: undefined, count: Infinity };
    case "MainBus":
      throw new Error("NYI");
    // return {
    //   address: { regionId: action.regionId, laneId: action.laneId },
    //   count:
    //     GetRegion(gameState, action.regionId)
    //       .Bus.lanes.get(action.laneId)
    //       ?.Count(action.entity) || 0,
    //      };
    case "Building":
      b = GetRegion(gameState, action.regionId).BuildingSlots[
        action.buildingIdx
      ].Building;
      if (!b) break;
      if (
        BuildingHasOutput(b.kind) &&
        ((direction == "to" &&
          b.outputBuffers.AvailableSpace(action.entity) > 0) ||
          (direction == "from" && b.outputBuffers.Count(action.entity) > 0))
      ) {
        return {
          address: {
            regionId: action.regionId,
            buildingIdx: action.buildingIdx,
            buffer: "output",
          },
          count:
            direction == "to"
              ? b.outputBuffers.AvailableSpace(action.entity)
              : b.outputBuffers.Count(action.entity),
        };
      }
      if (
        BuildingHasInput(b.kind) &&
        ((direction == "to" &&
          b.inputBuffers.AvailableSpace(action.entity) > 0) ||
          (direction == "from" && b.inputBuffers.Count(action.entity) > 0))
      ) {
        return {
          address: {
            regionId: action.regionId,
            buildingIdx: action.buildingIdx,
            buffer: "input",
          },
          count:
            direction == "to"
              ? b.inputBuffers.AvailableSpace(action.entity)
              : b.inputBuffers.Count(action.entity),
        };
      }
  }
  return { address: undefined, count: 0 };
  //throw new Error("Cant find inventory to transfer " + direction);
}

export function NewBuilding(entity: string, recipeId?: string): Building {
  switch (ProducerTypeFromEntity(entity)) {
    case "Assembler":
    case "Smelter":
    case "ChemPlant":
    case "Refinery":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return NewFactory({ subkind: entity } as any, 1, recipeId);
    case "RocketSilo":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return NewFactory({ subkind: entity } as any, 1, "rocket-part");

    case "Miner":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return NewExtractor({ subkind: entity } as any, 1, recipeId);

    case "Pumpjack":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return NewExtractor({ subkind: entity } as any, 1, "crude-oil");

    case "WaterPump":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return NewExtractor({ subkind: entity } as any, 1, "water");

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

function building(
  gameState: FactoryGameState,
  action: {
    buildingIdx?: number;
    regionId: string;
  }
): ReadonlyBuilding | undefined {
  const currentRegion = GetRegion(gameState, action.regionId);

  return action.buildingIdx !== undefined
    ? currentRegion.BuildingSlots[action.buildingIdx].Building
    : undefined;
}

function buildingSlot(
  gameState: FactoryGameState,
  action: {
    buildingIdx?: number;
    regionId: string;
  }
): ReadonlyBuildingSlot | undefined {
  const currentRegion = GetRegion(gameState, action.regionId);

  return action.buildingIdx !== undefined
    ? currentRegion.BuildingSlots[action.buildingIdx]
    : undefined;
}

function inserter(
  gameState: FactoryGameState,
  action: InserterId
): Inserter | undefined {
  const currentRegion = GetRegion(gameState, action.regionId);

  return action.location === "BUILDING"
    ? currentRegion.BuildingSlots[action.buildingIdx].Inserter
    : currentRegion.BuildingSlots[action.buildingIdx].BeltConnections[
        action.connectionIdx
      ].Inserter;
}

function BuildingHasUnifiedInputOutput(kind: string) {
  return kind === "Chest";
}
