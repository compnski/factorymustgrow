import { Entities } from "./gen/entities";
import { Inventory, ReadonlyInventory } from "./inventory";
import { ResearchOutput } from "./research";
import { NewEntityStack } from "./types";
import { FactoryGameState, ResearchState } from "./useGameState";

export type StateAddress = MainBusAddress | BuildingAddress | InventoryAddress;

type MainBusAddress = {
  regionId: string;
  mainbusLane: number;
};

type BuildingAddress = {
  regionId: string;
  buildingSlot: number;
  buffer: "input" | "output";
};

type InventoryAddress = {
  inventory: true;
};

function isMainBusAddress(s: StateAddress): s is MainBusAddress {
  return (s as MainBusAddress).mainbusLane !== undefined;
}

function isBuildingAddress(s: StateAddress): s is BuildingAddress {
  return (s as BuildingAddress).buildingSlot !== undefined;
}

function isInventoryAddress(s: StateAddress): s is InventoryAddress {
  return (s as InventoryAddress).inventory;
}

export type StateVMAction =
  | TransferItemAction
  | SetResearchCountAction
  | SetCurrentResearchAction
  | AddItemAction;
//  | SetItemAction

// type SetItemAction = {
//   kind: "SetItemCount";
//   address: StateAddress;
//   entity: string;
//   count: number;
// };

type AddItemAction = {
  kind: "AddItemCount";
  address: StateAddress;
  entity: string;
  count: number;
};

type TransferItemAction = {
  kind: "TransferItems";
  from: StateAddress;
  to: StateAddress;
  entity: string;
  count: number;
};

type SetResearchCountAction = {
  kind: "SetResearchCount";
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
    case "SetResearchCount":
      state.Research = stateChangeSetResearchCount(state.Research, action);
      return state;
    case "SetCurrentResearch":
      state.Research = stateChangeSetCurrentResearch(state.Research, action);
      return state;
    // case "SetItemCount":
    //      return stateChangeSetItemCount(state, action);
    case "AddItemCount":
      return stateChangeAddItemCount(state, action);

    default:
      throw new Error("Unknown action kind: " + action);
  }
}

function stateChangeSetResearchCount(
  state: ResearchState,
  action: SetResearchCountAction
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
    if (researchProgress != action.count) {
      return {
        ...state,
        Progress: state.Progress.set(
          action.researchId,
          NewEntityStack(action.researchId, action.count, action.maxCount)
        ),
      };
    }
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

function stateChangeAddItemCount(
  state: FactoryGameState,
  action: AddItemAction
): FactoryGameState {
  const { address, count, entity } = action;
  if (isMainBusAddress(address)) {
    //
  } else if (isBuildingAddress(address)) {
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
          building.outputBuffers = building.outputBuffers.AddItems(
            entity,
            count
          );
        }

      region.BuildingSlots[buildingSlot].Building = building;
      state.Regions.set(regionId, region);
    }
  } else if (isInventoryAddress(address)) {
    //state.Inventory.
  } else {
    throw new Error("Unknown address: " + address);
  }
  //
  return state;
}
