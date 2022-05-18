import { useState } from "react";
import { HasProgressTrackers } from "./AddProgressTracker";
import { NewEmptyLane } from "./building";
import { debugFactoryGameState } from "./debug";
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
import { StackCapacity } from "./movement";
import { Extractor, Factory, UpdateBuildingRecipe } from "./production";
import { Lab, setLabResearch } from "./research";
import {
  AddItemAction,
  AddMainBusLaneAction,
  AddProgressTrackerAction,
  AddRegionAction,
  AddResearchCountAction,
  AdvanceTruckLineAction,
  isPlaceTruckLineDepotAction,
  PlaceTruckLineAction,
  PlaceBuildingAction,
  RemoveTruckLineAction,
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
  TruckLineAddress,
  BuildingAddress,
  isBeltConnectionAddress,
  isTruckLineAddress,
  isBuildingAddress,
  isGlobalAddress,
  isInserterAddress,
  isInventoryAddress,
  isMainBusAddress,
  isRegionAddress,
  MainBusAddress,
} from "./state/address";
import { AdvanceTruckLine, NewTruckLine, NewTruckLineDepot } from "./transport";
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
