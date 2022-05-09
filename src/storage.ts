import { ImmutableMap } from "./immutable";
import { ReadonlyInventory } from "./inventory";
import { ReadonlyItemBuffer } from "./factoryGameState";

export type Chest = {
  kind: "Chest";
  subkind: "iron-chest" | "steel-chest" | "incinerator";
  ProducerType: string;
  inputBuffers: ReadonlyItemBuffer;
  outputBuffers: ReadonlyItemBuffer;
  BuildingCount: number;
};

export function NewChest(
  { subkind }: Pick<Chest, "subkind">,
  size = 4,
  initialContents = ImmutableMap<string, number>()
): Chest {
  const sharedStorage = new ReadonlyInventory(size, initialContents, false);

  return {
    kind: "Chest",
    subkind: subkind,
    ProducerType: "Chest",
    BuildingCount: size,
    inputBuffers: sharedStorage,
    outputBuffers: sharedStorage,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function UpdateChest(chest: Chest, tick: number) {
  // if (chest.subkind === "incinerator")
  //   chest.inputBuffers.Entities().forEach(([entity]) => {
  //     chest.inputBuffers.Remove(NewEntityStack(entity, 0, Infinity), 1);
  //   });
}
