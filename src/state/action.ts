import { Building } from "../building";
import { Inserter } from "../inserter";
import {
  BeltConnectionAddress,
  InserterAddress,
  BuildingAddress,
  RegionAddress,
  MainBusAddress,
  StateAddress,
  BeltLineAddress,
} from "./address";
import { BeltConnection, RegionInfo } from "../types";
import { FactoryGameState } from "../factoryGameState";

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
  | PlaceBeltLineAction
  | RemoveBeltLineAction;

type ResetAction = { kind: "Reset" } | { kind: "ResetToDebugState" };

export type SetPropertyAction =
  | SetInserterPropertyAction
  | SetBuildingPropertyAction
  | SetGlobalPropertyAction
  | SetBeltConnectionPropertyAction;
export type SetInserterPropertyAction =
  | TSetInserterPropertyAction<"direction">
  | TSetInserterPropertyAction<"BuildingCount">;
export type SetBuildingPropertyAction =
  TSetBuildingPropertyAction<"BuildingCount">;
export type SetBeltConnectionPropertyAction =
  TSetBeltConnectionPropertyAction<"laneId">;
export type SetGlobalPropertyAction = TSetGlobalPropertyAction<
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

export type SetRecipeAction = {
  kind: "SetRecipe";
  address: BuildingAddress;
  recipeId: string;
};

export type AddMainBusLaneAction = {
  kind: "AddMainBusLane";
  address: RegionAddress;
  entity: string;
};

export type RemoveMainBusLaneAction = {
  kind: "RemoveMainBusLane";
  address: MainBusAddress;
};

export type AddItemAction = {
  kind: "AddItemCount";
  address: StateAddress;
  entity: string;
  count: number;
};

export type AddProgressTrackerAction = {
  kind: "AddProgressTrackers";
  address: BuildingAddress;
  count: number;
  currentTick: number;
};

export type AddResearchCountAction = {
  kind: "AddResearchCount";
  researchId: string;
  count: number;
  maxCount: number;
};

export type AdvanceBeltLineAction = {
  kind: "AdvanceBeltLine";
  address: BeltLineAddress;
};

export type SetCurrentResearchAction = {
  kind: "SetCurrentResearch";
  researchId: string;
};

export type PlaceBuildingAction =
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

export type PlaceBeltLineAction = {
  kind: "PlaceBeltLine";
  entity: "transport-belt" | "fast-transport-belt" | "express-transport-belt";
  address: BeltLineAddress;
  BuildingCount: number;
  length: number;
};

export type RemoveBeltLineAction = {
  kind: "RemoveBeltLine";
  address: BeltLineAddress;
};

export type SwapBuildingsAction = {
  kind: "SwapBuildings";
  address: BuildingAddress;
  moveToAddress: BuildingAddress;
};

export type AddRegionAction = {
  kind: "AddRegion";
  regionInfo: RegionInfo;
  regionId: string;
};

export function isPlaceBeltLineDepotAction(
  a: PlaceBuildingAction
): a is PlaceBeltLineDepotAction {
  return (a as PlaceBeltLineDepotAction).direction != undefined;
}
