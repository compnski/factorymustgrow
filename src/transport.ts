import { Inventory } from "./inventory";
import { EntityStack, ItemBuffer, OutputStatus, Region } from "./types";
import { GameState } from "./useGameState";

// Thoughts
// Beltline has two BeltLineDepots

export function FindDepotForBeltLine(
  r: Region,
  beltLineId: number,
  direction: string
): BeltLineDepot | undefined {
  for (const b of r.Buildings) {
    if (b.kind === "BeltLineDepot") {
      const depot = b as BeltLineDepot;
      if (depot.beltLineId === beltLineId && depot.direction === direction) {
        return depot;
      }
    }
  }
  return undefined;
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
};

var nextBeltLineId = 1;

export function NewBeltLinePair(
  fromRegion: Region,
  toRegion: Region,
  subkind: "transport-belt" | "fast-transport-belt" | "express-transport-belt",
  length: number,
  initialLaneCount = 1
): [BeltLine, BeltLineDepot, BeltLineDepot] {
  const sharedBeltBuffer = Array<EntityStack>(length);

  // todo: Static increasing id
  const beltLineId = nextBeltLineId++;

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
    inputBuffers: new Inventory(1),
    outputBuffers: new Inventory(1),
    outputStatus: { above: "NONE", below: "NONE", beltConnections: [] },
    otherRegionId: fromRegion.Id,
    direction: "TO_REGION",
    length: length,
    beltLineId: beltLineId,
  };

  const fromBeltLine: BeltLineDepot = {
    kind: "BeltLineDepot",
    ProducerType: "Depot",
    subkind: subkind,
    BuildingCount: initialLaneCount,
    inputBuffers: new Inventory(1),
    outputBuffers: new Inventory(1),
    outputStatus: { above: "NONE", below: "NONE", beltConnections: [] },
    otherRegionId: toRegion.Id,
    direction: "FROM_REGION",
    length: length,
    beltLineId: beltLineId,
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
