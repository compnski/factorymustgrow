import { ImmutableMap } from "./immutable"
import { ReadonlyInventory } from "./inventory"
import { ReadonlyItemBuffer } from "./factoryGameState"
import { DispatchFunc } from "./stateVm"
import { BuildingAddress } from "./state/address"
import { ProduceWithTracker } from "./AddProgressTracker"
import { EntityStack, NewEntityStack } from "./types"

export type Chest = {
  kind: "Chest"
  subkind: "iron-chest" | "steel-chest" | "incinerator"
  ProducerType: string
  inputBuffers: ReadonlyItemBuffer
  outputBuffers: ReadonlyItemBuffer
  BuildingCount: number
  progressTrackers: number[]
}

export function NewChest(
  { subkind }: Pick<Chest, "subkind">,
  size = 4,
  initialContents = ImmutableMap<string, number>()
): Chest {
  const sharedStorage = new ReadonlyInventory(size, initialContents, false)

  return {
    kind: "Chest",
    subkind: subkind,
    ProducerType: "Chest",
    BuildingCount: size,
    inputBuffers: sharedStorage,
    outputBuffers: sharedStorage,
    progressTrackers: [],
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function UpdateChest(
  dispatch: DispatchFunc,
  chest: Chest,
  address: BuildingAddress,
  currentTick: number
) {
  if (chest.subkind === "incinerator") {
    return ProduceWithTracker({
      dispatch,
      currentTick,
      buildingAddress: address,
      recipe: toRecipe(chest.inputBuffers),
      building: { ...chest, BuildingCount: 1 },
    })
  }
}

function toRecipe(inputBuffers: ReadonlyItemBuffer) {
  return {
    Input: inputBuffers.Entities().map(([entity, count]) => NewEntityStack(entity, Math.min(count, 5))),
    Output: [] as EntityStack[],
    DurationSeconds: 1,
  }
}
