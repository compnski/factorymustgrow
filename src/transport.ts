import { EntityStack, OutputStatus } from "./types";

export type BeltLine = {
  kind: "BeltLine";
  subkind: "YellowBelt" | "RedBelt" | "BlueBelt";
  inputBuffers: Map<string, EntityStack>;
  outputBuffers: Map<string, EntityStack>;
  outputStatus: OutputStatus;
  otherRegionId: string;
  direction: "TO_REGION" | "FROM_REGION";
};

export type TrainStation = {
  kind: "TrainStation";
  subkind: "";
  inputBuffers: Map<string, EntityStack>;
  outputBuffers: Map<string, EntityStack>;
  outputStatus: OutputStatus;
  routeId: string;
};
