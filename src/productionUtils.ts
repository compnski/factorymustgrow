import { EntityStack, ItemBuffer } from "./types";
import { TicksPerSecond } from "./constants";
import { ReadonlyItemBuffer } from "./useGameState";

// Requires at least Input items to produce anything
export function producableItemsForInput(
  inputBuffers: ReadonlyItemBuffer | ItemBuffer,
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
