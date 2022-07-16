import { ReadonlyItemBuffer } from "./factoryGameState";
import { InserterTransferRate } from "./inserter";
import { VMPushToOtherBuilding } from "./movement";
import { StateVMAction } from "./state/action";
import { BuildingAddress } from "./state/address";
import { Belt, BeltConnection, EntityStack, NewMainBus } from "./types";

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

export function findBelt(
  laneId: number,
  buildingIdx: number,
  belts: readonly Belt[]
): [Belt | undefined, number] {
  const beltIdx = belts.findIndex(
    (b) =>
      b.laneIdx == laneId &&
      b.upperSlotIdx <= buildingIdx &&
      b.lowerSlotIdx >= buildingIdx
  );
  return [beltIdx >= 0 ? belts[beltIdx] : undefined, beltIdx];
}

export function PushPullFromMainBus(
  dispatch: (a: StateVMAction) => void,
  buildingIdx: number,
  slot: { Building: MainBusConnector; BeltConnections: BeltConnection[] },
  mb: NewMainBus,
  address: BuildingAddress
) {
  const building = slot.Building;
  for (const [
    connectionIdx,
    laneConnection,
  ] of slot.BeltConnections.entries()) {
    if (laneConnection?.laneId === undefined) continue;
    const maxTransferred = InserterTransferRate(laneConnection.Inserter);
    if (maxTransferred <= 0) continue;
    const [belt] = findBelt(laneConnection.laneId, buildingIdx, mb.Belts);
    if (!belt) {
      console.log("Can't find lane");
      dispatch({
        kind: "SetProperty",
        address: {
          regionId: address.regionId,
          buildingIdx: address.buildingIdx,
          location: "BELT",
          connectionIdx,
        },
        property: "direction",
        value: "NONE",
      });
      return;
      // throw new Error(
      //   `Missing bus lane ${
      //     laneConnection.laneId
      //   } from main bus ${JSON.stringify(mb)}`
      // );
    }
    if (
      laneConnection.Inserter.direction != "TO_BUS" &&
      laneConnection.Inserter.direction != "FROM_BUS"
    )
      throw new Error("bad inserter");

    switch (laneConnection.Inserter.direction) {
      case "TO_BUS":
        VMPushToOtherBuilding(
          dispatch,
          { ...address, buffer: "output" },
          building,
          {
            regionId: address.regionId,
            laneId: laneConnection.laneId,
            buildingIdx,
            upperSlotIdx: belt.upperSlotIdx,
          },
          { inputBuffers: new BufferForMainBusLane(belt, buildingIdx) },
          maxTransferred
        );
        break;

      case "FROM_BUS":
        VMPushToOtherBuilding(
          dispatch,
          {
            regionId: address.regionId,
            laneId: laneConnection.laneId,
            buildingIdx,
            upperSlotIdx: belt.upperSlotIdx,
          },
          { outputBuffers: new BufferForMainBusLane(belt, buildingIdx) },
          { ...address, buffer: "input" },
          building,
          maxTransferred
        );
    }
  }
}

function remainingCapacity(count: number): number {
  return Math.max(50 - count, 0);
}

export function capacityAtBuildingIdx(belt: Belt, buildingIdx: number): number {
  return remainingCapacity(
    belt.internalBeltBuffer[buildingIdx - belt.upperSlotIdx]
  );
}

export function countAtBuildingIdx(belt: Belt, buildingIdx: number): number {
  return belt.internalBeltBuffer[buildingIdx - belt.upperSlotIdx];
}

export function endBuildingIdx(belt: Belt): number {
  return belt.beltDirection == "DOWN" ? belt.lowerSlotIdx : belt.upperSlotIdx;
}

export function AdvanceBeltLine(belt: Belt): Belt {
  // TODO: Perf improvements?
  // TODO: Needs to move in reverse for belts that go up

  const lastIdx = belt.internalBeltBuffer.length - 1;
  const internalBuffer = [...belt.internalBeltBuffer]; //belt.internalBeltBuffer.map((s) => s);

  if (belt.beltDirection == "DOWN") {
    for (let idx = lastIdx - 1; idx >= 0; idx--) {
      const slot = internalBuffer[idx],
        nextSlot = internalBuffer[idx + 1];
      const remCap = remainingCapacity(nextSlot);
      const toMove = Math.min(remCap, slot, 15);
      if (toMove) {
        internalBuffer[idx] -= toMove;
        internalBuffer[idx + 1] += toMove;
      }
    }
  } else {
    for (let idx = 1; idx <= lastIdx; idx++) {
      const slot = internalBuffer[idx],
        nextSlot = internalBuffer[idx - 1];
      const remCap = remainingCapacity(nextSlot);
      const toMove = Math.min(remCap, slot);
      if (toMove) {
        internalBuffer[idx] -= toMove;
        internalBuffer[idx - 1] += toMove;
      }
    }
  }

  return { ...belt, internalBeltBuffer: internalBuffer };
}

export class BufferForMainBusLane {
  Capacity: number;
  belt: Belt;
  buildingIdx: number;
  constructor(belt: Belt, buildingIdx: number) {
    this.Capacity = 1;
    this.belt = belt;
    this.buildingIdx = buildingIdx;
  }

  AddItems(): ReadonlyItemBuffer {
    throw new Error("NYI");
  }
  Entities(): Readonly<[entity: string, count: number][]> {
    const e = this.belt.entity;
    return [[e, this.Count(e)]];
  }
  AvailableSpace(entity: string): number {
    return this.Accepts(entity) ? remainingCapacity(this.Count(entity)) : 0;
  }
  Count(entity: string): number {
    return this.Accepts(entity)
      ? countAtBuildingIdx(this.belt, this.buildingIdx)
      : 0;
  }
  Accepts(entity: string): boolean {
    return entity == this.belt.entity;
  }
}
