import { HasProgressTrackers } from "./AddProgressTracker";
import { Inventory, ReadonlyInventory } from "./inventory";
import { UpdateBuildingRecipe } from "./production";
import { ResearchOutput } from "./research";
import { NewEntityStack } from "./types";
import { FactoryGameState, ResearchState } from "./useGameState";

export type DispatchFunc = (a: StateVMAction) => void;

export type StateAddress =
  | MainBusAddress
  | BuildingAddress
  | InventoryAddress
  | RegionAddress;

type MainBusAddress = {
  regionId: string;
  mainbusLane: number;
};

export type BuildingAddress = {
  regionId: string;
  buildingSlot: number;
  buffer?: "input" | "output";
};

export type RegionAddress = {
  regionId: string;
  buffer: "ore";
};

type InventoryAddress = {
  inventory: true;
};

function isMainBusAddress(s: StateAddress): s is MainBusAddress {
  return (s as MainBusAddress).mainbusLane !== undefined;
}

function isBuildingAddress(s: StateAddress): s is BuildingAddress {
  const sb = s as BuildingAddress;
  return sb.buildingSlot !== undefined;
}

function isRegionAddress(s: StateAddress): s is RegionAddress {
  const sr = s as RegionAddress;
  return sr.buffer === "ore";
}

function isInventoryAddress(s: StateAddress): s is InventoryAddress {
  return (s as InventoryAddress).inventory;
}

export type StateVMAction =
  | TransferItemAction
  | AddResearchCountAction
  | SetCurrentResearchAction
  | AddItemAction
  | AddProgressTrackerAction
  | SetRecipeAction;

//  | SetItemAction

// type SetItemAction = {
//   kind: "SetItemCount";
//   address: StateAddress;
//   entity: string;
//   count: number;
// };

type SetRecipeAction = {
  kind: "SetRecipe";
  address: BuildingAddress;
  recipeId: string;
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

type TransferItemAction = {
  kind: "TransferItems";
  from: StateAddress;
  to: StateAddress;
  entity: string;
  count: number;
};

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
    case "TransferItems":
      return stateChangeTransferItems(state, action);
    case "AddResearchCount":
      state.Research = stateChangeAddResearchCount(state.Research, action);
      return state;
    case "SetCurrentResearch":
      state.Research = stateChangeSetCurrentResearch(state.Research, action);
      return state;
    // case "SetItemCount":
    //      return stateChangeSetItemCount(state, action);
    case "AddItemCount":
      return stateChangeAddItemCount(state, action);
    case "AddProgressTrackers":
      return stateChangeAddProgressTrackers(state, action);
    case "SetRecipe":
      return stateChangeSetRecipe(state, action);

    default:
      throw new Error("Unknown action kind: " + JSON.stringify(action));
  }
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
  return state;
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
function stateChangeTransferItems(
  gs: FactoryGameState,
  action: StateVMAction
): FactoryGameState {
  console.log(action);
  return gs;
}

function stateChangeSetRecipe(
  state: FactoryGameState,
  action: SetRecipeAction
): FactoryGameState {
  const {
    address: { regionId, buildingSlot },
    recipeId,
  } = action;
  const region = state.Regions.get(regionId);
  if (!region) throw new Error("Missing region");
  const currentBuilding = region.BuildingSlots[buildingSlot].Building;
  if (
    currentBuilding.kind == "Factory" ||
    currentBuilding.kind == "Extractor"
  ) {
    const { inventory, building } = UpdateBuildingRecipe(
      state.Inventory,
      currentBuilding,
      recipeId
    );
    state.Inventory = inventory;
    region.BuildingSlots[buildingSlot].Building = building;
    state.Regions.set(regionId, region);
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
  } else if (isRegionAddress(address)) {
    const { regionId, buffer } = address;
    const region = state.Regions.get(regionId);
    if (region && buffer === "ore") {
      region.Ore = region.Ore.AddItems(entity, count);
      state.Regions.set(regionId, region);
    }
  } else if (isBuildingAddress(address)) {
    addItemsToBuilding(address, state, entity, count);
  } else if (isInventoryAddress(address)) {
    state.Inventory = state.Inventory.AddItems(entity, count);
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
  const { regionId, buildingSlot, buffer } = address;
  const region = state.Regions.get(regionId);
  const building = region?.BuildingSlots[buildingSlot].Building;
  if (building) {
    if (buffer == "input")
      if (building.inputBuffers instanceof Inventory) {
        building.inputBuffers.Add(NewEntityStack(entity, count), Infinity);
      } else if (building.inputBuffers instanceof ReadonlyInventory) {
        building.inputBuffers = building.inputBuffers.AddItems(entity, count);
      }
    if (buffer == "output")
      if (building.outputBuffers instanceof Inventory) {
        if (count > 0)
          building.outputBuffers.Add(NewEntityStack(entity, count), Infinity);
        else
          building.outputBuffers.Remove(
            NewEntityStack(entity, 0, Infinity),
            -count,
            false
          );
      } else if (
        building.outputBuffers instanceof ReadonlyInventory ||
        building.outputBuffers instanceof ResearchOutput
      ) {
        building.outputBuffers = building.outputBuffers.AddItems(entity, count);
      }

    region.BuildingSlots[buildingSlot].Building = building;
    state.Regions.set(regionId, region);
  }
}

function stateChangeAddProgressTrackers(
  state: FactoryGameState,
  action: AddProgressTrackerAction
): FactoryGameState {
  const { address, count, currentTick } = action;
  const { regionId, buildingSlot } = address;
  const region = state.Regions.get(regionId);
  const building = region?.BuildingSlots[buildingSlot].Building;
  if (!building)
    throw new Error("Cannot find building at " + JSON.stringify(address));

  if (HasProgressTrackers(building)) {
    if (count > 0) {
      building.progressTrackers = building.progressTrackers.concat(
        new Array(count).fill(currentTick)
      );
    } else if (count < 0) {
      building.progressTrackers = building.progressTrackers.slice(-count);
    }
  }
  return state;
}
