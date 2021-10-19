import { EntityStack, ItemBuffer } from "./types";
import { BuildingHasInput, BuildingHasOutput } from "./utils";

export function CanPushTo(
  from: { kind: string; outputBuffers: ItemBuffer },
  to: { kind: string; inputBuffers: ItemBuffer } | null
): boolean {
  return Boolean(
    BuildingHasInput(to?.kind) &&
      BuildingHasOutput(from?.kind) &&
      to &&
      from.outputBuffers
        .Entities()
        .reduce<boolean>((accum: boolean, [entity]): boolean => {
          return (
            (accum ?? true) &&
            (to.inputBuffers.Accepts(entity) ||
              to.inputBuffers.Count(entity) > 0)
          );
        }, true)
  );
}

export function PushToOtherProducer(
  { outputBuffers }: { outputBuffers: ItemBuffer },
  { inputBuffers }: { inputBuffers: ItemBuffer },
  maxTransferred: number
) {
  outputBuffers.Entities().forEach(([entity]) => {
    if (inputBuffers.Accepts(entity)) {
      inputBuffers.AddFromItemBuffer(outputBuffers, entity, maxTransferred);
    }
  });
}

export function StackCapacity(stack: EntityStack | undefined): number {
  if (
    stack === undefined ||
    stack.MaxCount === undefined ||
    stack.MaxCount === Infinity
  )
    return Infinity;
  return stack.MaxCount - stack.Count;
}

export function stackTransfer(
  fromStack: EntityStack,
  toStack: EntityStack,
  maxTransferred: number,
  integersOnly: boolean = true
): number {
  if (toStack.Entity !== "" && toStack.Entity !== fromStack.Entity) {
    return 0;
  }
  const availableItems = fromStack.Count,
    availableSpace = StackCapacity(toStack);
  var amountToTransfer = Math.min(
    maxTransferred,
    availableItems,
    availableSpace
  );
  if (integersOnly) amountToTransfer = Math.floor(amountToTransfer);
  // if (amountToTransfer > 0)
  //   console.log(
  //     `Transfer ${amountToTransfer} ${fromStack.Entity} from`,
  //     fromStack,
  //     "to",
  //     toStack
  //   );
  fromStack.Count -= amountToTransfer;
  toStack.Count += amountToTransfer;
  return amountToTransfer;
}
