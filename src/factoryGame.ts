import { BuildingSlot } from "./building";
import { showResearchSelector } from "./components/selectors";
import { GameAction } from "./GameAction";
import { GameDispatch } from "./GameDispatch";
import { GetResearch } from "./gen/research";
import { GeneralDialogConfig } from "./GeneralDialogProvider";
import { MoveViaInserter } from "./inserter";
import { PushPullFromMainBus } from "./MainBusMovement";
import { CanPushTo } from "./movement";
import {
  Extractor,
  Factory,
  ProduceFromExtractor,
  ProduceFromFactory,
} from "./production";
import { IsResearchComplete, Lab, ResearchInLab } from "./research";
import { DispatchFunc, StateVMAction } from "./stateVm";
import { Chest, UpdateChest } from "./storage";
import { UpdateBeltLine } from "./transport";
import { Region } from "./types";
import { FactoryGameState } from "./useGameState";

export async function UpdateGameState(
  gameState: FactoryGameState,
  dispatchGameStateActions: (a: StateVMAction[]) => void,
  tick: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generalDialog: (arg0: GeneralDialogConfig) => Promise<any[] | false>
) {
  const uxDispatch = (action: GameAction) => {
    GameDispatch(dispatchGameStateActions, gameState, action);
  };

  try {
    for (const [, currentBeltLine] of gameState.BeltLines) {
      UpdateBeltLine(tick, gameState.Regions, currentBeltLine);
    }
    for (const [, region] of gameState.Regions) {
      UpdateGameStateForRegion(
        gameState,
        dispatchGameStateActions,
        tick,
        region
      );
    }
    // Check Research Completion
    if (IsResearchComplete(gameState.Research)) {
      console.log("Research Complete!");
      //GameDispatch({ type: "CompleteResearch" });
      //GameState.Research.CurrentResearchId = "";
      dispatchGameStateActions([
        { kind: "SetCurrentResearch", researchId: "" },
      ]);
      await showResearchSelector(generalDialog, uxDispatch, gameState.Research);
    }
  } catch (e) {
    //TODO Show error dialog
    console.error("Failed to update game state:", e);
  }
}

function UpdateGameStateForRegion(
  gameState: FactoryGameState,
  dispatchGameStateActions: (a: StateVMAction[]) => void,
  tick: number,
  region: Region
) {
  // Reset rocket 10s after launch
  if (
    gameState.RocketLaunchingAt > 0 &&
    tick - gameState.RocketLaunchingAt > 10000
  ) {
    gameState.RocketLaunchingAt = 0;
  }

  const vmActions: StateVMAction[] = [];
  const vmDispatch = (a: StateVMAction) => {
    console.log(a);
    vmActions.push(a);
  };

  fixInserters(vmDispatch, region);

  region.BuildingSlots.forEach((slot, idx) => {
    const address = { regionId: region.Id, buildingIdx: idx };
    const building = slot.Building;
    switch (building.kind) {
      case "Factory":
        ProduceFromFactory(building as Factory, vmDispatch, address, tick);
        break;
      case "Extractor":
        ProduceFromExtractor(
          building as Extractor,
          region,
          vmDispatch,
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
          vmDispatch,
          GetResearch
        );
        break;
      case "Chest":
        UpdateChest(building as Chest, tick);
    }

    if (idx < region.BuildingSlots.length - 1)
      MoveViaInserter(
        vmDispatch,
        region.Id,
        slot.Inserter,
        idx,
        region.BuildingSlots[idx].Building,
        region.BuildingSlots[idx + 1].Building
      );

    PushPullFromMainBus(vmDispatch, slot, region.Bus);
  });
  dispatchGameStateActions(vmActions);
  //applyStateChangeActions(GameState, vmActions);
}

export function fixInserters(
  dispatch: DispatchFunc,
  region: { Id: string; BuildingSlots: BuildingSlot[] }
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
