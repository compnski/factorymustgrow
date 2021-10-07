import { Inventory } from "./inventory";
import { EntityStack, ItemBuffer, OutputStatus } from "./types";

export type Chest = {
  kind: "Chest";
  subkind: "iron-chest" | "steel-chest";
  ProducerType: string;
  inputBuffers: ItemBuffer;
  outputBuffers: ItemBuffer;
  outputStatus: OutputStatus;
  BuildingCount: number;
};

export function NewChest(
  { subkind }: Pick<Chest, "subkind">,
  size: number = 4,
  initialContents: EntityStack[] = []
): Chest {
  console.log("new chest");
  const sharedStorage = new Inventory(size);
  initialContents.forEach((es) => sharedStorage.Add(es));
  return {
    kind: "Chest",
    subkind: subkind,
    ProducerType: "Chest",
    BuildingCount: size,
    inputBuffers: sharedStorage,
    outputBuffers: sharedStorage,
    outputStatus: { beltConnections: [] },
  };
}
