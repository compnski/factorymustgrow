import { Building } from "./building";
import { PushToOtherProducer } from "./movement";

export type Inserter = {
  kind: "Inserter";
  subkind: "inserter" | "fast-inserter" | "stack-inserter";
  BuildingCount: number;
  direction: "UP" | "DOWN" | "TO_BUS" | "FROM_BUS" | "NONE";
};

export function NewInserter(
  count: number = 0,
  subkind: "inserter" | "fast-inserter" | "stack-inserter" = "inserter"
): Inserter {
  return {
    kind: "Inserter",
    subkind,
    BuildingCount: count,
    direction: "NONE",
  };
}

export function InserterTransferRate(i: Inserter): number {
  return i.BuildingCount;
}

export function MoveViaInserter(
  i: Inserter,
  currentBuilding: Building,
  nextBuilding: Building
) {
  if (InserterTransferRate(i) > 0) {
    if (i.direction === "DOWN") {
      PushToOtherProducer(
        currentBuilding,
        nextBuilding,
        InserterTransferRate(i)
      );
    } else if (i.direction === "UP") {
      PushToOtherProducer(
        nextBuilding,
        currentBuilding,
        InserterTransferRate(i)
      );
    }
  }
}
