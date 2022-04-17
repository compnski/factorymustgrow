import { BuildingSlot } from "./building";
import { showResearchSelector } from "./components/selectors";
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
import { Chest, UpdateChest } from "./storage";
import { UpdateBeltLine } from "./transport";
import { Region } from "./types";
import { GameState } from "./useGameState";

export async function UpdateGameState(
  tick: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generalDialog: (arg0: GeneralDialogConfig) => Promise<any[] | false>
) {
  try {
    for (const [, currentBeltLine] of GameState.BeltLines) {
      UpdateBeltLine(tick, GameState.Regions, currentBeltLine);
    }
    for (const [, region] of GameState.Regions) {
      UpdateGameStateForRegion(tick, region);
    }
    // Check Research Completion
    if (IsResearchComplete(GameState.Research)) {
      console.log("Research Complete!");
      GameDispatch({ type: "CompleteResearch" });
      await showResearchSelector(generalDialog, GameState.Research);
    }
  } catch (e) {
    //TODO Show error dialog
    console.error("Failed to update game state:", e);
  }
}

function UpdateGameStateForRegion(tick: number, region: Region) {
  // Reset rocket 10s after launch
  if (
    GameState.RocketLaunchingAt > 0 &&
    tick - GameState.RocketLaunchingAt > 10000
  ) {
    GameState.RocketLaunchingAt = 0;
  }
  fixInserters(region);

  region.BuildingSlots.forEach((slot, idx) => {
    const building = slot.Building;
    switch (building.kind) {
      case "Factory":
        ProduceFromFactory(building as Factory, tick);
        break;
      case "Extractor":
        ProduceFromExtractor(building as Extractor, region);
        break;
      case "Lab":
        ResearchInLab(building as Lab, GameState.Research, GetResearch);
        break;
      case "Chest":
        UpdateChest(building as Chest, tick);
    }

    if (idx < region.BuildingSlots.length - 1)
      MoveViaInserter(
        slot.Inserter,
        region.BuildingSlots[idx].Building,
        region.BuildingSlots[idx + 1].Building
      );

    PushPullFromMainBus(slot, region.Bus);
  });
}

export function fixInserters(region: { BuildingSlots: BuildingSlot[] }) {
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
