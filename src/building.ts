import { Extractor, Factory, TrainStation } from "./production";
import { Lab } from "./research";
import { BeltLine } from "./transport";
import { EntityStack, OutputStatus } from "./types";

export type Building =
  | Factory
  | Extractor
  | Lab
  | BeltLine
  | TrainStation
  | Chest;
// Roboport
// // // //
export type Chest = {
  kind: "Chest";
  subkind: "IronChest" | "SteelChest";
  inputBuffers: Map<string, EntityStack>;
  outputBuffers: Map<string, EntityStack>;
  outputStatus: OutputStatus;
};
