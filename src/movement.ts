import { MainBus } from "./mainbus";
import { OutputStatus, EntityStack, ItemBuffer } from "./types";
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

interface MainBusConnector {
  outputStatus: OutputStatus;
  inputBuffers: ItemBuffer;
  outputBuffers: ItemBuffer;
  BuildingCount?: number;
  // TransferStackSize/Speed/etc
}

export type MainBusConnection = {
  direction: "TO_BUS" | "FROM_BUS";
  busLane: number;
  itemsPerTick: number;
  attachedBuffer: EntityStack;
};

export function PushPullFromMainBus(
  slot: { Building: MainBusConnector },
  mb: MainBus
) {
  var building = slot.Building;
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
          ? building.outputBuffers
          : building?.inputBuffers,
      maxTransferToFromBelt = building.BuildingCount || 1;
    if (!producerBuffer)
      throw new Error(
        `Failed to find producer buffer for ${JSON.stringify(
          building
        )} for connection ${JSON.stringify(laneConnection)}`
      );
    PushPullLaneFromMainBus(
      busLaneEntity,
      busLane,
      producerBuffer,
      laneConnection.direction,
      maxTransferToFromBelt
    );
  }
}

function PushPullLaneFromMainBus(
  entity: string,
  busLane: ItemBuffer,
  producerBuffer: ItemBuffer,
  direction: "TO_BUS" | "FROM_BUS",
  maxTransfered: number
): number {
  switch (direction) {
    case "TO_BUS":
      return busLane.AddFromItemBuffer(producerBuffer, entity, maxTransfered);

    case "FROM_BUS":
      return producerBuffer.AddFromItemBuffer(busLane, entity, maxTransfered);
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
