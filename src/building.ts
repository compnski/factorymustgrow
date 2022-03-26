import { Inserter, NewInserter } from "./inserter";
import { Inventory } from "./inventory";
import { Extractor, Factory } from "./production";
import { Lab } from "./research";
import { Chest } from "./storage";
import { BeltLineDepot } from "./transport";
import { BeltConnection, ItemBuffer, OutputStatus } from "./types";

export type BuildingSlot = {
  Building: Building;
  Inserter: Inserter;
  BeltConnections: BeltConnection[];
};

export type InserterId =
  | {
      location: "BUILDING";
      buildingIdx: number;
    }
  | {
      location: "BELT";
      buildingIdx: number;
      connectionIdx: number;
    };

export function InserterIdForBuilding(buildingIdx: number): InserterId {
  return {
    location: "BUILDING",
    buildingIdx,
  };
}

export function InserterIdForBelt(
  buildingIdx: number,
  connectionIdx: number
): InserterId {
  return {
    location: "BELT",
    buildingIdx,
    connectionIdx,
  };
}

export function NextEmptySlot(
  BuildingSlots: BuildingSlot[]
): number | undefined {
  const nextEmpty = BuildingSlots.findIndex((b) => b.Building.kind === "Empty");
  return nextEmpty >= 0 ? nextEmpty : undefined;
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
        direction: undefined,
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
  inputBuffers: ItemBuffer;
  outputBuffers: ItemBuffer;
  BuildingCount: 0;
  outputStatus: OutputStatus;
};

export function NewEmptyLane(): EmptyLane {
  return {
    kind: "Empty",
    subkind: "empty-lane",
    ProducerType: "Empty",
    inputBuffers: new Inventory(0),
    outputBuffers: new Inventory(0),
    BuildingCount: 0,
    outputStatus: { beltConnections: [] },
  };
}

//| TrainStation;
//| Chest;
// Roboport
// // // //
