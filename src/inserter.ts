import { VMPushToOtherBuilding } from "./movement";
import { StateVMAction } from "./stateVm";
import { ReadonlyBuilding } from "./useGameState";

export type Inserter = {
  kind: "Inserter";
  subkind: "inserter" | "fast-inserter" | "stack-inserter";
  BuildingCount: number;
  direction: "UP" | "DOWN" | "TO_BUS" | "FROM_BUS" | "NONE";
};

export function NewInserter(
  count = 0,
  direction: "UP" | "DOWN" | "TO_BUS" | "FROM_BUS" | "NONE" = "NONE",
  subkind: "inserter" | "fast-inserter" | "stack-inserter" = "inserter"
): Inserter {
  return {
    kind: "Inserter",
    subkind,
    BuildingCount: count,
    direction: direction,
  };
}

export function InserterTransferRate(i: Inserter): number {
  return (i.direction !== "NONE" && i.BuildingCount) || 0;
}

export function MoveViaInserter(
  dispatch: (a: StateVMAction) => void,
  regionId: string,
  i: Inserter,
  currentBuildingSlot: number,
  currentBuilding: ReadonlyBuilding,
  nextBuilding: ReadonlyBuilding
) {
  if (InserterTransferRate(i) > 0) {
    if (i.direction === "DOWN") {
      VMPushToOtherBuilding(
        dispatch,
        { regionId, buildingIdx: currentBuildingSlot, buffer: "input" },
        currentBuilding,
        { regionId, buildingIdx: currentBuildingSlot + 1, buffer: "output" },
        nextBuilding,
        InserterTransferRate(i)
      );
      // else
      //   PushToOtherProducer(
      //     currentBuilding,
      //     nextBuilding,
      //     InserterTransferRate(i)
      //        );
    } else if (i.direction === "UP") {
      //      if (currentBuilding.kind == "Lab" || nextBuilding.kind == "Lab")
      VMPushToOtherBuilding(
        dispatch,
        { regionId, buildingIdx: currentBuildingSlot + 1, buffer: "input" },
        nextBuilding,
        { regionId, buildingIdx: currentBuildingSlot, buffer: "output" },
        currentBuilding,
        InserterTransferRate(i)
      );
      // else
      //   PushToOtherProducer(
      //     nextBuilding,
      //     currentBuilding,
      //     InserterTransferRate(i)
      //        );
    }
  }
}
