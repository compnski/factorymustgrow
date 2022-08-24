import { showResearchSelector } from "./components/selectors";
import { FactoryGameState, ReadonlyBuildingSlot } from "./factoryGameState";
import { GameAction } from "./GameAction";
import { GetRegion } from "./GameDispatch";
import { GetResearch } from "./gen/research";
import { GeneralDialogConfig } from "./GeneralDialogProvider";
import { MoveViaInserter } from "./inserter";
import { PushPullFromMainBus } from "./main_bus";
import { CanPushTo } from "./movement";
import {
  Extractor,
  Factory,
  ProduceFromExtractor,
  ProduceFromFactory,
} from "./production";
import { IsResearchComplete, Lab, ResearchInLab } from "./research";
import { DispatchFunc } from "./stateVm";
import { Chest, UpdateChest } from "./storage";
import { TruckLineDepot, UpdateTruckLineDepot } from "./transport";

export async function UpdateGameState(
  gameState: FactoryGameState,
  {
    dispatch,
    executeActions,
  }: {
    dispatch: DispatchFunc;
    executeActions: (
      gameState: FactoryGameState,
      dontExposeState?: boolean
    ) => FactoryGameState;
  },
  tick: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generalDialog: (arg0: GeneralDialogConfig) => Promise<{
    returnData: string[] | false;
    uxDispatch: (a: GameAction) => void;
  }>
) {
  try {
    for (const [, currentTruckLine] of gameState.TruckLines) {
      dispatch({
        kind: "AdvanceTruckLine",
        address: { truckLineId: currentTruckLine.truckLineId },
      });
    }
    for (const [regionId] of gameState.Regions) {
      gameState = UpdateGameStateForRegion(
        tick,
        dispatch,
        (gs: FactoryGameState) => executeActions(gs, true),
        gameState,
        regionId
      );
    }
    // Check Research Completion
    if (IsResearchComplete(gameState.Research)) {
      console.log("Research Complete!");
      dispatch({ kind: "SetCurrentResearch", researchId: "" });
      void showResearchSelector(generalDialog, gameState.Research);
    }
  } catch (e) {
    //TODO Show error dialog
    console.error("Failed to update game state:", e);
  }

  executeActions({ ...gameState, LastTick: tick });
}

function UpdateGameStateForRegion(
  tick: number,
  dispatch: DispatchFunc,
  executeActions: (gameState: FactoryGameState) => FactoryGameState,
  gs: FactoryGameState,
  regionId: string
): FactoryGameState {
  let gameState = gs;
  let region = GetRegion(gs, regionId);
  if (!region) throw new Error("Missing region: " + regionId);
  // Reset rocket 10s after launch
  if (
    gameState.RocketLaunchingAt > 0 &&
    tick - gameState.RocketLaunchingAt > 10000
  ) {
    dispatch({
      kind: "SetProperty",
      address: "global",
      property: "RocketLaunchingAt",
      value: 0,
    });
  }

  fixInserters(dispatch, region);

  for (const idx of region.BuildingSlots.keys()) {
    const slot = region.BuildingSlots[idx];
    const address = { regionId: region.Id, buildingIdx: idx };
    const building = slot.Building;
    switch (building.kind) {
      case "Factory":
        ProduceFromFactory(building as Factory, dispatch, address, tick);
        break;
      case "Extractor":
        ProduceFromExtractor(
          building as Extractor,
          region,
          dispatch,
          address,
          tick
        );
        break;
      case "Lab":
        ResearchInLab(
          tick,
          address,
          building as Lab,
          gameState.Research,
          dispatch,
          GetResearch
        );
        break;
      case "Chest":
        UpdateChest(dispatch, building as Chest, address, tick);
        break;
      case "TruckLineDepot":
        UpdateTruckLineDepot(
          building as TruckLineDepot,
          dispatch,
          address,
          gameState,
          tick
        );
    }

    if (idx < region.BuildingSlots.length - 1)
      MoveViaInserter(
        dispatch,
        region.Id,
        slot.Inserter,
        idx,
        region.BuildingSlots[idx].Building,
        region.BuildingSlots[idx + 1].Building
      );
    gameState = executeActions(gameState);
    region = GetRegion(gameState, regionId);
  }

  //AdvanceMainBus()
  for (const busLane of region.Bus.Belts) {
    dispatch({
      kind: "AdvanceMainBusLane",
      address: {
        regionId,
        laneId: busLane.laneIdx,
        upperSlotIdx: busLane.upperSlotIdx,
      },
    });
    gameState = executeActions(gameState);
  }
  gameState = executeActions(gameState);
  region = GetRegion(gameState, regionId);

  region.BuildingSlots.forEach((_, idx) => {
    region = GetRegion(gameState, regionId);
    const slot = region.BuildingSlots[idx];
    const address = { regionId: region.Id, buildingIdx: idx };
    if (!region) throw new Error("Missing region");
    PushPullFromMainBus(dispatch, idx, slot, region.Bus, address);
    gameState = executeActions(gameState);
  });
  return gameState;
}

export function fixInserters(
  dispatch: DispatchFunc,
  region: { readonly Id: string; BuildingSlots: ReadonlyBuildingSlot[] }
) {
  // TODO: Fix Inserters
  region.BuildingSlots.forEach((slot, idx) => {
    const i = slot.Inserter;
    if (
      (i.direction === "DOWN" &&
        !CanPushTo(
          region.BuildingSlots[idx].Building,
          region.BuildingSlots[idx + 1].Building
        )) ||
      (i.direction === "UP" &&
        !CanPushTo(
          region.BuildingSlots[idx + 1].Building,
          region.BuildingSlots[idx].Building
        ))
    )
      dispatch({
        kind: "SetProperty",
        address: {
          regionId: region.Id,
          buildingIdx: idx,
          location: "BUILDING",
        },
        property: "direction",
        value: "NONE",
      });
  });
}
