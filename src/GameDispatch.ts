import { HasProgressTrackers } from "./AddProgressTracker";
import { Building, InserterId, NewEmptyLane } from "./building";
import { fixInserters } from "./factoryGame";
import { GameAction, InventoryTransferAction } from "./GameAction";
import { GetEntity, MaybeGetRecipe } from "./gen/entities";
import { GetResearch } from "./gen/research";
import { Inserter } from "./inserter";
import { CanPushTo, moveToInventory } from "./movement";
import { NewExtractor, NewFactory, ProducerTypeFromEntity } from "./production";
import { GetRegionInfo, RemainingRegionBuildingCapacity } from "./region";
import { NewLab } from "./research";
import { DispatchFunc, StateAddress, StateVMAction } from "./stateVm";
import { NewChest } from "./storage";
import { Producer } from "./types";
import {
  FactoryGameState,
  ReadonlyBuilding,
  ReadonlyBuildingSlot,
  ReadonlyRegion,
} from "./useGameState";
import { BuildingHasInput, BuildingHasOutput, showUserError } from "./utils";

function GetRegion(
  gameState: FactoryGameState,
  regionId: string
): ReadonlyRegion {
  const r = gameState.Regions.get(regionId);
  if (!r) throw new Error(`No region found for ${regionId}`);
  return r;
}

export const GameDispatch = (
  dispatchGameStateActions: (a: StateVMAction[]) => void,
  gameState: FactoryGameState,
  action: GameAction
) => {
  // TODO: Dispatch func!
  const vmActions: StateVMAction[] = [];
  const dispatch = (a: StateVMAction) => {
    console.log(a);
    vmActions.push(a);
  };

  switch (action.type) {
    case "Reset":
      //ResetGameState();
      dispatch({ kind: "Reset" });
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
        address: { regionId: action.regionId },
        entity: action.entity,
      });
      //GetRegion(action.regionId).Bus.AddLane(dispatch, action.entity);
      break;

    case "ChangeResearch":
      if (action.producerName) {
        console.log("Set research to ", action.producerName);
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

    case "PlaceBeltLine":
      PlaceBeltLine(
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
        GetRegion(gameState, action.regionId)
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
        console.log("Region already unlocked", action.regionId);
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

  dispatchGameStateActions(vmActions);
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
      //GameState.RocketLaunchingAt = new Date().getTime();
      showUserError("Congratulations!");
      throw new Error("NYI");
      // dispatch({
      //   kind: "AddItemCount",
      //   address: { regionId, buildingIdx, buffer: "output" },
      //   count: -100,
      //   entity: "rocket-part",
      // });
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
  throw new Error("NYI");
  // const { laneId, direction } = action;
  // const slot = buildingSlot(gameState, action),
  //   firstEmptyBeltConn = slot?.BeltConnections.find(
  //     (beltConn) => beltConn.direction === undefined
  //   );
  // console.log("Add slot", action, firstEmptyBeltConn, slot?.BeltConnections);

  // if (firstEmptyBeltConn) {
  //   firstEmptyBeltConn.direction = direction;
  //   firstEmptyBeltConn.laneId = laneId;
  //   firstEmptyBeltConn.Inserter.direction = direction;
  //   // TODO: If inserter count is 0, try to build one from inventory
  //   // If the current count is 0, try to build one
  //   if (
  //     firstEmptyBeltConn.Inserter.BuildingCount === 0 &&
  //     gameState.Inventory
  //       .Remove
  //       //        NewEntityStack(firstEmptyBeltConn.Inserter.subkind, 0, 1),
  //       //        1
  //       ()
  //   )
  //     firstEmptyBeltConn.Inserter.BuildingCount = 1;
  // }
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
  throw new Error("NYI");
  // const conn = buildingSlot(gameState, action)?.BeltConnections[
  //   action.connectionIdx
  // ];
  // if (conn) {
  //   conn.laneId = undefined;
  //   conn.direction = undefined;
  //   conn.Inserter.direction = "NONE";
  // }
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
  region: ReadonlyRegion
) {
  if (action.location === "BELT") {
    // const i = inserter(action),
    //   b = building(action);

    // const beltConn =
    //     region.BuildingSlots[action.buildingIdx].BeltConnections[
    //       action.connectionIdx
    //     ],
    //   mainBusLaneId = beltConn.laneId;
    // if (mainBusLaneId !== undefined && region.Bus.HasLane(mainBusLaneId)) {
    //   const busLane = region.Bus.lanes.get(mainBusLaneId);
    //   // Check if the inserter can be toggled
    //   // IF so, flip it
    //   if (i && b && busLane) {
    //     const canGoLeft = BuildingHasInput(b, busLane.Entities()[0][0]),
    //       canGoRight = BuildingHasOutput(b, busLane.Entities()[0][0]);

    //     if (canGoLeft && canGoRight) {
    //       i.direction =
    //         i.direction === "TO_BUS"
    //           ? "FROM_BUS"
    //           : i.direction === "FROM_BUS"
    //           ? "NONE"
    //           : "TO_BUS";
    //     } else if (canGoLeft) {
    //       i.direction = i.direction === "NONE" ? "FROM_BUS" : "NONE";
    //     } else if (canGoRight) {
    //       i.direction = i.direction === "NONE" ? "TO_BUS" : "NONE";
    //     }
    //     if (i.direction === "FROM_BUS" || i.direction === "TO_BUS") {
    //       (beltConn as Pick<BeltConnection, "direction">).direction =
    //         i.direction;
    //     }
    //   }
    // }
    return;
  }
  // location === "BUILDING"
  const { regionId, buildingIdx, location } = action;
  const topB = region.BuildingSlots[action.buildingIdx].Building,
    bottomB = region.BuildingSlots[action.buildingIdx + 1].Building,
    i = region.BuildingSlots[action.buildingIdx].Inserter;

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
  if (b?.kind === "BeltLineDepot") {
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
      count: -b.BuildingCount - newCount,
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
  if (b?.kind === "BeltLineDepot") {
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
  action: { type: "RemoveLane"; laneId: number },
  gameState: FactoryGameState
) {
  dispatch({
    kind: "RemoveMainBusLane",
    address: { regionId: currentRegion.Id, laneId: action.laneId },
  });
  for (const [entity, count] of currentRegion.Bus.Lane(
    action.laneId
  ).Entities()) {
    if (count > 0) moveToInventory(dispatch, entity, count);
  }

  // Remove attached inserters
  currentRegion.BuildingSlots.forEach((buildingSlot, buildingSlotIdx) => {
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

function PlaceBeltLine(
  dispatch: DispatchFunc,
  action: {
    regionId: string;
    entity: "transport-belt" | "fast-transport-belt" | "express-transport-belt";
    beltLength: number;
    targetRegion: string;
    buildingIdx: number;
  },
  currentRegion: ReadonlyRegion,
  gameState: FactoryGameState
) {
  //  throw new Error("NYI");
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

  // Add to list of belt lines
  // Add building to each region's list of buildings
  // const beltLine = NewBeltLine(
  //   dispatch,
  //   fromRegion,
  //   toRegion,
  //   action.entity,
  //   100
  // );

  const beltLineId = (new Date().getTime() % 100000).toString();

  if (gameState.BeltLines.has(beltLineId)) {
    throw new Error("Duplicate BeltLine ID");
  }
  dispatch({
    kind: "PlaceBeltLine",
    entity: action.entity,
    address: { beltLineId },
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
    beltLineAddress: { beltLineId },
  });

  dispatch({
    kind: "PlaceBuilding",
    entity: action.entity,
    address: { regionId: toRegion.Id, buildingIdx: toRegionBuildingIdx },
    BuildingCount: 1,
    direction: "FROM_BELT",
    beltLineAddress: { beltLineId },
  });

  // If buildingIdx is set, and points to an Empty Lane, replace it.
  // AddBuildingOverEmptyOrAtEnd(fromRegion, fromDepot, action.buildingIdx);
  // AddBuildingOverEmptyOrAtEnd(toRegion, toDepot, (action.buildingIdx || 0) + 1);

  //  GameState.BeltLines.set(beltLine.beltLineId, beltLine);
  //GameState.Inventory.Remove(); //NewEntityStack(action.entity, 0, 100), 100);
}

// export function AddBuildingOverEmptyOrAtEnd(
//   region: { BuildingSlots: BuildingSlot[] },
//   b: Building,
//   buildingIdx?: number
// ): BuildingSlot {
//   const buildingSlot = NewBuildingSlot(b);
//   if (
//     buildingIdx !== undefined &&
//     region.BuildingSlots[buildingIdx]?.Building.kind === "Empty"
//   ) {
//     region.BuildingSlots[buildingIdx] = buildingSlot;
//   } else {
//     region.BuildingSlots.push(buildingSlot);
//   }
//   return buildingSlot;
// }

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
  dispatch({
    kind: "SwapBuildings",
    address: { regionId, buildingIdx },
    moveToAddress: { regionId, buildingIdx: dropBuildingIdx },
  });
  fixInserters(dispatch, region);
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
  //currentRegion.BuildingSlots[action.buildingIdx].Building = NewEmptyLane();

  if (b.kind === "BeltLineDepot") {
    // const depot = b as BeltLineDepot,
    //   otherRegion = GetRegion(depot.otherRegionId);

    // const otherDepot = FindDepotForBeltLineInRegion(
    //   otherRegion,
    //   depot.beltLineId,
    //   depot.direction === "FROM_BELT" ? "TO_BELT" : "FROM_BELT"
    // );
    // // Have to remove both depots to remove beltline
    // if (!otherDepot) {
    //   // Remove BeltLine
    //   const beltLine = GameState.BeltLines.get(depot.beltLineId);
    //   if (!beltLine) {
    //     console.error(
    //       "No beltline to delete when deleting depot for ",
    //       depot.beltLineId
    //     );
    //     return;
    //   }
    //   // GameState.Inventory
    //   //   .Add
    //   //   // NewEntityStack(b.subkind, b.BuildingCount * beltLine.length),
    //   //   //          b.BuildingCount * beltLine.length
    //   //   ();
    //   beltLine.sharedBeltBuffer.forEach((es) => {
    //     if (es && es.Entity) GameState.Inventory.Add(); //es, Infinity, true);
    //   });
    //   GameState.BeltLines.delete(beltLine.beltLineId);
    //}
    throw new Error("NYI");
  } else {
    // TODO: Progress Trackers
    if (HasProgressTrackers(b)) {
      const recipe = MaybeGetRecipe(b.RecipeId);
      if (recipe) {
        recipe.Input.forEach(({ Count, Entity }) => {
          if (b.progressTrackers.length)
            moveToInventory(
              dispatch,
              Entity,
              Count * b.progressTrackers.length
            );
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
  dispatch({
    kind: "PlaceBuilding",
    entity: "empty-lane",
    address,
    BuildingCount: 0,
  });
}

// TODO: PAss direction (to/from) so we can grab availabe space vs count accordingly
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
      return {
        address: { regionId: action.regionId, laneId: action.laneId },
        count:
          GetRegion(gameState, action.regionId)
            .Bus.lanes.get(action.laneId)
            ?.Count(action.entity) || 0,
      };
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

function findFirstEmptyLane(
  BuildingSlots: ReadonlyBuildingSlot[],
  exceptThisIdx?: number
) {
  return BuildingSlots.findIndex(
    (bs, idx) =>
      bs.Building.kind === "Empty" &&
      (exceptThisIdx == undefined || idx != exceptThisIdx)
  );
}
