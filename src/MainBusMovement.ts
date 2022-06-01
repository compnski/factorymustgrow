import { ReadonlyItemBuffer } from "./factoryGameState";
import { StateVMAction } from "./state/action";
import { BuildingAddress } from "./state/address";
import { BeltConnection, EntityStack, NewMainBus } from "./types";

interface MainBusConnector {
  inputBuffers: ReadonlyItemBuffer;
  outputBuffers: ReadonlyItemBuffer;
  BuildingCount?: number;
}

export type MainBusConnection = {
  direction: "TO_BUS" | "FROM_BUS";
  busLane: number;
  itemsPerTick: number;
  attachedBuffer: EntityStack;
};

export function PushPullFromMainBus(
  dispatch: (a: StateVMAction) => void,
  slot: { Building: MainBusConnector; BeltConnections: BeltConnection[] },
  mb: NewMainBus,
  address: BuildingAddress
) {
  return;
  // const building = slot.Building;
  // for (const laneConnection of slot.BeltConnections) {
  //   if (laneConnection?.laneId === undefined) continue;
  //   const maxTransferred = InserterTransferRate(laneConnection.Inserter);
  //   if (maxTransferred <= 0) continue;
  //   const busLane = mb.lanes.get(laneConnection.laneId);
  //   if (!busLane) {
  //     throw new Error(
  //       `Missing bus lane ${
  //         laneConnection.laneId
  //       } from main bus ${JSON.stringify(mb)}`
  //     );
  //   }
  //   if (
  //     laneConnection.Inserter.direction != "TO_BUS" &&
  //     laneConnection.Inserter.direction != "FROM_BUS"
  //   )
  //     throw new Error("bad inserter");

  //   switch (laneConnection.Inserter.direction) {
  //     case "TO_BUS":
  //       VMPushToOtherBuilding(
  //         dispatch,
  //         { ...address, buffer: "output" },
  //         building,
  //         { regionId: address.regionId, laneId: laneConnection.laneId },
  //         { inputBuffers: mb.Lane(laneConnection.laneId) },
  //         maxTransferred
  //       );
  //       break;

  //     case "FROM_BUS":
  //       VMPushToOtherBuilding(
  //         dispatch,
  //         { regionId: address.regionId, laneId: laneConnection.laneId },
  //         { outputBuffers: mb.Lane(laneConnection.laneId) },
  //         { ...address, buffer: "input" },
  //         building,
  //         maxTransferred
  //       );
  //   }
  // }
}
