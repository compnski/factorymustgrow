import { ReadonlyInventory } from "./inventory";
import { StackCapacity, stackTransfer } from "./movement";
import { randomName } from "./namegen";
import { DispatchFunc } from "./stateVm";
import { BuildingAddress } from "./state/address";
import { EntityStack, NewEntityStack } from "./types";
import {
  FactoryGameState,
  ReadonlyItemBuffer,
  ReadonlyRegion,
} from "./factoryGameState";

export type BeltLineDepot = {
  kind: "BeltLineDepot";
  subkind: "transport-belt" | "fast-transport-belt" | "express-transport-belt";
  ProducerType: "Depot";
  inputBuffers: ReadonlyItemBuffer;
  outputBuffers: ReadonlyItemBuffer;
  BuildingCount: number;
  direction: "FROM_BELT" | "TO_BELT";
  beltLineId: string;
};

export type BeltLine = {
  beltLineId: string;
  BuildingCount: number;
  length: number;
  internalBeltBuffer: Array<EntityStack>;
  name: string;
};

export function FindDepotForBeltLineInRegion(
  r: ReadonlyRegion,
  beltLineId: string,
  direction: string
): BeltLineDepot | undefined {
  for (const slot of r.BuildingSlots) {
    if (slot.Building.kind === "BeltLineDepot") {
      const depot = slot.Building as BeltLineDepot;
      if (depot.beltLineId === beltLineId && depot.direction === direction) {
        return depot;
      }
    }
  }
  return undefined;
}

export function AdvanceBeltLine(beltLine: BeltLine): BeltLine {
  // TODO: Perf improvements?

  const lastIdx = beltLine.internalBeltBuffer.length - 1;
  const belt = beltLine.internalBeltBuffer.map((s) => ({ ...s }));

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

  return { ...beltLine, internalBeltBuffer: belt };
}

export function UpdateBeltLineDepot(
  building: BeltLineDepot,
  vmDispatch: DispatchFunc,
  address: BuildingAddress,
  state: FactoryGameState,
  tick: number
) {
  // TODO: Progress tracker for movement (per lane)
  const beltLine = state.BeltLines.get(building.beltLineId);
  if (!beltLine)
    throw new Error("Cannot find beltLine for " + building.beltLineId);
  //console.log(beltLine.beltLineId, building.direction);
  //If FROM, has input buffer
  // If space, Move from input buffer to beltline
  // ELSE is TO
  // move from end of beltline to output buffer (if space)
  if (building.direction === "TO_BELT") {
    const entityStack = building.inputBuffers.Entities()[0];
    const firstStack = beltLine.internalBeltBuffer[0];

    if (entityStack) {
      const [entity, availableCount] = entityStack;
      const count = Math.min(availableCount, StackCapacity(firstStack));
      if (!count) return;
      if (firstStack.Entity && firstStack.Entity != entity) return;

      vmDispatch({
        kind: "AddItemCount",
        entity,
        count,
        address: { beltLineId: building.beltLineId },
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
      beltLine.internalBeltBuffer[beltLine.internalBeltBuffer.length - 1];

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
        address: { beltLineId: building.beltLineId },
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

export function NewBeltLineDepot({
  subkind,
  direction,
  beltLineId,
  initialLaneCount = 1,
}: {
  subkind: "transport-belt" | "fast-transport-belt" | "express-transport-belt";
  direction: "FROM_BELT" | "TO_BELT";
  beltLineId: string;
  initialLaneCount?: number;
}): BeltLineDepot {
  const [inputCount, outputCount] = direction == "FROM_BELT" ? [0, 1] : [1, 0];

  return {
    kind: "BeltLineDepot",
    ProducerType: "Depot",
    subkind: subkind,
    BuildingCount: initialLaneCount,
    inputBuffers: new ReadonlyInventory(inputCount),
    outputBuffers: new ReadonlyInventory(outputCount),
    direction,
    beltLineId,
  };
}

export function NewBeltLine(
  beltLineId: string,
  subkind: "transport-belt" | "fast-transport-belt" | "express-transport-belt",
  length: number,
  initialLaneCount = 1
): BeltLine {
  const sharedBeltBuffer = Array<EntityStack>(length);
  for (let idx = 0; idx < sharedBeltBuffer.length; idx++)
    // TODO Size based on speed?
    sharedBeltBuffer[idx] = NewEntityStack("", 0, 16);

  let beltLineName = "";
  for (; beltLineName === "" || beltLineName.length > 14; ) {
    beltLineName = randomName();
  }
  // Belt should be thought of as a chain of EntityStacks,
  // each with a small StackSize.
  // The first and last N EntityStacks are the input / output buffers
  // The Update step moves items toward the output buffers,
  // respecting stack size and entity grouping

  // initially, belt lines have a 'type'

  // initialize Input/Output buffers
  // initialize sharedBeltBuffer

  // need beltLineId to link beltlines and depots
  // current link probably won't surivve storage

  const beltLine = {
    beltLineId: beltLineId,
    BuildingCount: initialLaneCount,
    //    toRegionId: toRegion.Id,
    //    fromRegionId: fromRegion.Id,
    length: length,
    internalBeltBuffer: sharedBeltBuffer,
    name: beltLineName,
  };

  return beltLine;
}

// export type TrainStation = {
//   kind: "TrainStation";
//   subkind: "";
//   ProducerType: string;
//   inputBuffers: Map<string, EntityStack>;
//   outputBuffers: Map<string, EntityStack>;
//   routeId: string;
// };
