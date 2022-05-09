import { DispatchFunc } from "./stateVm";
import { StateAddress } from "./state/address";
import { EntityStack } from "./types";
import { ReadonlyItemBuffer } from "./factoryGameState";
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
  outputAddress: StateAddress,
  { outputBuffers }: { outputBuffers: ReadonlyItemBuffer },
  inputAddress: StateAddress,
  { inputBuffers }: { inputBuffers: ReadonlyItemBuffer },
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
        entity,
        "avail",
        inputBuffers.AvailableSpace(entity),
        inputAddress,
        "from",
        outputAddress
      );
      if (transferAmount) {
        remainingMaxTransfer -= transferAmount;
        dispatch({
          kind: "AddItemCount",
          address: inputAddress,
          entity,
          count: transferAmount,
        });
        dispatch({
          kind: "AddItemCount",
          address: outputAddress,
          entity,
          count: -transferAmount,
        });
      }
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
  return Math.max(0, stack.MaxCount - stack.Count);
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
  if (!toStack.Entity) toStack.Entity = fromStack.Entity;
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
