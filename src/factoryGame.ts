import {
  Extractor,
  Factory,
  ProduceFromExtractor,
  ProduceFromFactory,
} from "./production";
import { NewEntityStack, Region } from "./types";
import { GetRecipe } from "./gen/entities";
import { CanPushTo } from "./movement";
import { PushPullFromMainBus } from "./MainBusMovement";
import { IsResearchComplete, Lab, ResearchInLab } from "./research";
import { GetResearch } from "./gen/research";
import { GameState } from "./useGameState";
import { UpdateBeltLine } from "./transport";
import { MainBus } from "./mainbus";
import { GameDispatch } from "./GameDispatch";
import { BuildingSlot } from "./building";
import { MoveViaInserter } from "./inserter";
import { Chest, UpdateChest } from "./storage";

export const UpdateGameState = (tick: number) => {
  try {
    //const currentRegion = GameState.Regions.get(GameState.CurrentRegionId)!;
    for (var [, currentBeltLine] of GameState.BeltLines) {
      UpdateBeltLine(tick, GameState.Regions, currentBeltLine);
    }
    for (var [, currentRegion] of GameState.Regions) {
      UpdateGameStateForRegion(tick, currentRegion);
    }
    // Check Research Completion
    if (IsResearchComplete(GameState.Research)) {
      console.log("Research Complete!");
      GameDispatch({ type: "CompleteResearch" });
    }
  } catch (e) {
    //TODO Show error dialog
    console.error("Failed to update game state:", e);
  }
};

function UpdateGameStateForRegion(tick: number, currentRegion: Region) {
  // Reset rocket 10s after launch
  if (
    GameState.RocketLaunchingAt > 0 &&
    tick - GameState.RocketLaunchingAt > 10000
  ) {
    GameState.RocketLaunchingAt = 0;
  }
  fixOutputStatus(currentRegion);
  fixBeltConnections(currentRegion.BuildingSlots, currentRegion.Bus);
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
        ResearchInLab(building as Lab, GameState.Research, GetResearch);
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

function fixBeltConnections(BuildingSlots: BuildingSlot[], bus: MainBus) {
  // BuildingSlots.forEach((slot) => {
  //   const building = slot.Building;
  //   building.outputStatus.beltConnections.forEach((beltConn, idx) => {
  //     if (beltConn.laneId !== undefined && !bus.HasLane(beltConn.laneId))
  //       building.outputStatus.beltConnections.splice(idx, 1);
  //   });
  // });
}

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
