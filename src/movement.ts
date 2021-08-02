import { OutputStatus, EntityStack, MainBus } from "./types";
import { ProducerHasInput, ProducerHasOutput } from "./utils";

export function CanPushTo(
  from: { kind: string; outputBuffers: Map<string, EntityStack> },
  to: { kind: string; inputBuffers: Map<string, EntityStack> } | null
): boolean {
  return (
    ProducerHasInput(to?.kind) &&
    ProducerHasOutput(from?.kind) &&
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
    ProducerCount: number;
  },
  toAbove: {
    inputBuffers: Map<string, EntityStack>;
    ProducerCount: number;
  } | null,
  toBelow: {
    inputBuffers: Map<string, EntityStack>;
    ProducerCount: number;
  } | null
) {
  const maxTransferAbove = Math.min(
      from.ProducerCount,
      toAbove?.ProducerCount || 0
    ),
    maxTransferBelow = Math.min(
      from.ProducerCount,
      toBelow?.ProducerCount || 0
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
  ProducerCount: number;
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
          ? producer.outputBuffers.get(busLane.Entity)
          : producer?.inputBuffers.get(busLane.Entity),
      maxTransferToFromBelt = producer.ProducerCount;
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
      maxTransferToFromBelt
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
