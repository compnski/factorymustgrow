import { Inserter } from "./inserter";
import { Inventory } from "./inventory";
import { Extractor, Factory } from "./production";
import { Lab } from "./research";
import { Chest } from "./storage";
import { BeltLineDepot } from "./transport";
import { BeltConnection, ItemBuffer, OutputStatus } from "./types";

export type BuildingSlot = {
  Building: Building;
  Inserter: Inserter;
  BeltInserters: Inserter[];
  BeltConnections: BeltConnection[];
};

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
