import { DispatchFunc, StateAddress } from "./stateVm";
import { EntityStack, ItemBuffer } from "./types";
import { ReadonlyItemBuffer } from "./useGameState";
import { BuildingHasInput, BuildingHasOutput } from "./utils";

export function moveToInventory(
  dispatch: DispatchFunc,
  entity: string,
  count: number,
  fromAddress?: StateAddress
) {
  dispatch({
    kind: "AddItemCount",
    address: { inventory: true },
    entity,
    count: count,
  });
  if (fromAddress)
    dispatch({
      kind: "AddItemCount",
      address: fromAddress,
      entity,
      count: -count,
    });
}

export function CanPushTo(
  from: { kind: string; outputBuffers: ReadonlyItemBuffer },
  to: { kind: string; inputBuffers: ReadonlyItemBuffer } | null
): boolean {
  return Boolean(
    BuildingHasInput(to?.kind) &&
      BuildingHasOutput(from?.kind) &&
      to &&
      from.outputBuffers
        .Entities()
        .reduce<boolean>((accum: boolean, [entity]): boolean => {
          return (
            ((accum ?? true) && to.inputBuffers.Accepts(entity)) ||
            to.inputBuffers.Count(entity) > 0
          );
        }, true)
  );
}

export function VMPushToOtherBuilding(
  dispatch: DispatchFunc,
  regionId: string,
  outputIdx: number,
  { outputBuffers }: { outputBuffers: ReadonlyItemBuffer | ItemBuffer },
  inputIdx: number,
  { inputBuffers }: { inputBuffers: ReadonlyItemBuffer | ItemBuffer },
  maxTransferred: number
) {
  let remainingMaxTransfer = maxTransferred;
  outputBuffers.Entities().forEach(([entity]) => {
    if (inputBuffers.Accepts(entity)) {
      const transferAmount = Math.min(
        remainingMaxTransfer,
        outputBuffers.Count(entity),
        inputBuffers.AvailableSpace(entity)
      );

      console.log(
        "VM PUSH",
        entity,
        outputBuffers.Count(entity),
        inputBuffers.AvailableSpace(entity),
        inputBuffers.Count(entity),
        transferAmount
      );

      remainingMaxTransfer -= transferAmount;
      dispatch({
        kind: "AddItemCount",
        address: { regionId, buildingIdx: inputIdx, buffer: "input" },
        entity,
        count: transferAmount,
      });
      dispatch({
        kind: "AddItemCount",
        address: { regionId, buildingIdx: outputIdx, buffer: "output" },
        entity,
        count: -transferAmount,
      });
    }
  });
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
  integersOnly = true
): number {
  if (toStack.Entity !== "" && toStack.Entity !== fromStack.Entity) {
    return 0;
  }
  const availableItems = fromStack.Count,
    availableSpace = StackCapacity(toStack);
  let amountToTransfer = Math.min(
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
