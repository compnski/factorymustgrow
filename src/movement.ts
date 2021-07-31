import { OutputStatus, EntityStack, MainBus } from "./types";

export function CanPushTo(
  from: { outputBuffer: EntityStack },
  to: { inputBuffers?: Map<string, EntityStack> } | null
): boolean {
  return (
    (to?.inputBuffers || false) && to.inputBuffers.has(from.outputBuffer.Entity)
  );
}

export function PushToNeighbors(
  from: { outputBuffer: EntityStack; outputStatus: OutputStatus },
  toAbove: { inputBuffers?: Map<string, EntityStack> } | null,
  toBelow: { inputBuffers?: Map<string, EntityStack> } | null
) {
  if (from.outputStatus.above === "OUT" && toAbove) {
    PushToOtherProducer(from, toAbove, 50);
  }
  if (from.outputStatus.below === "OUT" && toBelow) {
    PushToOtherProducer(from, toBelow, 50);
  }
}

export function PushToOtherProducer(
  { outputBuffer }: { outputBuffer: EntityStack },
  { inputBuffers }: { inputBuffers?: Map<string, EntityStack> },
  maxTransferred: number
): number {
  if (!inputBuffers) return 0;
  var toStack = inputBuffers.get(outputBuffer.Entity);
  if (!toStack)
    throw new Error(
      `Bad push, no ${outputBuffer.Entity} found in ${inputBuffers}`
    );
  return stackTransfer(outputBuffer, toStack, maxTransferred);
}

interface MainBusConnector {
  outputStatus: OutputStatus;
  inputBuffers?: Map<string, EntityStack>;
  outputBuffer?: EntityStack;
}

export type MainBusConnection = {
  direction: "TO_BUS" | "FROM_BUS";
  busLane: number;
  itemsPerTick: number;
  attachedBuffer: EntityStack;
};

export function PushPullFromMainBus(producer: MainBusConnector, mb: MainBus) {
  for (var laneConnection of producer.outputStatus.beltConnections) {
    const busLane = mb.lanes.get(laneConnection.beltId);
    if (!busLane) {
      throw new Error(
        `Missing bus lane ${
          laneConnection.beltId
        } from main bus ${JSON.stringify(mb)}`
      );
    }
    const producerBuffer =
      laneConnection.direction === "TO_BUS"
        ? producer.outputBuffer
        : producer?.inputBuffers?.get(busLane.Entity);
    if (!producerBuffer)
      throw new Error(
        `Failed to find producer buffer for ${JSON.stringify(
          producer
        )} for connection ${JSON.stringify(laneConnection)}`
      );
    PushPullLaneFromMainBus(
      busLane,
      producerBuffer,
      laneConnection.direction,
      50
    );
  }
}

function PushPullLaneFromMainBus(
  busLane: EntityStack,
  producerBuffer: EntityStack,
  direction: "TO_BUS" | "FROM_BUS",
  maxTransfered: number
): number {
  var toStack: EntityStack, fromStack: EntityStack;
  switch (direction) {
    case "TO_BUS":
      toStack = busLane;
      fromStack = producerBuffer;
      break;
    case "FROM_BUS":
      toStack = producerBuffer;
      fromStack = busLane;
      break;
  }
  return stackTransfer(fromStack, toStack, maxTransfered);
}

export function stackTransfer(
  fromStack: EntityStack,
  toStack: EntityStack,
  maxTransferred: number,
  integersOnly: boolean = true
): number {
  const availableItems = fromStack.Count,
    availableSpace = (toStack.MaxCount || Infinity) - toStack.Count;
  var amountToTransfer = Math.min(
    maxTransferred,
    availableItems,
    availableSpace
  );
  if (integersOnly) amountToTransfer = Math.floor(amountToTransfer);
  fromStack.Count -= amountToTransfer;
  toStack.Count += amountToTransfer;
  return amountToTransfer;
}
