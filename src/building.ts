import { Inserter, NewInserter } from "./inserter";
import { ReadonlyInventory } from "./inventory";
import { Extractor, Factory } from "./production";
import { Lab } from "./research";
import { Chest } from "./storage";
import { BeltLineDepot } from "./transport";
import { BeltConnection } from "./types";
import { ReadonlyBuildingSlot, ReadonlyItemBuffer } from "./factoryGameState";

export type BuildingSlot = {
  Building: Building;
  Inserter: Inserter;
  BeltConnections: BeltConnection[];
};

export type InserterId =
  | {
      location: "BUILDING";
      regionId: string;
      buildingIdx: number;
    }
  | {
      location: "BELT";
      regionId: string;
      buildingIdx: number;
      connectionIdx: number;
    };

export function InserterIdForBuilding(
  regionId: string,
  buildingIdx: number
): InserterId {
  return {
    location: "BUILDING",
    regionId,
    buildingIdx,
  };
}

export function InserterIdForBelt(
  regionId: string,
  buildingIdx: number,
  connectionIdx: number
): InserterId {
  return {
    location: "BELT",
    regionId,
    buildingIdx,
    connectionIdx,
  };
}

// export function NextEmptySlot(
//   BuildingSlots: ReadonlyBuildingSlot[]
// ): number | undefined {
//   const nextEmpty = BuildingSlots.findIndex((b) => b.Building.kind === "Empty");
//   return nextEmpty >= 0 ? nextEmpty : undefined;
// }

export function findFirstEmptyLane(
  BuildingSlots: ReadonlyBuildingSlot[],
  exceptThisIdx?: number
) {
  return BuildingSlots.findIndex(
    (bs, idx) =>
      bs.Building.kind === "Empty" &&
      (exceptThisIdx == undefined || idx != exceptThisIdx)
  );
}

export function NewBuildingSlot(
  Building: Building,
  numBeltConnections = 3
): BuildingSlot {
  const belts = [...Array(numBeltConnections)].map<BeltConnection>(
    (): BeltConnection => {
      return {
        Inserter: NewInserter(),
        laneId: undefined,
      };
    }
  );
  return {
    Building,
    Inserter: NewInserter(),
    BeltConnections: belts,
  };
}

export type Building =
  | Factory
  | Extractor
  | Lab
  | BeltLineDepot
  | Chest
  | EmptyLane;

export type EmptyLane = {
  kind: "Empty";
  subkind: "empty-lane";
  ProducerType: "Empty";
  inputBuffers: ReadonlyItemBuffer;
  outputBuffers: ReadonlyItemBuffer;
  BuildingCount: number;
};

export function NewEmptyLane(): EmptyLane {
  return {
    kind: "Empty",
    subkind: "empty-lane",
    ProducerType: "Empty",
    inputBuffers: new ReadonlyInventory(0),
    outputBuffers: new ReadonlyInventory(0),
    BuildingCount: 0,
  };
}

//| TrainStation;
//| Chest;
// Roboport
// // // //
