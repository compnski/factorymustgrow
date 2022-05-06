import { TicksPerSecond } from "./constants";
import { EntityStack } from "./types";
import { ReadonlyItemBuffer } from "./useGameState";

// Requires at least Input items to produce anything
export function productionRunsForInput(
  inputBuffers: ReadonlyItemBuffer,
  recipeInputs: EntityStack[]
): number {
  return Math.min(
    ...recipeInputs.map(({ Entity, Count }) =>
      Math.floor(inputBuffers.Count(Entity) / Count)
    )
  );
}
export function productionPerTick(
  p: { BuildingCount: number },
  r: { ProductionPerTick: number }
): number {
  return (p.BuildingCount * r.ProductionPerTick) / TicksPerSecond;
}
