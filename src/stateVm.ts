import { HasProgressTrackers } from "./AddProgressTracker";
import { Building, InserterId, NewEmptyLane } from "./building";
import { debugFactoryGameState } from "./debug";
import { NewBuilding } from "./GameDispatch";
import { Inserter } from "./inserter";
import { ReadonlyInventory } from "./inventory";
import { StackCapacity } from "./movement";
import { Extractor, Factory, UpdateBuildingRecipe } from "./production";
import { AdvanceBeltLine, NewBeltLine, NewBeltLineDepot } from "./transport";
import {
  AddToEntityStack,
  BeltConnection,
  NewEntityStack,
  NewRegionFromInfo,
  RegionInfo,
} from "./types";
import {
  FactoryGameState,
  initialFactoryGameState,
  ReadonlyBuildingSlot,
  ReadonlyRegion,
  ResearchState,
} from "./useGameState";
import { assertNever, replaceItem, swap } from "./utils";

export type DispatchFunc = (a: StateVMAction) => void;

export type StateAddress =
  | MainBusAddress
  | BuildingAddress
  | InventoryAddress
  | RegionAddress
  | BeltLineAddress
  | GlobalAddress
  | BeltConnectionAddress;

type BeltLineAddress = {
  beltLineId: string;
};

type MainBusAddress = {
  regionId: string;
  laneId: number;
};

export type BuildingAddress = {
  regionId: string;
  buildingIdx: number;
  buffer?: "input" | "output";
};

export type RegionAddress = {
  regionId: string;
  buffer?: "ore";
};

type InventoryAddress = {
  inventory: true;
};

type GlobalAddress = "global";

function isMainBusAddress(s: StateAddress): s is MainBusAddress {
  return (s as MainBusAddress).laneId !== undefined;
}

function isBeltLineAddress(s: StateAddress): s is BeltLineAddress {
  return (s as BeltLineAddress).beltLineId !== undefined;
}

function isBeltConnectionAddress(s: StateAddress): s is BeltConnectionAddress {
  return (s as BeltConnectionAddress).connectionIdx !== undefined;
}

function isBuildingAddress(s: StateAddress): s is BuildingAddress {
  const sb = s as BuildingAddress;
  return sb.buildingIdx !== undefined;
}

function isRegionAddress(s: StateAddress): s is RegionAddress {
  const sr = s as RegionAddress;
  return sr.regionId != undefined;
}

function isInventoryAddress(s: StateAddress): s is InventoryAddress {
  return (s as InventoryAddress).inventory;
}

function isGlobalAddress(s: StateAddress): s is GlobalAddress {
  return (s as string) === "global";
}

//| TransferItemAction
export type StateVMAction =
  | AddResearchCountAction
  | SetCurrentResearchAction
  | AddItemAction
  | AddProgressTrackerAction
  | SetRecipeAction
  | SetPropertyAction
  | PlaceBuildingAction
  | SwapBuildingsAction
  | AddRegionAction
  | ResetAction
  | AddMainBusLaneAction
  | RemoveMainBusLaneAction
  | AdvanceBeltLineAction
  | PlaceBeltLineAction;

type ResetAction = { kind: "Reset" } | { kind: "ResetToDebugState" };

type InserterAddress = InserterId;
// type SetPropertyAction = SetInserterPropertyAction<
//   keyof Omit<Inserter, "kind">
// >;

type BeltConnectionAddress = BuildingAddress & { connectionIdx: number };

type SetPropertyAction =
  | SetInserterPropertyAction
  | SetBuildingPropertyAction
  | SetGlobalPropertyAction
  | SetBeltConnectionPropertyAction;

type SetInserterPropertyAction =
  | TSetInserterPropertyAction<"direction">
  | TSetInserterPropertyAction<"BuildingCount">;

type SetBuildingPropertyAction = TSetBuildingPropertyAction<"BuildingCount">;

type SetBeltConnectionPropertyAction =
  TSetBeltConnectionPropertyAction<"laneId">;

type SetGlobalPropertyAction = TSetGlobalPropertyAction<
  "RocketLaunchingAt" | "Inventory" | "Research"
>;

type TSetBeltConnectionPropertyAction<P extends keyof BeltConnection> = {
  kind: "SetProperty";
  address: BeltConnectionAddress;
  property: P;
  value: BeltConnection[P];
};

type TSetInserterPropertyAction<P extends keyof Omit<Inserter, "kind">> = {
  kind: "SetProperty";
  address: InserterAddress;
  property: P;
  value: Inserter[P];
};

type TSetBuildingPropertyAction<P extends keyof Omit<Building, "kind">> = {
  kind: "SetProperty";
  address: BuildingAddress;
  property: P;
  value: Building[P];
};

type TSetGlobalPropertyAction<P extends keyof FactoryGameState> = {
  kind: "SetProperty";
  address: "global";
  property: P;
  value: FactoryGameState[P];
};

type SetRecipeAction = {
  kind: "SetRecipe";
  address: BuildingAddress;
  recipeId: string;
};

type AddMainBusLaneAction = {
  kind: "AddMainBusLane";
  address: RegionAddress;
  entity: string;
};

type RemoveMainBusLaneAction = {
  kind: "RemoveMainBusLane";
  address: MainBusAddress;
};

type AddItemAction = {
  kind: "AddItemCount";
  address: StateAddress;
  entity: string;
  count: number;
};

type AddProgressTrackerAction = {
  kind: "AddProgressTrackers";
  address: BuildingAddress;
  count: number;
  currentTick: number;
};

type AddResearchCountAction = {
  kind: "AddResearchCount";
  researchId: string;
  count: number;
  maxCount: number;
};
type AdvanceBeltLineAction = {
  kind: "AdvanceBeltLine";
  address: BeltLineAddress;
};

type SetCurrentResearchAction = {
  kind: "SetCurrentResearch";
  researchId: string;
};

type PlaceBuildingAction =
  | {
      kind: "PlaceBuilding";
      entity: string;
      address: BuildingAddress;
      BuildingCount: number;
    }
  | PlaceBeltLineDepotAction;

type PlaceBeltLineDepotAction = {
  kind: "PlaceBuilding";
  address: BuildingAddress;
  BuildingCount: number;
  entity: "transport-belt" | "fast-transport-belt" | "express-transport-belt";
  direction: "TO_BELT" | "FROM_BELT";
  beltLineAddress: BeltLineAddress;
};

type PlaceBeltLineAction = {
  kind: "PlaceBeltLine";
  entity: "transport-belt" | "fast-transport-belt" | "express-transport-belt";
  address: BeltLineAddress;
  BuildingCount: number;
  length: number;
};

type SwapBuildingsAction = {
  kind: "SwapBuildings";
  address: BuildingAddress;
  moveToAddress: BuildingAddress;
};

type AddRegionAction = {
  kind: "AddRegion";
  regionInfo: RegionInfo;
  regionId: string;
};

export type GameStateReducer = (a: StateVMActionWithError[]) => void;

export function applyStateChangeActions(
  gs: FactoryGameState,
  actions: StateVMActionWithError[]
): FactoryGameState {
  let state = gs;
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

function isPlaceBeltLineDepotAction(
  a: PlaceBuildingAction
): a is PlaceBeltLineDepotAction {
  return (a as PlaceBeltLineDepotAction).direction != undefined;
}

function stateChangePlaceBuilding(
  state: FactoryGameState,
  action: PlaceBuildingAction
): FactoryGameState {
  if (!isBuildingAddress(action.address)) throw new Error("NYI");
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

function isInserterAddress(address: StateAddress): address is InserterAddress {
  return (address as InserterAddress).location !== undefined;
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

export type StateVMActionWithError = StateVMAction & { error?: StateVMError };

export class StateVMError extends Error {
  action: StateVMAction;
  constructor(a: StateVMAction) {
    super("Error during action: " + JSON.stringify(a));
    this.action = a;
    Object.setPrototypeOf(this, StateVMError.prototype);
  }
}

export function getDispatchFunc(
  dispatchGameStateActions: (a: StateVMActionWithError[]) => void
) {
  const vmActions: StateVMActionWithError[] = [];
  const dispatch = (a: StateVMAction) => {
    console.log(a);
    vmActions.push({ ...a, error: new StateVMError(a) });
  };

  return {
    executeActions: () => {
      try {
        return dispatchGameStateActions(vmActions);
      } finally {
        vmActions.splice(0);
      }
    },
    dispatch,
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
