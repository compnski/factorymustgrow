import { InserterTransferRate } from "./inserter";
import { MainBus } from "./mainbus";
import { BeltConnection, CountRemover, EntityStack, ItemBuffer } from "./types";

interface Adder extends CountRemover {
  AddFromItemBuffer(
    from: ItemBuffer,
    entity: string,
    itemCount?: number,
    exceedCapacity?: boolean,
    integersOnly?: boolean
  ): number;
}

interface MainBusConnector {
  inputBuffers: Adder;
  outputBuffers: Adder;
  BuildingCount?: number;
}

export type MainBusConnection = {
  direction: "TO_BUS" | "FROM_BUS";
  busLane: number;
  itemsPerTick: number;
  attachedBuffer: EntityStack;
};

export function PushPullFromMainBus(
  slot: { Building: MainBusConnector; BeltConnections: BeltConnection[] },
  mb: MainBus
) {
  const building = slot.Building;
  for (const laneConnection of slot.BeltConnections) {
    if (laneConnection?.laneId === undefined) continue;
    if (InserterTransferRate(laneConnection.Inserter) <= 0) continue;
    const busLane = mb.lanes.get(laneConnection.laneId);
    if (!busLane) {
      throw new Error(
        `Missing bus lane ${
          laneConnection.laneId
        } from main bus ${JSON.stringify(mb)}`
      );
    }

    // TODO Use InserterTransferRate, not buildngCount
    const busLaneEntity = busLane.Entities()[0][0];
    const producerBuffer =
        laneConnection.direction === "TO_BUS"
          ? building.outputBuffers
          : building?.inputBuffers,
      maxTransferToFromBelt = InserterTransferRate(laneConnection.Inserter); // building.BuildingCount || 1;
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
  producerBuffer: Adder,
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
