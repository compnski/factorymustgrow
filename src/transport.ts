import { Inventory, ReadonlyInventory } from "./inventory";
import { StackCapacity, stackTransfer } from "./movement";
import { randomName } from "./namegen";
import { BuildingAddress, DispatchFunc } from "./stateVm";
import { EntityStack, ItemBuffer, NewEntityStack, Region } from "./types";
import {
  FactoryGameState,
  ReadonlyItemBuffer,
  ReadonlyRegion,
} from "./useGameState";

// Thoughts
// Beltline has two BeltLineDepots

export function FindDepotForBeltLineInRegion(
  r: ReadonlyRegion,
  beltLineId: number,
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

export function UpdateBeltLineDept(
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
  //If FROM, has input buffer
  // If space, Move from input buffer to beltline
  // ELSE is TO
  // move from end of beltline to output buffer (if space)
  if (building.direction === "FROM_REGION") {
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
  } else if (building.direction === "TO_REGION") {
    const entityStack = building.outputBuffers.Entities()[0];
    const lastStack =
      beltLine.internalBeltBuffer[beltLine.internalBeltBuffer.length - 1];

    if (entityStack) {
      const { Entity: entity, Count: availableCount } = lastStack;
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

// export function UpdateBeltLine(
//   tick: number,
//   regions: { get(s: string): ReadonlyRegion | undefined },
//   currentBeltLine: BeltLine
// ) {
//   const toRegion = regions.get(currentBeltLine.toRegionId),
//     fromRegion = regions.get(currentBeltLine.fromRegionId);
//   if (!toRegion || !fromRegion) throw new Error("Missing regions");
//   const toDepot = FindDepotForBeltLineInRegion(
//       toRegion,
//       currentBeltLine.beltLineId,
//       "TO_REGION"
//     ),
//     fromDepot = FindDepotForBeltLineInRegion(
//       fromRegion,
//       currentBeltLine.beltLineId,
//       "FROM_REGION"
//     ),
//     lastBufferIdx = currentBeltLine.internalBeltBuffer.length - 1;
//   // Move from end of buffer into toDepot
//   if (toDepot) {
//     const lastBelt = currentBeltLine.internalBeltBuffer[lastBufferIdx];
//     if (lastBelt.Count > 0)
//       toDepot.outputBuffers.Add(lastBelt, Infinity, false, true);
//     if (lastBelt.Count === 0) lastBelt.Entity = "";
//   }
//   // Move all items, coalescing toward the end
//   for (let idx = lastBufferIdx; idx > 0; idx--) {
//     const fromBelt = currentBeltLine.internalBeltBuffer[idx - 1],
//       toBelt = currentBeltLine.internalBeltBuffer[idx];
//     if (toBelt.Entity === "" || toBelt.Entity === fromBelt.Entity) {
//       if (
//         fromBelt.Count > 0 &&
//         stackTransfer(fromBelt, toBelt, Infinity, false) > 0
//       ) {
//         toBelt.Entity = fromBelt.Entity;
//       }
//     }
//     if (fromBelt.Count === 0) {
//       fromBelt.Entity = "";
//     }
//   }
//   // Move from input buffer of fromDepot into start of beltline
//   if (fromDepot) {
//     const ents = fromDepot.inputBuffers.Entities()[0],
//       [fromEntity] = ents ? ents : [""],
//       firstBelt = currentBeltLine.internalBeltBuffer[0];

//     if (fromEntity) {
//       if (firstBelt.Entity === "" || firstBelt.Entity === fromEntity) {
//         firstBelt.Entity = fromEntity;
//         fromDepot.inputBuffers.Remove(firstBelt, Infinity, true);
//       }
//     }
//   }
//   // console.log(currentBeltLine.sharedBeltBuffer.map((es) => es.Count).join(" "));
// }

export type BeltLineDepot = {
  kind: "BeltLineDepot";
  subkind: "transport-belt" | "fast-transport-belt" | "express-transport-belt";
  ProducerType: "Depot";
  inputBuffers: ReadonlyItemBuffer;
  outputBuffers: ReadonlyItemBuffer;
  otherRegionId: string;
  length: number;
  direction: "TO_REGION" | "FROM_REGION";
  beltLineId: number;
  BuildingCount: number;
  name: string;
};

export type BeltLine = {
  beltLineId: number;
  BuildingCount: number;
  toRegionId: string;
  fromRegionId: string;
  length: number;
  internalBeltBuffer: Array<EntityStack>;
  name: string;
};

export function NewBeltLinePair(
  fromRegion: Region,
  toRegion: Region,
  subkind: "transport-belt" | "fast-transport-belt" | "express-transport-belt",
  length: number,
  initialLaneCount = 1
): [BeltLine, BeltLineDepot, BeltLineDepot] {
  const sharedBeltBuffer = Array<EntityStack>(length);
  for (let idx = 0; idx < sharedBeltBuffer.length; idx++)
    // TODO Size based on speed?
    sharedBeltBuffer[idx] = NewEntityStack("", 0, 16);

  // TODO: Static increasing id, stored someplace in state
  const beltLineId = new Date().getTime() % 100000;
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

  const toBeltLine: BeltLineDepot = {
    kind: "BeltLineDepot",
    ProducerType: "Depot",
    subkind: subkind,
    BuildingCount: initialLaneCount,
    inputBuffers: new ReadonlyInventory(0),
    outputBuffers: new ReadonlyInventory(1),
    otherRegionId: fromRegion.Id,
    direction: "TO_REGION",
    length: length,
    beltLineId: beltLineId,
    name: beltLineName,
  };

  const fromBeltLine: BeltLineDepot = {
    kind: "BeltLineDepot",
    ProducerType: "Depot",
    subkind: subkind,
    BuildingCount: initialLaneCount,
    inputBuffers: new ReadonlyInventory(1),
    outputBuffers: new ReadonlyInventory(0),
    otherRegionId: toRegion.Id,
    direction: "FROM_REGION",
    length: length,
    beltLineId: beltLineId,
    name: beltLineName,
  };

  const beltLine = {
    beltLineId: beltLineId,
    BuildingCount: initialLaneCount,
    toRegionId: toRegion.Id,
    fromRegionId: fromRegion.Id,
    length: length,
    internalBeltBuffer: sharedBeltBuffer,
    name: beltLineName,
  };

  return [beltLine, fromBeltLine, toBeltLine];
}

// export type TrainStation = {
//   kind: "TrainStation";
//   subkind: "";
//   ProducerType: string;
//   inputBuffers: Map<string, EntityStack>;
//   outputBuffers: Map<string, EntityStack>;
//   routeId: string;
// };
