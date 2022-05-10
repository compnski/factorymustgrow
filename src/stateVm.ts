import { useState } from "react";
import { HasProgressTrackers } from "./AddProgressTracker";
import { NewEmptyLane } from "./building";
import { debugFactoryGameState } from "./debug";
import {
  FactoryGameState,
  initialFactoryGameState,
  ReadonlyBuildingSlot,
  ReadonlyRegion,
  ResearchState,
} from "./factoryGameState";
import { NewBuilding } from "./GameDispatch";
import { ReadonlyInventory } from "./inventory";
import { loadStateFromLocalStorage } from "./localstorage";
import { StackCapacity } from "./movement";
import { Extractor, Factory, UpdateBuildingRecipe } from "./production";
import {
  AddItemAction,
  AddMainBusLaneAction,
  AddProgressTrackerAction,
  AddRegionAction,
  AddResearchCountAction,
  AdvanceBeltLineAction,
  isPlaceBeltLineDepotAction,
  PlaceBeltLineAction,
  PlaceBuildingAction,
  RemoveMainBusLaneAction,
  SetBeltConnectionPropertyAction,
  SetBuildingPropertyAction,
  SetCurrentResearchAction,
  SetGlobalPropertyAction,
  SetInserterPropertyAction,
  SetPropertyAction,
  SetRecipeAction,
  StateVMAction,
  SwapBuildingsAction,
} from "./state/action";
import {
  BeltLineAddress,
  BuildingAddress,
  isBeltConnectionAddress,
  isBeltLineAddress,
  isBuildingAddress,
  isGlobalAddress,
  isInserterAddress,
  isInventoryAddress,
  isMainBusAddress,
  isRegionAddress,
  MainBusAddress,
} from "./state/address";
import { AdvanceBeltLine, NewBeltLine, NewBeltLineDepot } from "./transport";
import {
  AddToEntityStack,
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
    executeActions: (gameState: FactoryGameState) => {
      try {
        gameState = applyStateChangeActions(gameState, vmActions);
        setGameState(gameState);
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
      //return gs;
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
    case "ResetToDebugState":
      return debugFactoryGameState();
    case "AddResearchCount":
      return {
        ...state,
        Research: stateChangeAddResearchCount(state.Research, action),
      };
    case "SetCurrentResearch":
      return {
        ...state,
        Research: stateChangeSetCurrentResearch(state.Research, action),
      };
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
    case "AdvanceBeltLine":
      return stateChangeAdvanceBeltLine(state, action);
    case "PlaceBeltLine":
      return stateChangePlaceBeltLine(state, action);
    case "AddMainBusLane":
      return stateChangeAddMainBusLane(state, action);
    case "RemoveMainBusLane":
      return stateChangeRemoveMainBusLane(state, action);

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
    console.log("resize chest", value);
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
    case "express-transport-belt":
    case "fast-transport-belt":
    case "transport-belt":
      if (isPlaceBeltLineDepotAction(action))
        slot.Building = NewBeltLineDepot({
          subkind: entity,
          direction: action.direction,
          beltLineId: action.beltLineAddress.beltLineId,
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

function stateChangeSetCurrentResearch(
  state: ResearchState,
  action: SetCurrentResearchAction
): ResearchState {
  return {
    ...state,
    CurrentResearchId: action.researchId,
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
  } else if (isBeltLineAddress(address)) {
    return addItemsToBeltLine(address, state, entity, count);
  } else if (isBuildingAddress(address)) {
    return addItemsToBuilding(address, state, entity, count);
  } else if (isInventoryAddress(address)) {
    return { ...state, Inventory: state.Inventory.AddItems(entity, count) };
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

function addItemsToBeltLine(
  address: BeltLineAddress,
  state: FactoryGameState,
  entity: string,
  count: number
) {
  if (!count) return state;
  const { beltLineId } = address;
  let beltLine = state.BeltLines.get(beltLineId);
  if (!beltLine) throw new Error("Cannot find beltline " + beltLineId);

  if (count > 0) {
    const firstStack = beltLine.internalBeltBuffer[0];
    if (!StackCapacity(firstStack)) return state;
    if (!firstStack.Entity) firstStack.Entity = entity;
    if (firstStack.Entity != entity)
      throw new Error("Entity mismatch in beltline");

    beltLine = {
      ...beltLine,
      internalBeltBuffer: replaceItem(
        beltLine.internalBeltBuffer,
        0,
        AddToEntityStack(firstStack, count)
      ),
    };
  } else if (count < 0) {
    const lastStack =
      beltLine.internalBeltBuffer[beltLine.internalBeltBuffer.length - 1];
    if (!lastStack.Count) return state;
    if (lastStack.Entity && lastStack.Entity != entity)
      throw new Error("Entity mismatch in beltline");

    beltLine = {
      ...beltLine,
      internalBeltBuffer: replaceItem(
        beltLine.internalBeltBuffer,
        beltLine.internalBeltBuffer.length - 1,
        AddToEntityStack(lastStack, count)
      ),
    };
  }

  return {
    ...state,
    BeltLines: state.BeltLines.set(beltLineId, beltLine),
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

function stateChangeAdvanceBeltLine(
  state: FactoryGameState,
  action: AdvanceBeltLineAction
): FactoryGameState {
  const beltLine = state.BeltLines.get(action.address.beltLineId);
  if (!beltLine)
    throw new Error("Cannot find beltLine = " + action.address.beltLineId);
  const newBeltLine = AdvanceBeltLine(beltLine);
  return {
    ...state,
    BeltLines: state.BeltLines.set(action.address.beltLineId, newBeltLine),
  };
}

function stateChangePlaceBeltLine(
  state: FactoryGameState,
  action: PlaceBeltLineAction
): FactoryGameState {
  const newBeltLine = NewBeltLine(
    action.address.beltLineId,
    action.entity,
    action.length,
    action.BuildingCount
  );
  return {
    ...state,
    BeltLines: state.BeltLines.set(action.address.beltLineId, newBeltLine),
  };
}

function stateChangeAddMainBusLane(
  state: FactoryGameState,
  action: AddMainBusLaneAction
): FactoryGameState {
  const region = state.Regions.get(action.address.regionId);
  if (!region) throw new Error("Missing region " + action.address.regionId);
  const newRegion: ReadonlyRegion = {
    ...region,
    Bus: region.Bus.AddLane(action.entity),
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
  const newRegion: ReadonlyRegion = {
    ...region,
    Bus: region.Bus.RemoveLane(action.address.laneId),
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
  if (!region) throw new Error("Missing region");
  const newRegion = {
    ...region,
    Bus: region.Bus.AddItemToLane(address.laneId, entity, count),
  };

  return {
    ...state,
    Regions: state.Regions.set(address.regionId, newRegion),
  };
}
