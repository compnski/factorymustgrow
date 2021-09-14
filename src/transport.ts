import { EntityStack, OutputStatus, Region } from "./types";
import { GameState } from "./useGameState";

// Thoughts
// Beltline has two BeltLineDepots

export type BeltLineDepot = {
  kind: "BeltLineDepot";
  subkind: "transport-belt" | "fast-transport-belt" | "express-transport-belt";
  ProducerType: "Depot";
  inputBuffers: Map<string, EntityStack>;
  outputBuffers: Map<string, EntityStack>;
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

export function UpdateBeltLineItem(belt: BeltLineDepot, entity: string) {
  // Move input buffers into inventory
  // Update InputBuffers to new item type

  for (var [, stack] of belt.inputBuffers) {
    GameState.Inventory.Add(stack, Infinity, true);
  }
}

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
    inputBuffers: new Map(),
    outputBuffers: new Map(),
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
    inputBuffers: new Map(),
    outputBuffers: new Map(),
    outputStatus: { above: "NONE", below: "NONE", beltConnections: [] },
    otherRegionId: toRegion.Id,
    direction: "FROM_REGION",
    length: length,
    beltLineId: beltLineId,
  };

  const beltLine = {
    beltLineId: beltLineId,
    BuildingCount: initialLaneCount,
    toDepot: toBeltLine,
    fromDepot: fromBeltLine,
    toRegionId: toRegion.Id,
    fromRegionId: fromRegion.Id,
    length: length,
    sharedBeltBuffer: sharedBeltBuffer,
  };
  //fromBeltLine.BeltLine = beltLine;
  //toBeltLine.BeltLine = beltLine;
  return [beltLine, fromBeltLine, toBeltLine];
}

export type TrainStation = {
  kind: "TrainStation";
  subkind: "";
  ProducerType: string;
  inputBuffers: Map<string, EntityStack>;
  outputBuffers: Map<string, EntityStack>;
  outputStatus: OutputStatus;
  routeId: string;
};
