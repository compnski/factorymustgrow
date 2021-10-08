import {
  Extractor,
  Factory,
  ProduceFromExtractor,
  ProduceFromFactory,
} from "./production";
import { Region } from "./types";
import { GetRecipe } from "./gen/entities";
import {
  CanPushTo,
  PushPullFromMainBus,
  PushToOtherProducer,
} from "./movement";
import { IsResearchComplete, Lab, ResearchInLab } from "./research";
import { GetResearch } from "./gen/research";
import { UIAction } from "./uiState";
import { GameState } from "./useGameState";
import { UpdateBeltLine } from "./transport";
import { MainBus } from "./mainbus";
import { GameDispatch } from "./GameDispatch";
import { Building, BuildingSlot } from "./building";
import { Inserter, InserterTransferRate } from "./inserter";

export const UpdateGameState = (
  tick: number,
  uiDispatch: (a: UIAction) => void
) => {
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
      uiDispatch({ type: "ShowResearchSelector" });
    }
  } catch (e) {
    //TODO Show error dialog
    console.error("Failed to update game state:", e);
  }
};

function UpdateGameStateForRegion(tick: number, currentRegion: Region) {
  fixOutputStatus(currentRegion);
  fixBeltConnections(currentRegion.BuildingSlots, currentRegion.Bus);
  currentRegion.BuildingSlots.forEach((slot, idx) => {
    const building = slot.Building;
    switch (building.kind) {
      case "Factory":
        ProduceFromFactory(building as Factory, GetRecipe);
        break;
      case "Extractor":
        ProduceFromExtractor(building as Extractor, currentRegion, GetRecipe);
        break;
      case "Lab":
        ResearchInLab(building as Lab, GameState.Research, GetResearch);
        break;
    }

    const i = slot.Inserter;
    if (InserterTransferRate(i) > 0) {
      if (i.direction === "DOWN") {
        PushToOtherProducer(
          currentRegion.BuildingSlots[idx].Building,
          currentRegion.BuildingSlots[idx + 1].Building,
          InserterTransferRate(i)
        );
      } else if (i.direction === "UP") {
        PushToOtherProducer(
          currentRegion.BuildingSlots[idx + 1].Building,
          currentRegion.BuildingSlots[idx].Building,
          InserterTransferRate(i)
        );
      }
    }
    PushPullFromMainBus(slot, currentRegion.Bus);
  });
}

function fixBeltConnections(BuildingSlots: BuildingSlot[], bus: MainBus) {
  BuildingSlots.forEach((slot) => {
    const building = slot.Building;
    building.outputStatus.beltConnections.forEach((beltConn, idx) => {
      if (!bus.HasLane(beltConn.beltId))
        building.outputStatus.beltConnections.splice(idx, 1);
    });
  });
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
