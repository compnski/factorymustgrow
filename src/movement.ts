import { MainBus } from "./mainbus";
import { OutputStatus, EntityStack, ItemBuffer } from "./types";
import { BuildingHasInput, BuildingHasOutput } from "./utils";

export function CanPushTo(
  from: { kind: string; outputBuffers: Map<string, EntityStack> },
  to: { kind: string; inputBuffers: Map<string, EntityStack> } | null
): boolean {
  return (
    BuildingHasInput(to?.kind) &&
    BuildingHasOutput(from?.kind) &&
    (to?.inputBuffers || false) &&
    hasIntersection(to.inputBuffers.keys(), from.outputBuffers.keys())
    //to.inputBuffers.has(from.outputBuffer.Entity)
  );
}

function hasIntersection(
  a: string[] | IterableIterator<string>,
  b: string[] | IterableIterator<string>
): boolean {
  const setB = new Set(b);
  return [...a].filter((x) => setB.has(x)).length > 0;
}

export function PushToNeighbors(
  from: {
    outputBuffers: Map<string, EntityStack>;
    outputStatus: OutputStatus;
    BuildingCount?: number;
  },
  toAbove: {
    inputBuffers: Map<string, EntityStack>;
    BuildingCount?: number;
  } | null,
  toBelow: {
    inputBuffers: Map<string, EntityStack>;
    BuildingCount?: number;
  } | null
) {
  const maxTransferAbove = Math.min(
      from?.BuildingCount || 0,
      toAbove?.BuildingCount || 0
    ),
    maxTransferBelow = Math.min(
      from?.BuildingCount || 0,
      toBelow?.BuildingCount || 0
    );
  if (from.outputStatus.above === "OUT" && toAbove) {
    PushToOtherProducer(from, toAbove, maxTransferAbove);
  }
  if (from.outputStatus.below === "OUT" && toBelow) {
    PushToOtherProducer(from, toBelow, maxTransferBelow);
  }
}

export function PushToOtherProducer(
  { outputBuffers }: { outputBuffers: Map<string, EntityStack> },
  { inputBuffers }: { inputBuffers: Map<string, EntityStack> },
  maxTransferred: number
) {
  outputBuffers.forEach((outputBuffer) => {
    var toStack = inputBuffers.get(outputBuffer.Entity);
    if (toStack) stackTransfer(outputBuffer, toStack, maxTransferred);
  });
}

interface MainBusConnector {
  outputStatus: OutputStatus;
  inputBuffers: Map<string, EntityStack>;
  outputBuffers: Map<string, EntityStack>;
  BuildingCount?: number;
  // TransferStackSize/Speed/etc
}

export type MainBusConnection = {
  direction: "TO_BUS" | "FROM_BUS";
  busLane: number;
  itemsPerTick: number;
  attachedBuffer: EntityStack;
};

export function PushPullFromMainBus(building: MainBusConnector, mb: MainBus) {
  for (var laneConnection of building.outputStatus.beltConnections) {
    const busLane = mb.lanes.get(laneConnection.beltId);
    if (!busLane) {
      throw new Error(
        `Missing bus lane ${
          laneConnection.beltId
        } from main bus ${JSON.stringify(mb)}`
      );
    }
    const busLaneEntity = busLane.Entities()[0][0];
    const producerBuffer =
        laneConnection.direction === "TO_BUS"
          ? building.outputBuffers.get(busLaneEntity)
          : building?.inputBuffers.get(busLaneEntity),
      maxTransferToFromBelt = building.BuildingCount || 1;
    if (!producerBuffer)
      throw new Error(
        `Failed to find producer buffer for ${JSON.stringify(
          building
        )} for connection ${JSON.stringify(laneConnection)}`
      );
    PushPullLaneFromMainBus(
      busLane,
      producerBuffer,
      laneConnection.direction,
      maxTransferToFromBelt
    );
  }
}

function PushPullLaneFromMainBus(
  busLane: ItemBuffer,
  producerBuffer: EntityStack,
  direction: "TO_BUS" | "FROM_BUS",
  maxTransfered: number
): number {
  switch (direction) {
    case "TO_BUS":
      return busLane.Add(producerBuffer, maxTransfered);

    case "FROM_BUS":
      return busLane.Remove(producerBuffer, maxTransfered);
  }
}

export function StackCapacity(stack: EntityStack): number {
  if (stack.MaxCount === undefined || stack.MaxCount === Infinity)
    return Infinity;
  return stack.MaxCount - stack.Count;
}

export function stackTransfer(
  fromStack: EntityStack,
  toStack: EntityStack,
  maxTransferred: number,
  integersOnly: boolean = true
): number {
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
