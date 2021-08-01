import { EntityStack, OutputStatus } from "./types";

export type Lab = {
  kind: "lab";
  RecipeId: string;
  inputBuffers: Map<string, EntityStack>;
  outputBuffer: EntityStack;
  ProducerCount: number;
  outputStatus: OutputStatus;
};
