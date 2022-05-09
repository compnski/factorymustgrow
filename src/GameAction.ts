import { Building, InserterId } from "./building";
import { StateVMAction } from "./state/action";

export type GameAction =
  | BasicAction
  | ProducerAction
  | BuildingAction
  | InventoryTransferAction
  | LaneAction
  | RegionAction
  | AddBuildingAction
  | DragBuildingAction
  | ChangeRecipeAction
  | InserterAction
  | LaunchRocketAction
  | UpdateStateAction;

type UpdateStateAction = {
  type: "UpdateState";
  action: StateVMAction;
};

type AddBuildingAction = {
  type: "AddBuilding";
} & Pick<Building, "kind" | "subkind">;
type LaneAction =
  | {
      type: "RemoveLane";
      laneId: number;
      regionId: string;
    }
  | {
      type: "AddLane";
      entity: string;
      regionId: string;
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
      type: "PlaceBeltLine";
      entity:
        | "transport-belt"
        | "fast-transport-belt"
        | "express-transport-belt";
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
