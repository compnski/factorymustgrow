export type Inserter = {
  kind: "Inserter";
  subkind: "inserter" | "fast-inserter" | "stack-inserter";
  BuildingCount: number;
  direction: "UP" | "DOWN" | "NONE";
};

export function NewInserter(
  subkind: "inserter" | "fast-inserter" | "stack-inserter" = "inserter",
  count: number = 0
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
