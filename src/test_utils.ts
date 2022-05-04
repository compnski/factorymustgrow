import { ReadonlyItemBuffer } from "./useGameState";

export function AddItemsToReadonlyFixedBuffer(
  buffer: ReadonlyItemBuffer,
  count: number
): ReadonlyItemBuffer {
  return buffer
    .Entities()
    .reduce((accum, [entity]) => accum.AddItems(entity, count), buffer);
}
