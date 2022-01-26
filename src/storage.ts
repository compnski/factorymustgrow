import { Inventory } from "./inventory";
import { EntityStack, ItemBuffer, NewEntityStack, OutputStatus } from "./types";

export type Chest = {
  kind: "Chest";
  subkind: "iron-chest" | "steel-chest" | "incinerator";
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

export function UpdateChest(chest: Chest, tick: number) {
  if (chest.subkind === "incinerator")
    chest.inputBuffers.Entities().forEach(([entity]) => {
      chest.inputBuffers.Remove(NewEntityStack(entity, 0, Infinity), 1);
    });
}

export function UpdateChestSize(chest: Chest) {
  if (chest.BuildingCount != chest.inputBuffers.Capacity) {
    chest.inputBuffers.Capacity = chest.BuildingCount;
  }
}
