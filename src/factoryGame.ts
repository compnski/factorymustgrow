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
  PushToNeighbors,
  PushToOtherProducer,
} from "./movement";
import { IsResearchComplete, Lab, ResearchInLab } from "./research";
import { GetResearch } from "./gen/research";
import { UIAction } from "./uiState";
import { GameState } from "./useGameState";
import { UpdateBeltLine } from "./transport";
import { MainBus } from "./mainbus";
import { GameDispatch } from "./GameDispatch";
import { Building } from "./building";
import { InserterTransferRate } from "./inserter";

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
  fixBeltConnections(currentRegion.Buildings, currentRegion.Bus);
  currentRegion.Buildings.forEach((p) => {
    switch (p.kind) {
      case "Factory":
        ProduceFromFactory(p as Factory, GetRecipe);
        break;
      case "Extractor":
        ProduceFromExtractor(p as Extractor, currentRegion, GetRecipe);
        break;
      case "Lab":
        ResearchInLab(p as Lab, GameState.Research, GetResearch);
        break;
    }
  });

  currentRegion.Inserters.forEach((i, idx) => {
    if (InserterTransferRate(i) <= 0) return;
    if (i.direction === "DOWN") {
      PushToOtherProducer(
        currentRegion.Buildings[idx],
        currentRegion.Buildings[idx + 1],
        InserterTransferRate(i)
      );
    } else if (i.direction === "UP") {
      PushToOtherProducer(
        currentRegion.Buildings[idx + 1],
        currentRegion.Buildings[idx],
        InserterTransferRate(i)
      );
    }
  });
  currentRegion.Buildings.forEach((p, idx) => {
    //   PushToNeighbors(
    //     p,
    //     currentRegion.Buildings[idx - 1],
    //     currentRegion.Buildings[idx + 1]
    //   );
    PushPullFromMainBus(p, currentRegion.Bus);
  });
}

function fixBeltConnections(buildings: Building[], bus: MainBus) {
  buildings.forEach((p) => {
    p.outputStatus.beltConnections.forEach((beltConn, idx) => {
      if (!bus.HasLane(beltConn.beltId))
        p.outputStatus.beltConnections.splice(idx, 1);
    });
  });
}

export function fixOutputStatus(region: { Buildings: Building[] }) {
  region.Buildings.forEach((p, idx) => {
    if (
      p.outputStatus.above === "OUT" &&
      !CanPushTo(p, region.Buildings[idx - 1])
    )
      p.outputStatus.above = "NONE";
    if (
      p.outputStatus.below === "OUT" &&
      !CanPushTo(p, region.Buildings[idx + 1])
    )
      p.outputStatus.below = "NONE";
  });
}
