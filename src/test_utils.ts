import { ItemBuffer, NewEntityStack } from "./types";
import { ReadonlyItemBuffer } from "./useGameState";

export function AddItemsToFixedBuffer(buffer: ItemBuffer, count: number) {
  buffer
    .Entities()
    .forEach(([entity]) => buffer.Add(NewEntityStack(entity, count)));
}

export function AddItemsToReadonlyFixedBuffer(
  buffer: ReadonlyItemBuffer,
  count: number
): ReadonlyItemBuffer {
  return buffer
    .Entities()
    .reduce((accum, [entity]) => accum.AddItems(entity, count), buffer);
}
