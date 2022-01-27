import { Inventory } from "./inventory";
import { stackTransfer } from "./movement";
import { randomName } from "./namegen";
import {
  EntityStack,
  ItemBuffer,
  NewEntityStack,
  OutputStatus,
  Region,
} from "./types";

// Thoughts
// Beltline has two BeltLineDepots

export function FindDepotForBeltLineInRegion(
  r: Region,
  beltLineId: number,
  direction: string
): BeltLineDepot | undefined {
  for (const slot of r.BuildingSlots) {
    if (slot.Building.kind === "BeltLineDepot") {
      const depot = slot.Building;
      if (depot.beltLineId === beltLineId && depot.direction === direction) {
        return depot;
      }
    }
  }
  return undefined;
}

export function UpdateBeltLine(
  tick: number,
  regions: { get(s: string): Region | undefined },
  currentBeltLine: BeltLine
) {
  const toRegion = regions.get(currentBeltLine.toRegionId)!,
    fromRegion = regions.get(currentBeltLine.fromRegionId)!,
    toDepot = FindDepotForBeltLineInRegion(
      toRegion,
      currentBeltLine.beltLineId,
      "TO_REGION"
    ),
    fromDepot = FindDepotForBeltLineInRegion(
      fromRegion,
      currentBeltLine.beltLineId,
      "FROM_REGION"
    ),
    lastBufferIdx = currentBeltLine.sharedBeltBuffer.length - 1;
  // Move from end of buffer into toDepot
  if (toDepot) {
    const lastBelt = currentBeltLine.sharedBeltBuffer[lastBufferIdx];
    if (lastBelt.Count > 0)
      toDepot.outputBuffers.Add(lastBelt, Infinity, false, true);
    if (lastBelt.Count === 0) lastBelt.Entity = "";
  }
  // Move all items, coalescing toward the end
  for (var idx = lastBufferIdx; idx > 0; idx--) {
    const fromBelt = currentBeltLine.sharedBeltBuffer[idx - 1],
      toBelt = currentBeltLine.sharedBeltBuffer[idx];
    if (toBelt.Entity === "" || toBelt.Entity === fromBelt.Entity) {
      if (
        fromBelt.Count > 0 &&
        stackTransfer(fromBelt, toBelt, Infinity, false) > 0
      ) {
        toBelt.Entity = fromBelt.Entity;
      }
    }
    if (fromBelt.Count === 0) {
      fromBelt.Entity = "";
    }
  }
  // Move from input buffer of fromDepot into start of beltline
  if (fromDepot) {
    const ents = fromDepot.inputBuffers.Entities()[0],
      [fromEntity] = ents ? ents : [""],
      firstBelt = currentBeltLine.sharedBeltBuffer[0];

    if (fromEntity) {
      if (firstBelt.Entity === "" || firstBelt.Entity === fromEntity) {
        firstBelt.Entity = fromEntity;
        fromDepot.inputBuffers.Remove(firstBelt, Infinity, true);
      }
    }
  }
  // console.log(currentBeltLine.sharedBeltBuffer.map((es) => es.Count).join(" "));
}

export type BeltLineDepot = {
  kind: "BeltLineDepot";
  subkind: "transport-belt" | "fast-transport-belt" | "express-transport-belt";
  ProducerType: "Depot";
  inputBuffers: ItemBuffer;
  outputBuffers: ItemBuffer;
  outputStatus: OutputStatus;
  otherRegionId: string;
  length: number;
  direction: "TO_REGION" | "FROM_REGION";
  beltLineId: number;
  BuildingCount: number;
  name: string;
};

export type BeltLine = {
  //  kind: "BeltLine";
  //  subkind: "transport-belt" | "fast-transport-belt" | "express-transport-belt";
  //  ProducerType: string;
  beltLineId: number;
  BuildingCount: number;
  //  toDepot: BeltLineDepot;
  // fromDepot: BeltLineDepot;
  toRegionId: string;
  fromRegionId: string;
  length: number;
  sharedBeltBuffer: Array<EntityStack>;
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
  for (var idx = 0; idx < sharedBeltBuffer.length; idx++)
    // TODO Size based on speed?
    sharedBeltBuffer[idx] = NewEntityStack("", 0, 16);

  // TODO: Static increasing id, stored someplace in state
  const beltLineId = new Date().getTime() % 100000;
  var beltLineName: string = "";
  for (
    ;
    beltLineName === "" || beltLineName.length > 15;
    beltLineName = randomName()
  ) {}
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
    inputBuffers: new Inventory(0),
    outputBuffers: new Inventory(1),
    outputStatus: { beltConnections: [] },
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
    inputBuffers: new Inventory(1),
    outputBuffers: new Inventory(0),
    outputStatus: { beltConnections: [] },
    otherRegionId: toRegion.Id,
    direction: "FROM_REGION",
    length: length,
    beltLineId: beltLineId,
    name: beltLineName,
  };

  const beltLine = {
    beltLineId: beltLineId,
    BuildingCount: initialLaneCount,
    //    toDepot: toBeltLine,
    //    fromDepot: fromBeltLine,
    toRegionId: toRegion.Id,
    fromRegionId: fromRegion.Id,
    length: length,
    sharedBeltBuffer: sharedBeltBuffer,
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
//   outputStatus: OutputStatus;
//   routeId: string;
// };
