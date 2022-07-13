import { useState } from "react";
import { HasProgressTrackers } from "./AddProgressTracker";
import { NewEmptyLane } from "./building";
import {
  FactoryGameState,
  initialFactoryGameState,
  ReadonlyBuilding,
  ReadonlyBuildingSlot,
  ReadonlyRegion,
  ResearchState,
} from "./factoryGameState";
import { NewBuilding } from "./GameDispatch";
import { ReadonlyInventory } from "./inventory";
import { loadStateFromLocalStorage } from "./localstorage";
import {
  AdvanceBeltLine,
  capacityAtBuildingIdx,
  countAtBuildingIdx,
  endBuildingIdx,
  findBelt,
} from "./main_bus";
import { beltOverlaps, StackCapacity } from "./movement";
import { Extractor, Factory, UpdateBuildingRecipe } from "./production";
import { Lab, setLabResearch } from "./research";
import {
  AddItemAction,
  AddMainBusLaneAction,
  AddProgressTrackerAction,
  AddRegionAction,
  AddResearchCountAction,
  AdvanceMainBusLaneAction,
  AdvanceTruckLineAction,
  isPlaceTruckLineDepotAction,
  PlaceBuildingAction,
  PlaceTruckLineAction,
  RemoveMainBusLaneAction,
  RemoveTruckLineAction,
  SetBeltConnectionPropertyAction,
  SetBuildingPropertyAction,
  SetCurrentResearchAction,
  SetGlobalPropertyAction,
  SetInserterPropertyAction,
  SetMainBusBeltPropertyAction,
  SetPropertyAction,
  SetRecipeAction,
  StateVMAction,
  SwapBuildingsAction,
} from "./state/action";
import {
  BuildingAddress,
  isBeltConnectionAddress,
  isBuildingAddress,
  isGlobalAddress,
  isInserterAddress,
  isInventoryAddress,
  isMainBusAddress,
  isRegionAddress,
  isTruckLineAddress,
  MainBusAddress,
  TruckLineAddress,
} from "./state/address";
import { AdvanceTruckLine, NewTruckLine, NewTruckLineDepot } from "./transport";
import {
  AddToEntityStack,
  Belt,
  BeltConnection,
  NewEntityStack,
  NewRegionFromInfo,
} from "./types";
import { assertNever, replaceItem, swap } from "./utils";

export type DispatchFunc = (a: StateVMAction) => void;

export type GameStateReducer = (a: StateVMActionWithError[]) => void;

export type StateVMActionWithError = StateVMAction & { error?: StateVMError };

export class StateVMError extends Error {
  action: StateVMAction;
  constructor(a: StateVMAction) {
    super("Error during action: " + JSON.stringify(a));
    this.action = a;
    Object.setPrototypeOf(this, StateVMError.prototype);
  }
}

const useGameState = () =>
  useState(loadStateFromLocalStorage(initialFactoryGameState()));
// useReducer(
//   applyStateChangeActions,
//   loadStateFromLocalStorage(initialFactoryGameState())
// );

const debugStateActions = window.location.hash.includes("state");
const vmActions: StateVMActionWithError[] = [];
export function getDispatchFunc() {
  //console.warn("getDispatchFunc");
  //  const [gameState, dispatchGameStateActions] = useGameState();
  const [gameState, setGameState] = useGameState();

  const dispatch = (a: StateVMAction) => {
    debugStateActions && console.log(a);
    vmActions.push({ ...a, error: new StateVMError(a) });
  };

  return {
    gameState,
    executeActions: (gameState: FactoryGameState, dontExposeState = false) => {
      try {
        gameState = applyStateChangeActions(gameState, vmActions);
        if (!dontExposeState) setGameState(gameState);
        return gameState;
      } finally {
        vmActions.splice(0);
      }
    },
    dispatch,
  };
}

export function applyStateChangeActions(
  state: FactoryGameState,
  actions: StateVMActionWithError[]
): FactoryGameState {
  for (const action of actions) {
    try {
      state = applyStateChangeAction(state, action);
    } catch (e) {
      console.error("Error during VM execution. Rolling back all actions", e);
      throw action.error || e;
    }
  }
  return state;
}

function applyStateChangeAction(
  state: FactoryGameState,
  action: StateVMAction
): FactoryGameState {
  switch (action.kind) {
    case "Reset":
      return initialFactoryGameState();
    case "ResetTo":
      return action.state;
    case "AddResearchCount":
      return {
        ...state,
        Research: stateChangeAddResearchCount(state.Research, action),
      };
    case "SetCurrentResearch":
      return stateChangeSetCurrentResearch(state, action);
    case "AddItemCount":
      return stateChangeAddItemCount(state, action);
    case "AddProgressTrackers":
      return stateChangeAddProgressTrackers(state, action);
    case "SetRecipe":
      return stateChangeSetRecipe(state, action);
    case "SetProperty":
      return stateChangeSetProperty(state, action);
    case "PlaceBuilding":
      return stateChangePlaceBuilding(state, action);
    case "SwapBuildings":
      return stateChangeSwapBuildings(state, action);
    case "AddRegion":
      return stateChangeAddRegion(state, action);
    case "AdvanceTruckLine":
      return stateChangeAdvanceTruckLine(state, action);
    case "PlaceTruckLine":
      return stateChangePlaceTruckLine(state, action);
    case "RemoveTruckLine":
      return stateChangeRemoveTruckLine(state, action);
    case "AddMainBusLane":
      return stateChangeAddMainBusLane(state, action);
    case "RemoveMainBusLane":
      return stateChangeRemoveMainBusLane(state, action);
    case "AdvanceMainBusLane":
      return stateChangeAdvanceMainBusLane(state, action);
    default:
      throw assertNever(action);
  }
}

function stateChangeSwapBuildings(
  state: FactoryGameState,
  action: SwapBuildingsAction
): FactoryGameState {
  const fromRegion = state.Regions.get(action.address.regionId);
  const toRegion = state.Regions.get(action.moveToAddress.regionId);
  if (fromRegion != toRegion)
    throw new Error("Cross-region swap not yet supported");
  if (!fromRegion || !toRegion) throw new Error("Regions required");
  const lowerIdx = Math.min(
      action.address.buildingIdx,
      action.moveToAddress.buildingIdx
    ),
    upperIdx = Math.max(
      action.address.buildingIdx,
      action.moveToAddress.buildingIdx
    );

  const newRegion: ReadonlyRegion = {
    ...fromRegion,
    BuildingSlots: swap(fromRegion.BuildingSlots, lowerIdx, upperIdx),
  };
  return { ...state, Regions: state.Regions.set(fromRegion.Id, newRegion) };
}

function stateChangeSetProperty(
  state: FactoryGameState,
  action: SetPropertyAction
): FactoryGameState {
  if (isGlobalAddress(action.address))
    return setGlobalProperty(state, action as SetGlobalPropertyAction);
  let region = state.Regions.get(action.address.regionId);
  if (!region) throw new Error("Missing region " + action.address.regionId);
  if (isBeltConnectionAddress(action.address))
    region = setBeltConnectionProperty(
      region,
      action as SetBeltConnectionPropertyAction
    );
  if (isInserterAddress(action.address))
    region = setInserterProperty(region, action as SetInserterPropertyAction);
  else if (isBuildingAddress(action.address))
    region = setBuildingProperty(region, action as SetBuildingPropertyAction);
  else if (isMainBusAddress(action.address))
    region = setMainBusProperty(region, action as SetMainBusBeltPropertyAction);
  else throw new Error("Bad address: " + action.address);
  return {
    ...state,
    Regions: state.Regions.set(action.address.regionId, region),
  };
}

function setGlobalProperty(
  state: FactoryGameState,
  { property, value }: SetGlobalPropertyAction
): FactoryGameState {
  return {
    ...state,
    [property]: value,
  };
}

function setInserterProperty(
  region: ReadonlyRegion,
  { property, value, address }: SetInserterPropertyAction
): ReadonlyRegion {
  const { buildingIdx, location } = address;
  const buildingSlot = region.BuildingSlots[buildingIdx];
  if (!buildingSlot) return region;
  if (location == "BELT") {
    const { connectionIdx } = address;
    const newConnection: BeltConnection = {
      ...buildingSlot.BeltConnections[connectionIdx],
      Inserter: {
        ...buildingSlot.BeltConnections[connectionIdx].Inserter,
        [property]: value,
      },
    };
    const slot: ReadonlyBuildingSlot = {
      ...buildingSlot,
      BeltConnections: replaceItem(
        buildingSlot.BeltConnections,
        connectionIdx,
        newConnection
      ),
    };

    return {
      ...region,
      BuildingSlots: replaceItem(region.BuildingSlots, buildingIdx, slot),
    };
  } else if (location == "BUILDING") {
    const slot = {
      ...buildingSlot,
      Inserter: {
        ...buildingSlot.Inserter,
        [property]: value,
      },
    };
    return {
      ...region,
      BuildingSlots: replaceItem(region.BuildingSlots, buildingIdx, slot),
    };
  }
  throw new Error("Bad inserter");
}

function setBuildingProperty(
  region: ReadonlyRegion,
  { property, value, address: { buildingIdx } }: SetBuildingPropertyAction
): ReadonlyRegion {
  const buildingSlot = region.BuildingSlots[buildingIdx];
  if (!buildingSlot) return region;
  let b = {
    ...buildingSlot.Building,
    [property]: value,
  };
  // TODO: Cleanup??
  if (b.kind === "Chest" && property == "BuildingCount") {
    const sharedBuffers = new ReadonlyInventory(
      value,
      (b.inputBuffers as ReadonlyInventory).Data,
      true
    );

    b = {
      ...b,
      outputBuffers: sharedBuffers,
      inputBuffers: sharedBuffers,
    };
  }
  const slot = {
    ...buildingSlot,
    Building: b,
  };

  return {
    ...region,
    BuildingSlots: replaceItem(region.BuildingSlots, buildingIdx, slot),
  };
}

function setBeltConnectionProperty(
  region: ReadonlyRegion,
  {
    property,
    value,
    address: { buildingIdx, connectionIdx },
  }: SetBeltConnectionPropertyAction
): ReadonlyRegion {
  const buildingSlot = region.BuildingSlots[buildingIdx];
  if (!buildingSlot) return region;
  const newConnection = {
    ...buildingSlot.BeltConnections[connectionIdx],
    [property]: value,
  };
  // TODO: Cleanup??
  const slot: ReadonlyBuildingSlot = {
    ...buildingSlot,
    BeltConnections: replaceItem(
      buildingSlot.BeltConnections,
      connectionIdx,
      newConnection
    ),
  };

  return {
    ...region,
    BuildingSlots: replaceItem(region.BuildingSlots, buildingIdx, slot),
  };
}

function setMainBusProperty(
  region: ReadonlyRegion,
  {
    property,
    value,
    address: { laneId, upperSlotIdx },
  }: SetMainBusBeltPropertyAction
): ReadonlyRegion {
  const beltIdx = region.Bus.Belts.findIndex(
    (b) => b.laneIdx == laneId && b.upperSlotIdx == upperSlotIdx
  );

  if (beltIdx < 0) return region;
  const Belt = region.Bus.Belts[beltIdx];
  const b = {
    ...Belt,
    [property]: value,
  };

  return {
    ...region,
    Bus: {
      ...region.Bus,
      Belts: replaceItem(region.Bus.Belts as Belt[], beltIdx, b),
    },
  };
}

function stateChangeAddResearchCount(
  state: ResearchState,
  action: AddResearchCountAction
): ResearchState {
  if (!state.Progress.has(action.researchId))
    return {
      ...state,
      Progress: state.Progress.set(
        action.researchId,
        NewEntityStack(action.researchId, action.count, action.maxCount)
      ),
    };
  else {
    const researchProgress = state.Progress.get(action.researchId)?.Count;
    return {
      ...state,
      Progress: state.Progress.set(
        action.researchId,
        NewEntityStack(
          action.researchId,
          (researchProgress || 0) + action.count,
          action.maxCount
        )
      ),
    };
  }
}

function stateChangePlaceBuilding(
  state: FactoryGameState,
  action: PlaceBuildingAction
): FactoryGameState {
  const {
    address: { regionId, buildingIdx },
    entity,
  } = action;
  const region = state.Regions.get(regionId);
  if (!region) throw new Error("Region Required");

  const slot = region.BuildingSlots[buildingIdx];
  switch (entity) {
    case "empty-lane":
      slot.Building = NewEmptyLane();
      break;
    case "concrete":
      if (isPlaceTruckLineDepotAction(action))
        slot.Building = NewTruckLineDepot({
          subkind: entity,
          direction: action.direction,
          truckLineId: action.truckLineAddress.truckLineId,
        });
      break;
    default:
      slot.Building = NewBuilding(entity);
  }

  const newRegion = {
    ...region,
    BuildingSlots: replaceItem(region.BuildingSlots, buildingIdx, slot),
  };
  return {
    ...state,
    Regions: state.Regions.set(regionId, newRegion),
  };
}

function isLab(b: ReadonlyBuilding): b is Lab {
  return b.kind == "Lab";
}

function stateChangeSetCurrentResearch(
  state: FactoryGameState,
  action: SetCurrentResearchAction
): FactoryGameState {
  const Regions = state.Regions.map((region) => ({
    ...region,
    BuildingSlots: region.BuildingSlots.map((slot) => {
      const b = slot.Building;
      return {
        ...slot,
        Building: isLab(b)
          ? setLabResearch(
              b,
              action.researchId,
              state.Research.Progress.get(action.researchId, { Count: 0 }).Count
            )
          : slot.Building,
      };
    }),
  }));
  return {
    ...state,
    Regions,
    Research: { ...state.Research, CurrentResearchId: action.researchId },
  };
}

function stateChangeSetRecipe(
  state: FactoryGameState,
  action: SetRecipeAction
): FactoryGameState {
  const {
    address: { regionId, buildingIdx },
    recipeId,
  } = action;
  const region = state.Regions.get(regionId);
  if (!region) throw new Error("Missing region");
  const currentBuilding = region.BuildingSlots[buildingIdx].Building;
  if (
    currentBuilding.kind == "Factory" ||
    currentBuilding.kind == "Extractor"
  ) {
    const { Inventory, Building } = UpdateBuildingRecipe(
      state.Inventory,
      currentBuilding as Factory | Extractor,
      recipeId
    );
    const slot = region.BuildingSlots[buildingIdx];
    const newRegion: ReadonlyRegion = {
      ...region,
      BuildingSlots: replaceItem(region.BuildingSlots, buildingIdx, {
        ...slot,
        Building,
      }),
    };

    return {
      ...state,
      Inventory,
      Regions: state.Regions.set(regionId, newRegion),
    };
  }
  return state;
}

function stateChangeAddItemCount(
  state: FactoryGameState,
  action: AddItemAction
): FactoryGameState {
  const { address, count, entity } = action;
  if (isMainBusAddress(address)) {
    return addItemsToMainBus(address, state, entity, count);
  } else if (isTruckLineAddress(address)) {
    return addItemsToTruckLine(address, state, entity, count);
  } else if (isBuildingAddress(address)) {
    return addItemsToBuilding(address, state, entity, count);
  } else if (isInventoryAddress(address)) {
    return {
      ...state,
      Inventory: state.Inventory.AddItems(entity, count, true),
    };
  } else if (isRegionAddress(address)) {
    const { regionId, buffer } = address;
    const region = state.Regions.get(regionId);
    if (region && buffer === "ore") {
      const newRegion = {
        ...region,
        Ore: region.Ore.AddItems(entity, count),
      };
      return {
        ...state,
        Regions: state.Regions.set(regionId, newRegion),
      };
    }
  } else {
    throw new Error("Unknown address: " + address);
  }
  //
  return state;
}

function addItemsToBuilding(
  address: BuildingAddress,
  state: FactoryGameState,
  entity: string,
  count: number
) {
  const { regionId, buildingIdx, buffer } = address;
  const region = state.Regions.get(regionId);
  if (!region) throw new Error("Missing region");
  const slot = region.BuildingSlots[buildingIdx];
  if (!slot) throw new Error("Missing slot");

  // TODO: Handle chests
  // maybe update both input output for them?
  // maybe set both to one?

  const newBuilding =
    slot.Building.kind === "Chest"
      ? {
          ...slot.Building,
          inputBuffers: slot.Building.inputBuffers.AddItems(entity, count),
          outputBuffers: slot.Building.inputBuffers.AddItems(entity, count),
        }
      : buffer == "input"
      ? {
          ...slot.Building,
          inputBuffers: slot.Building.inputBuffers.AddItems(entity, count),
        }
      : buffer == "output"
      ? {
          ...slot.Building,
          outputBuffers: slot.Building.outputBuffers.AddItems(entity, count),
        }
      : slot.Building;
  const newRegion: ReadonlyRegion = {
    ...region,
    BuildingSlots: replaceItem(region.BuildingSlots, buildingIdx, {
      ...slot,
      Building: newBuilding,
    }),
  };

  return {
    ...state,
    Regions: state.Regions.set(regionId, newRegion),
  };
}

function addItemsToTruckLine(
  address: TruckLineAddress,
  state: FactoryGameState,
  entity: string,
  count: number
) {
  if (!count) return state;
  const { truckLineId } = address;
  let truckLine = state.TruckLines.get(truckLineId);
  if (!truckLine) throw new Error("Cannot find beltline " + truckLineId);

  if (count > 0) {
    const firstStack = truckLine.internalBeltBuffer[0];
    if (!StackCapacity(firstStack)) return state;
    if (!firstStack.Entity) firstStack.Entity = entity;
    if (firstStack.Entity != entity)
      throw new Error("Entity mismatch in beltline");

    truckLine = {
      ...truckLine,
      internalBeltBuffer: replaceItem(
        truckLine.internalBeltBuffer,
        0,
        AddToEntityStack(firstStack, count)
      ),
    };
  } else if (count < 0) {
    const lastStack =
      truckLine.internalBeltBuffer[truckLine.internalBeltBuffer.length - 1];
    if (!lastStack.Count) return state;
    if (lastStack.Entity && lastStack.Entity != entity)
      throw new Error("Entity mismatch in beltline");

    truckLine = {
      ...truckLine,
      internalBeltBuffer: replaceItem(
        truckLine.internalBeltBuffer,
        truckLine.internalBeltBuffer.length - 1,
        AddToEntityStack(lastStack, count)
      ),
    };
  }

  return {
    ...state,
    TruckLines: state.TruckLines.set(truckLineId, truckLine),
  };
}

function stateChangeAddProgressTrackers(
  state: FactoryGameState,
  action: AddProgressTrackerAction
): FactoryGameState {
  const { address, count, currentTick } = action;
  const { regionId, buildingIdx } = address;
  const region = state.Regions.get(regionId);
  if (!region) throw new Error("Missing region " + action.address.regionId);

  const slot = region.BuildingSlots[buildingIdx];
  if (!slot)
    throw new Error("Cannot find building at " + JSON.stringify(address));

  if (!HasProgressTrackers(slot.Building)) return state;
  const newTrackers =
    count > 0
      ? slot.Building.progressTrackers.concat(
          new Array(count).fill(currentTick)
        )
      : slot.Building.progressTrackers.slice(-count);

  const newRegion = {
    ...region,
    BuildingSlots: replaceItem(region.BuildingSlots, buildingIdx, {
      ...slot,
      Building: {
        ...slot.Building,
        progressTrackers: newTrackers,
      },
    }),
  };

  return { ...state, Regions: state.Regions.set(regionId, newRegion) };
}

function stateChangeAddRegion(
  state: FactoryGameState,
  action: AddRegionAction
): FactoryGameState {
  return {
    ...state,
    Regions: state.Regions.set(
      action.regionId,
      NewRegionFromInfo(action.regionInfo)
    ),
  };
}

function stateChangeAdvanceTruckLine(
  state: FactoryGameState,
  action: AdvanceTruckLineAction
): FactoryGameState {
  const truckLine = state.TruckLines.get(action.address.truckLineId);
  if (!truckLine)
    throw new Error("Cannot find truckLine = " + action.address.truckLineId);
  const newTruckLine = AdvanceTruckLine(truckLine);
  return {
    ...state,
    TruckLines: state.TruckLines.set(action.address.truckLineId, newTruckLine),
  };
}

function stateChangePlaceTruckLine(
  state: FactoryGameState,
  action: PlaceTruckLineAction
): FactoryGameState {
  const newTruckLine = NewTruckLine(
    action.address.truckLineId,
    action.entity,
    action.length,
    action.BuildingCount
  );
  return {
    ...state,
    TruckLines: state.TruckLines.set(action.address.truckLineId, newTruckLine),
  };
}

function stateChangeRemoveTruckLine(
  state: FactoryGameState,
  action: RemoveTruckLineAction
): FactoryGameState {
  return {
    ...state,
    TruckLines: state.TruckLines.delete(action.address.truckLineId),
  };
}

function NewBelt(
  address: MainBusAddress,
  lowerSlotIdx: number,
  beltDirection: "UP" | "DOWN",
  endDirection: "LEFT" | "RIGHT" | "NONE",
  entity = ""
): Belt {
  const { upperSlotIdx, laneId } = address;

  return {
    laneIdx: laneId,
    upperSlotIdx,
    lowerSlotIdx,
    endDirection,
    beltDirection,
    entity,
    internalBeltBuffer: new Array(lowerSlotIdx - upperSlotIdx + 1).fill(0),
  };
}

function stateChangeAddMainBusLane(
  state: FactoryGameState,
  action: AddMainBusLaneAction
): FactoryGameState {
  const region = state.Regions.get(action.address.regionId);
  if (!region) throw new Error("Missing region " + action.address.regionId);
  const { laneId, upperSlotIdx } = action.address;
  const { lowerSlotIdx } = action;

  const overlappingBelts: Belt[] = [];
  const otherBelts: Belt[] = [];
  const overlaps = beltOverlaps({
    upperSlotIdx,
    lowerSlotIdx,
    laneIdx: laneId,
  });
  region.Bus.Belts.forEach((b) => {
    if (overlaps(b)) overlappingBelts.push(b);
    else otherBelts.push(b);
  });

  const existingEntities = overlappingBelts.map((b) => b.entity);
  const entity = existingEntities.length ? existingEntities[0] : undefined;

  // remove existing belts
  const Belts = otherBelts.concat(
    NewBelt(
      action.address,
      action.lowerSlotIdx,
      action.beltDirection,
      action.endDirection,
      entity
    )
  );

  const newRegion: ReadonlyRegion = {
    ...region,
    Bus: { ...region.Bus, Belts },
  };

  return {
    ...state,
    Regions: state.Regions.set(region.Id, newRegion),
  };
}

function stateChangeRemoveMainBusLane(
  state: FactoryGameState,
  action: RemoveMainBusLaneAction
): FactoryGameState {
  const region = state.Regions.get(action.address.regionId);
  if (!region) throw new Error("Missing region " + action.address.regionId);
  const { laneId, upperSlotIdx } = action.address;

  // remove existing belts
  const Belts = region.Bus.Belts.filter(
    (b) => b.laneIdx != laneId || b.upperSlotIdx != upperSlotIdx
  );

  const newRegion: ReadonlyRegion = {
    ...region,
    Bus: { ...region.Bus, Belts },
  };

  return {
    ...state,
    Regions: state.Regions.set(region.Id, newRegion),
  };
}

function stateChangeAdvanceMainBusLane(
  state: FactoryGameState,
  action: AdvanceMainBusLaneAction
): FactoryGameState {
  const region = state.Regions.get(action.address.regionId);
  if (!region) throw new Error("Missing region " + action.address.regionId);
  const { laneId, upperSlotIdx } = action.address;
  let Belts = region.Bus.Belts;

  const beltIdx = Belts.findIndex(
    (b) => b.laneIdx == laneId && b.upperSlotIdx == upperSlotIdx
  );
  if (beltIdx < 0) throw new Error("Cannot find belt " + action.address);
  const belt = Belts[beltIdx];
  const endIdx = endBuildingIdx(belt);
  const endCount = countAtBuildingIdx(belt, endIdx);
  if (belt.endDirection != "NONE" && endCount) {
    // Push to neighbor
    const neighborLaneId =
      belt.laneIdx + (belt.endDirection == "LEFT" ? -1 : 1);
    const [neighborBelt, neighborBeltIdx] = findBelt(
      neighborLaneId,
      endIdx,
      Belts
    );
    console.log("NLI", neighborLaneId, endIdx);
    if (neighborBelt) {
      const availableSpace = Math.max(
        15,
        capacityAtBuildingIdx(neighborBelt, endIdx)
      );
      const newNeighborBelt: Belt = addItemsToBelt(
        neighborBelt,
        endIdx,
        availableSpace
      );
      console.log("moving ", availableSpace);
      Belts = replaceItem(Belts, neighborBeltIdx, newNeighborBelt);
      const newMeBelt: Belt = addItemsToBelt(belt, endIdx, -availableSpace);
      Belts = replaceItem(Belts, beltIdx, newMeBelt);
    } else {
      console.log("no neighbor", belt.entity, belt.laneIdx, belt.upperSlotIdx);
    }
  }
  const newBelt = AdvanceBeltLine(belt);
  Belts = replaceItem(Belts, beltIdx, newBelt);
  const newRegion: ReadonlyRegion = {
    ...region,
    Bus: { ...region.Bus, Belts },
  };

  return {
    ...state,
    Regions: state.Regions.set(region.Id, newRegion),
  };
}

function addItemsToMainBus(
  address: MainBusAddress,
  state: FactoryGameState,
  entity: string,
  count: number
): FactoryGameState {
  const region = state.Regions.get(address.regionId);
  if (!region) throw new Error("Missing region " + address.regionId);

  const { laneId, upperSlotIdx, buildingIdx } = address;
  if (buildingIdx == undefined) throw new Error("Building idx undefined");
  const Belts = region.Bus.Belts;

  const [belt, beltIdx] = findBelt(laneId, upperSlotIdx, Belts);
  if (!belt) throw new Error("Cannot find belt " + address);

  if (entity != belt.entity)
    throw new Error(`Entity mismach: Belt has ${belt.entity}, given ${entity}`);

  const newBelt: Belt = addItemsToBelt(belt, buildingIdx, count);

  const newRegion: ReadonlyRegion = {
    ...region,
    Bus: { ...region.Bus, Belts: replaceItem(Belts, beltIdx, newBelt) },
  };

  return {
    ...state,
    Regions: state.Regions.set(region.Id, newRegion),
  };

  //throw new Error("NYI");
  // const region = state.Regions.get(address.regionId);
  // if (!region) throw new Error("Missing region");
  // const newRegion = {
  //   ...region,
  //   Bus: region.Bus.AddItemToLane(address.laneId, entity, count),
  // };

  // return {
  //   ...state,
  //   Regions: state.Regions.set(address.regionId, newRegion),
  //  };
}

function addItemsToBelt(belt: Belt, buildingIdx: number, count: number): Belt {
  const addIdx = buildingIdx - belt.upperSlotIdx;
  const newCount = belt.internalBeltBuffer[addIdx] + count;
  // todo: check upper bounds
  if (newCount < 0) throw new Error("Cannot decrement belt below 0");

  const newBelt: Belt = {
    ...belt,
    internalBeltBuffer: replaceItem(belt.internalBeltBuffer, addIdx, newCount),
  };
  return newBelt;
}
