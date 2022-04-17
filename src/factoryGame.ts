import { BuildingSlot } from "./building";
import { showResearchSelector } from "./components/selectors";
import { GameDispatch } from "./GameDispatch";
import { GetRecipe } from "./gen/entities";
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
import { Chest, UpdateChest } from "./storage";
import { UpdateBeltLine } from "./transport";
import { Region } from "./types";
import { GameStateFunc, GameStateMutableFunc } from "./state/FactoryGameState";

export async function UpdateGameState(
  tick: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generalDialog: (arg0: GeneralDialogConfig) => Promise<any[] | false>
) {
  try {
    //const currentRegion = GameState.Regions.get(GameState.CurrentRegionId)!;
    for (const [, currentBeltLine] of GameStateFunc().BeltLines) {
      UpdateBeltLine(tick, GameStateFunc().Regions, currentBeltLine);
    }
    for (const [, currentRegion] of GameStateFunc().Regions) {
      UpdateGameStateForRegion(tick, currentRegion);
    }
    // Check Research Completion
    if (IsResearchComplete(GameStateFunc().Research)) {
      console.log("Research Complete!");
      GameDispatch({ type: "CompleteResearch" });
      await showResearchSelector(generalDialog);
    }
  } catch (e) {
    //TODO Show error dialog
    console.error("Failed to update game state:", e);
  }
}

function UpdateGameStateForRegion(tick: number, currentRegion: Region) {
  // Reset rocket 10s after launch
  if (
    GameStateFunc().RocketLaunchingAt > 0 &&
    tick - GameStateFunc().RocketLaunchingAt > 10000
  ) {
    GameStateMutableFunc().RocketLaunchingAt = 0;
  }
  fixOutputStatus(currentRegion);
  //fixBeltConnections(currentRegion.BuildingSlots, currentRegion.Bus);
  currentRegion.BuildingSlots.forEach((slot, idx) => {
    const building = slot.Building;
    switch (building.kind) {
      case "Factory":
        ProduceFromFactory(building as Factory, tick, GetRecipe);
        break;
      case "Extractor":
        ProduceFromExtractor(building as Extractor, currentRegion, GetRecipe);
        break;
      case "Lab":
        ResearchInLab(building as Lab, GameStateFunc().Research, GetResearch);
        break;
      case "Chest":
        UpdateChest(building as Chest, tick);
    }

    if (idx < currentRegion.BuildingSlots.length - 1)
      MoveViaInserter(
        slot.Inserter,
        currentRegion.BuildingSlots[idx].Building,
        currentRegion.BuildingSlots[idx + 1].Building
      );

    PushPullFromMainBus(slot, currentRegion.Bus);
  });
}

// function fixBeltConnections(BuildingSlots: BuildingSlot[], bus: MainBus) {
//   // BuildingSlots.forEach((slot) => {
//   //   const building = slot.Building;
//   //   building.outputStatus.beltConnections.forEach((beltConn, idx) => {
//   //     if (beltConn.laneId !== undefined && !bus.HasLane(beltConn.laneId))
//   //       building.outputStatus.beltConnections.splice(idx, 1);
//   //   });
//   // });
// }

export function fixOutputStatus(region: { BuildingSlots: BuildingSlot[] }) {
  // TODO: Fix Inserters
  region.BuildingSlots.forEach((slot, idx) => {
    const i = slot.Inserter;
    if (
      i.direction === "DOWN" &&
      !CanPushTo(
        region.BuildingSlots[idx].Building,
        region.BuildingSlots[idx + 1].Building
      )
    )
      i.direction = "NONE";
    if (
      i.direction === "UP" &&
      !CanPushTo(
        region.BuildingSlots[idx + 1].Building,
        region.BuildingSlots[idx].Building
      )
    )
      i.direction = "NONE";
  });
}
