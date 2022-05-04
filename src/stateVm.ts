import { HasProgressTrackers } from "./AddProgressTracker";
import { Building, InserterId, NewEmptyLane } from "./building";
import { NewBuilding } from "./GameDispatch";
import { Inserter } from "./inserter";
import { ReadonlyInventory } from "./inventory";
import { Extractor, Factory, UpdateBuildingRecipe } from "./production";
import { NewEntityStack, NewRegionFromInfo, RegionInfo } from "./types";
import {
  FactoryGameState,
  initialFactoryGameState,
  ReadonlyRegion,
  ResearchState,
} from "./useGameState";
import { assertNever, replaceItem, swap } from "./utils";

export type DispatchFunc = (a: StateVMAction) => void;

export type StateAddress =
  | MainBusAddress
  | BuildingAddress
  | InventoryAddress
  | RegionAddress;

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

function isMainBusAddress(s: StateAddress): s is MainBusAddress {
  return (s as MainBusAddress).laneId !== undefined;
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
  | RemoveMainBusLaneAction;

type ResetAction = { kind: "Reset" };

type InserterAddress = InserterId;
// type SetPropertyAction = SetInserterPropertyAction<
//   keyof Omit<Inserter, "kind">
// >;

type SetPropertyAction = SetInserterPropertyAction | SetBuildingPropertyAction;

type SetInserterPropertyAction =
  | TSetInserterPropertyAction<"direction">
  | TSetInserterPropertyAction<"BuildingCount">;

type SetBuildingPropertyAction = TSetBuildingPropertyAction<"BuildingCount">;

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

// type TransferItemAction = {
//   kind: "TransferItems";
//   from: StateAddress;
//   to: StateAddress;
//   entity: string;
//   count: number;
// };

type AddResearchCountAction = {
  kind: "AddResearchCount";
  researchId: string;
  count: number;
  maxCount: number;
};

type SetCurrentResearchAction = {
  kind: "SetCurrentResearch";
  researchId: string;
};

type PlaceBuildingAction = {
  kind: "PlaceBuilding";
  entity: string;
  address: BuildingAddress;
  BuildingCount: number;
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

export type GameStateReducer = (a: StateVMAction[]) => void;

export function applyStateChangeActions(
  gs: FactoryGameState,
  actions: StateVMAction[]
): FactoryGameState {
  let state = gs;
  for (const action of actions) {
    state = applyStateChangeAction(state, action);
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
    // case "TransferItems":
    //   return stateChangeTransferItems(state, action);
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
    case "AddMainBusLane":
    case "RemoveMainBusLane":
      throw new Error("NYI");
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
  let region = state.Regions.get(action.address.regionId);
  if (!region) throw new Error("Missing region " + action.address.regionId);
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

function setInserterProperty(
  region: ReadonlyRegion,
  {
    property,
    value,
    address: { buildingIdx, location },
  }: SetInserterPropertyAction
): ReadonlyRegion {
  if (location != "BUILDING") throw new Error("NYI");

  const buildingSlot = region.BuildingSlots[buildingIdx];
  if (!buildingSlot) return region;
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
    console.log("resize chest", value);
    b = {
      ...b,
      outputBuffers: new ReadonlyInventory(
        value,
        (b.outputBuffers as ReadonlyInventory).Data,
        true
      ),
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
    //
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

  const newBuilding =
    buffer == "input"
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
