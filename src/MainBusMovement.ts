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
): Belt | undefined {
  return belts.find(
    (b) =>
      b.laneIdx == laneId &&
      b.upperSlotIdx <= buildingIdx &&
      b.lowerSlotIdx >= buildingIdx
  );
}

export function PushPullFromMainBus(
  dispatch: (a: StateVMAction) => void,
  buildingIdx: number,
  slot: { Building: MainBusConnector; BeltConnections: BeltConnection[] },
  mb: NewMainBus,
  address: BuildingAddress
) {
  const building = slot.Building;
  for (const laneConnection of slot.BeltConnections) {
    if (laneConnection?.laneId === undefined) continue;
    const maxTransferred = InserterTransferRate(laneConnection.Inserter);
    if (maxTransferred <= 0) continue;
    const belt = findBelt(laneConnection.laneId, buildingIdx, mb.Belts);
    if (!belt) {
      throw new Error(
        `Missing bus lane ${
          laneConnection.laneId
        } from main bus ${JSON.stringify(mb)}`
      );
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
          { inputBuffers: new bufferForMainBusLane(belt, buildingIdx) },
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
          { outputBuffers: new bufferForMainBusLane(belt, buildingIdx) },
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
      const toMove = Math.min(remCap, slot);
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

class bufferForMainBusLane {
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
      ? this.belt.internalBeltBuffer[this.buildingIdx]
      : 0;
  }
  Accepts(entity: string): boolean {
    return entity == this.belt.entity;
  }
}
