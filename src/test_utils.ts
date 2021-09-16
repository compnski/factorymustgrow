import { ItemBuffer, NewEntityStack } from "./types";

export function AddItemsToFixedBuffer(buffer: ItemBuffer, count: number) {
  buffer
    .Entities()
    .forEach(([entity]) => buffer.Add(NewEntityStack(entity, count)));
}
