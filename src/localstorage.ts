import { isImmutable, isMap } from "immutable"
import { DebugInventory } from "./debug"
import { ImmutableMap } from "./immutable"
import { ReadonlyInventory } from "./inventory"
import { ResearchOutput } from "./research"
import { NewChest } from "./storage"
import { Region } from "./types"
import { CurrentGameStateVersion, FactoryGameState } from "./factoryGameState"

function toType<T>(dataType: string, value: T[]): { dataType: string; value: T[] } {
  if (value.length && (value[0] as unknown as unknown[])[0] == "region0") {
    const ore = (value as unknown as [[string, Region]])[0][1].Ore
    if (!(ore instanceof ReadonlyInventory)) console.log(ore)
  }
  return {
    dataType,
    value,
  }
}

interface HasSerializeName {
  SerializeName: string
}
function isSerializableObject(value: unknown, searchKind: string) {
  return value instanceof Object && (value as HasSerializeName).SerializeName == searchKind
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const replacer = (key: string, value: any): any => {
  const logger = (logCondition: boolean, msg: string): true => {
    if (logCondition) console.log("replacer", msg, key, value)
    return true
  }

  switch (key) {
    case "Progress":
    case "Regions":
    case "TruckLines":
      return toType("ImmutableMap", Object.entries(value))
  }
  return isSerializableObject(value, "DebugInventory")
    ? {
        dataType: "DebugInventory",
      }
    : isSerializableObject(value, "ReadonlyInventory")
    ? logger(false && key == "Inventory", "Not DebugInventory") && {
        dataType: "ReadonlyInventory",
        maxCapacity: value.Capacity,
        Data: [...value.Data.entries()],
        immutableSlots: value.immutableSlots,
      }
    : value instanceof Set
    ? {
        dataType: "Set",
        value: [...value],
      }
    : isSerializableObject(value, "ResearchOutput")
    ? {
        dataType: "ResearchOutput",
        researchId: value.researchId,
        progress: value.progress,
        maxProgress: value.maxProgress,
      }
    : isImmutable(value) && isMap(value)
    ? {
        dataType: "ImmutableMap",
        value: [...value.entries()],
      }
    : value instanceof Map
    ? {
        dataType: "Map",
        value: [...value],
      }
    : value === Infinity
    ? "Infinity"
    : logger(false && value instanceof Object && value.Capacity !== undefined, "Skipped an inventory") &&
      value
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reviver = (key: string, value: any): any => {
  return value === "Infinity"
    ? Infinity
    : typeof value !== "object" || !value
    ? value
    : value.dataType === "Map"
    ? new Map(value.value)
    : value.dataType === "ImmutableMap"
    ? ImmutableMap(value.value)
    : value.dataType === "Set"
    ? new Set(value.value)
    : value.dataType === "DebugInventory"
    ? new DebugInventory()
    : value.dataType === "ReadonlyInventory"
    ? new ReadonlyInventory(value.maxCapacity, ImmutableMap(value.Data), value.immutableSlots)
    : value.dataType === "ResearchOutput"
    ? new ResearchOutput(value.researchId, value.progress, value.maxProgress)
    : value.kind === "Chest"
    ? NewChest(value, value.BuildingCount, value.outputBuffers.Data)
    : value
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serializeGameState = (obj: any): string => JSON.stringify(obj, replacer)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deserializeGameState = (s: string): any => JSON.parse(s, reviver)

export const saveStateToLocalStorage = (gs: FactoryGameState) => {
  localStorage.setItem("FactoryGameState", serializeGameState(gs))
  localStorage.setItem("FactoryGameStateVersion", CurrentGameStateVersion)
}

// NOTE: Editing this contants will INVALIDATE ALL SAVED DATA EVERYWHERE.

function AcceptableStoredVersion(): boolean {
  return localStorage.getItem("FactoryGameStateVersion") === CurrentGameStateVersion
}

export const loadStateFromLocalStorage = (defaultState: FactoryGameState): FactoryGameState => {
  try {
    if (!AcceptableStoredVersion()) return defaultState
    return deserializeGameState(localStorage.getItem("FactoryGameState") || "false") || defaultState
  } catch (e) {
    console.log(e)
  }
  return defaultState
}
