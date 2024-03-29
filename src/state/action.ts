import { Building } from "../building"
import { FactoryGameState } from "../factoryGameState"
import { Inserter } from "../inserter"
import { Belt, BeltConnection, RegionInfo } from "../types"
import {
  BeltConnectionAddress,
  BuildingAddress,
  InserterAddress,
  MainBusAddress,
  StateAddress,
  TruckLineAddress,
} from "./address"

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
  | AdvanceTruckLineAction
  | PlaceTruckLineAction
  | RemoveTruckLineAction
  | AdvanceMainBusLaneAction

type ResetAction = { kind: "Reset" } | { kind: "ResetTo"; state: FactoryGameState }

export type SetPropertyAction =
  | SetInserterPropertyAction
  | SetBuildingPropertyAction
  | SetGlobalPropertyAction
  | SetBeltConnectionPropertyAction
  | SetMainBusBeltPropertyAction

export type SetInserterPropertyAction =
  | TSetInserterPropertyAction<"direction">
  | TSetInserterPropertyAction<"BuildingCount">
export type SetBuildingPropertyAction = TSetBuildingPropertyAction<"BuildingCount">
export type SetBeltConnectionPropertyAction = TSetBeltConnectionPropertyAction<"laneId">
export type SetGlobalPropertyAction = TSetGlobalPropertyAction<"RocketLaunchingAt" | "Inventory" | "Research">
export type SetMainBusBeltPropertyAction = TSetMainBusBeltPropertyAction<"entity">

type TSetMainBusBeltPropertyAction<P extends keyof Belt> = {
  kind: "SetProperty"
  address: MainBusAddress
  property: P
  value: Belt[P]
}

type TSetBeltConnectionPropertyAction<P extends keyof BeltConnection> = {
  kind: "SetProperty"
  address: BeltConnectionAddress
  property: P
  value: BeltConnection[P]
}

type TSetInserterPropertyAction<P extends keyof Omit<Inserter, "kind">> = {
  kind: "SetProperty"
  address: InserterAddress
  property: P
  value: Inserter[P]
}

type TSetBuildingPropertyAction<P extends keyof Omit<Building, "kind">> = {
  kind: "SetProperty"
  address: BuildingAddress
  property: P
  value: Building[P]
}

type TSetGlobalPropertyAction<P extends keyof FactoryGameState> = {
  kind: "SetProperty"
  address: "global"
  property: P
  value: FactoryGameState[P]
}

export type SetRecipeAction = {
  kind: "SetRecipe"
  address: BuildingAddress
  recipeId: string
}

export type AddMainBusLaneAction = {
  kind: "AddMainBusLane"
  address: MainBusAddress
  lowerSlotIdx: number
  beltDirection: "UP" | "DOWN"
  endDirection: "LEFT" | "RIGHT" | "NONE"
}

export type AdvanceMainBusLaneAction = {
  kind: "AdvanceMainBusLane"
  address: MainBusAddress
}

export type RemoveMainBusLaneAction = {
  kind: "RemoveMainBusLane"
  address: MainBusAddress
}

export type AddItemAction = {
  kind: "AddItemCount"
  address: StateAddress
  entity: string
  count: number
}

export type AddProgressTrackerAction = {
  kind: "AddProgressTrackers"
  address: BuildingAddress
  count: number
  currentTick: number
}

export type AddResearchCountAction = {
  kind: "AddResearchCount"
  researchId: string
  count: number
  maxCount: number
}

export type AdvanceTruckLineAction = {
  kind: "AdvanceTruckLine"
  address: TruckLineAddress
}

export type SetCurrentResearchAction = {
  kind: "SetCurrentResearch"
  researchId: string
}

export type PlaceBuildingAction =
  | {
      kind: "PlaceBuilding"
      entity: string
      address: BuildingAddress
      BuildingCount: number
    }
  | PlaceTruckLineDepotAction

type PlaceTruckLineDepotAction = {
  kind: "PlaceBuilding"
  address: BuildingAddress
  BuildingCount: number
  entity: "concrete"
  direction: "TO_BELT" | "FROM_BELT"
  truckLineAddress: TruckLineAddress
}

export type PlaceTruckLineAction = {
  kind: "PlaceTruckLine"
  entity: "concrete"
  address: TruckLineAddress
  BuildingCount: number
  length: number
}

export type RemoveTruckLineAction = {
  kind: "RemoveTruckLine"
  address: TruckLineAddress
}

export type SwapBuildingsAction = {
  kind: "SwapBuildings"
  address: BuildingAddress
  moveToAddress: BuildingAddress
}

export type AddRegionAction = {
  kind: "AddRegion"
  regionInfo: RegionInfo
  regionId: string
}

export function isPlaceTruckLineDepotAction(a: PlaceBuildingAction): a is PlaceTruckLineDepotAction {
  return (a as PlaceTruckLineDepotAction).direction != undefined
}
