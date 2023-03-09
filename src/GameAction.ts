import { Building, InserterId } from "./building";
import { FactoryGameState } from "./factoryGameState";
import { StateVMAction } from "./state/action";

export type GameAction =
  | BasicAction
  | ProducerAction
  | BuildingAction
  | InventoryTransferAction
  | LaneAction
  | RegionAction
  | DragBuildingAction
  | ChangeRecipeAction
  | InserterAction
  | LaunchRocketAction
  | UpdateStateAction
  | ResetToAction
  | SaveGameAction;

type UpdateStateAction = {
  type: "UpdateState";
  action: StateVMAction;
};

type LaneAction =
  | {
      type: "RemoveLane";
      laneId: number;
      upperSlotIdx: number;
      regionId: string;
      lowerSlotIdx: number;
    }
  | {
      type: "SetLaneEntity";
      laneId: number;
      upperSlotIdx: number;
      entity: string;
      regionId: string;
    }
  | {
      type: "AddLane";
      regionId: string;
      laneId: number;
      upperSlotIdx: number;
      lowerSlotIdx: number;
      beltDirection: "UP" | "DOWN";
      originalUpperSlotIdx?: number;
      endDirection: "LEFT" | "RIGHT" | "NONE";
    };
type RegionAction = {
  type: "ClaimRegion";
  regionId: string;
};
type DragBuildingAction = {
  type: "ReorderBuildings";
  regionId: string;
  buildingIdx: number;
  dropBuildingIdx: number;
  isDropOnLastBuilding: boolean;
};
type ProducerAction = {
  type: "ChangeResearch";
  producerName: string;
};
type BasicAction = {
  type: "CompleteResearch" | "Reset";
};

type ResetToAction = {
  type: "ResetTo";
  state: FactoryGameState;
};

type SaveGameAction = {
  type: "SaveGame";
  saveVersion: string;
  cloudSaveName?: string;
};

type BuildingAction =
  | {
      type:
        | "RemoveBuilding"
        | "IncreaseBuildingCount"
        | "DecreaseBuildingCount";
      regionId: string;
      buildingIdx: number;
    }
  | {
      type: "PlaceBuilding";
      entity: string;
      regionId: string;
      buildingIdx: number;
    }
  | {
      type: "PlaceTruckLine";
      entity: "concrete";
      beltLength: number;
      targetRegion: string;
      regionId: string;
      buildingIdx: number;
    }
  | {
      type: "AddMainBusConnection";
      regionId: string;
      buildingIdx: number;
      laneId: number;
      direction: "FROM_BUS" | "TO_BUS";
    }
  | {
      type: "RemoveMainBusConnection";
      regionId: string;
      buildingIdx: number;
      connectionIdx: number;
    };

type LaunchRocketAction = {
  type: "LaunchRocket";
  regionId: string;
  buildingIdx: number;
};

type InserterAction = {
  type:
    | "IncreaseInserterCount"
    | "DecreaseInserterCount"
    | "ToggleInserterDirection";
  // location: "BELT" | "BUILDING";
  // buildingIdx: number;
  // connectionIdx?: number;
} & InserterId;

type ChangeRecipeAction = {
  type: "ChangeRecipe";
  regionId: string;
  buildingIdx: number;
  recipeId: string;
};
export type InventoryTransferAction =
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
      otherStackKind: "Building";
      regionId: string;
      buildingIdx: number;
    }
  | {
      type: "TransferToInventory" | "TransferFromInventory";
      entity: string;
      otherStackKind: "Void";
      count?: number;
    };
