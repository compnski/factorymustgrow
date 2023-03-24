import {
  FactoryGameState,
  ReadonlyItemBuffer,
  ReadonlyRegion,
} from "./factoryGameState";
import { ReadonlyInventory } from "./inventory";
import { StackCapacity, stackTransfer } from "./movement";
import { randomName } from "./namegen";
import { BuildingAddress } from "./state/address";
import { DispatchFunc } from "./stateVm";
import { EntityStack, NewEntityStack } from "./types";

export type TruckLineDepot = {
  kind: "TruckLineDepot";
  subkind: "concrete";
  ProducerType: "Depot";
  inputBuffers: ReadonlyItemBuffer;
  outputBuffers: ReadonlyItemBuffer;
  BuildingCount: number;
  direction: "FROM_BELT" | "TO_BELT";
  truckLineId: string;
};

export type TruckLine = {
  truckLineId: string;
  BuildingCount: number;
  length: number;
  internalBeltBuffer: Array<EntityStack>;
  name: string;
};

export function FindDepotForTruckLineInRegion(
  r: ReadonlyRegion,
  truckLineId: string,
  direction: string
): TruckLineDepot | undefined {
  for (const slot of r.BuildingSlots) {
    if (slot.Building.kind === "TruckLineDepot") {
      const depot = slot.Building as TruckLineDepot;
      if (depot.truckLineId === truckLineId && depot.direction === direction) {
        return depot;
      }
    }
  }
  return undefined;
}

export function AdvanceTruckLine(truckLine: TruckLine): TruckLine {
  // TODO: Perf improvements?

  const lastIdx = truckLine.internalBeltBuffer.length - 1;
  const belt = truckLine.internalBeltBuffer.map((s) => ({ ...s }));

  for (let idx = lastIdx - 1; idx >= 0; idx--) {
    const slot = belt[idx],
      nextSlot = belt[idx + 1];
    if (
      StackCapacity(nextSlot) &&
      (!nextSlot.Entity || nextSlot.Entity == slot.Entity)
    ) {
      slot.Count -= stackTransfer(slot, nextSlot, Infinity);
    }
  }

  return { ...truckLine, internalBeltBuffer: belt };
}

export function UpdateTruckLineDepot(
  building: TruckLineDepot,
  vmDispatch: DispatchFunc,
  address: BuildingAddress,
  state: FactoryGameState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tick: number
) {
  // TODO: Progress tracker for movement (per lane)
  const truckLine = state.TruckLines.get(building.truckLineId);
  if (!truckLine)
    throw new Error("Cannot find truckLine for " + building.truckLineId);
  //console.log(truckLine.truckLineId, building.direction);
  //If FROM, has input buffer
  // If space, Move from input buffer to beltline
  // ELSE is TO
  // move from end of beltline to output buffer (if space)
  if (building.direction === "TO_BELT") {
    const entityStack = building.inputBuffers.Entities()[0];
    const firstStack = truckLine.internalBeltBuffer[0];

    if (entityStack) {
      const [entity, availableCount] = entityStack;
      const count = Math.min(availableCount, StackCapacity(firstStack));
      if (!count) return;
      if (firstStack.Entity && firstStack.Entity != entity) return;

      vmDispatch({
        kind: "AddItemCount",
        entity,
        count,
        address: { truckLineId: building.truckLineId },
      });

      vmDispatch({
        kind: "AddItemCount",
        entity,
        count: -count,
        address: { ...address, buffer: "input" },
      });
    }
  } else if (building.direction === "FROM_BELT") {
    const lastStack =
      truckLine.internalBeltBuffer[truckLine.internalBeltBuffer.length - 1];

    if (lastStack) {
      const { Entity: entity, Count: availableCount } = lastStack;
      if (!availableCount) return;
      const count = Math.min(
        availableCount,
        building.outputBuffers.AvailableSpace(entity)
      );
      if (!count) return;

      vmDispatch({
        kind: "AddItemCount",
        entity,
        count: -count,
        address: { truckLineId: building.truckLineId },
      });

      vmDispatch({
        kind: "AddItemCount",
        entity,
        count: count,
        address: { ...address, buffer: "output" },
      });
    }
  }
}

export function NewTruckLineDepot({
  subkind,
  direction,
  truckLineId,
  initialLaneCount = 1,
}: {
  subkind: "concrete";
  direction: "FROM_BELT" | "TO_BELT";
  truckLineId: string;
  initialLaneCount?: number;
}): TruckLineDepot {
  const [inputCount, outputCount] = direction == "FROM_BELT" ? [0, 1] : [1, 0];

  return {
    kind: "TruckLineDepot",
    ProducerType: "Depot",
    subkind: subkind,
    BuildingCount: initialLaneCount,
    inputBuffers: new ReadonlyInventory(inputCount),
    outputBuffers: new ReadonlyInventory(outputCount),
    direction,
    truckLineId,
  };
}

export function NewTruckLine(
  truckLineId: string,
  subkind: "concrete",
  length: number,
  initialLaneCount = 1
): TruckLine {
  const sharedBeltBuffer = Array<EntityStack>(length);
  for (let idx = 0; idx < sharedBeltBuffer.length; idx++)
    // TODO Size based on speed?
    sharedBeltBuffer[idx] = NewEntityStack("", 0, 16);

  let truckLineName = "";
  for (; truckLineName === "" || truckLineName.length > 14; ) {
    truckLineName = randomName();
  }
  // Belt should be thought of as a chain of EntityStacks,
  // each with a small StackSize.
  // The first and last N EntityStacks are the input / output buffers
  // The Update step moves items toward the output buffers,
  // respecting stack size and entity grouping

  // initially, belt lines have a 'type'

  // initialize Input/Output buffers
  // initialize sharedBeltBuffer

  // need truckLineId to link beltlines and depots
  // current link probably won't surivve storage

  const truckLine = {
    truckLineId: truckLineId,
    BuildingCount: initialLaneCount,
    //    toRegionId: toRegion.Id,
    //    fromRegionId: fromRegion.Id,
    length: length,
    internalBeltBuffer: sharedBeltBuffer,
    name: truckLineName,
  };

  return truckLine;
}

// export type TrainStation = {
//   kind: "TrainStation";
//   subkind: "";
//   ProducerType: string;
//   inputBuffers: Map<string, EntityStack>;
//   outputBuffers: Map<string, EntityStack>;
//   routeId: string;
// };
