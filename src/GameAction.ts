import { Building } from "./building";

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
  | InserterAction;

type AddBuildingAction = {
  type: "AddBuilding";
} & Pick<Building, "kind" | "subkind">;
type LaneAction =
  | {
      type: "RemoveLane";
      laneId: number;
    }
  | {
      type: "AddLane";
      entity: string;
    };
type RegionAction = {
  type: "ClaimRegion" | "ChangeRegion";
  regionId: string;
};
type DragBuildingAction = {
  type: "ReorderBuildings";
  buildingIdx: number;
  dropBuildingIdx: number;
  isDropOnLastBuilding: boolean;
};
type ProducerAction = {
  type: "ChangeResearch";
  producerName: string;
};
type BasicAction = {
  type: "NewLab" | "CompleteResearch" | "Reset";
};
type BuildingAction =
  | {
      type:
        | "RemoveBuilding"
        | "IncreaseBuildingCount"
        | "DecreaseBuildingCount";
      buildingIdx: number;
    }
  | {
      type: "PlaceBuilding";
      entity: string;
      buildingIdx?: number;
    }
  | {
      type: "PlaceBeltLine";
      entity:
        | "transport-belt"
        | "fast-transport-belt"
        | "express-transport-belt";
      beltLength: number;
      targetRegion: string;
      buildingIdx?: number;
    };

type InserterAction = {
  type:
    | "IncreaseInserterCount"
    | "DecreaseInserterCount"
    | "ToggleInserterDirection";

  inserterIdx: number;
};

type ChangeRecipeAction = {
  type: "ChangeRecipe";
  buildingIdx: number;
  recipeId: string;
};
export type InventoryTransferAction =
  | {
      type: "TransferToInventory" | "TransferFromInventory";
      entity: string;
      otherStackKind: "MainBus";
      laneId: number;
    }
  | {
      type: "TransferToInventory" | "TransferFromInventory";
      entity: string;
      otherStackKind: "Building";
      buildingIdx: number;
    }
  | {
      type: "TransferToInventory" | "TransferFromInventory";
      entity: string;
      otherStackKind: "Void";
      count?: number;
    };
