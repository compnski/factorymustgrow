import { assert } from "console";
import { isImmutable, isMap } from "immutable";
import { DebugInventory } from "./debug";
import { ImmutableMap } from "./immutable";
import { ReadonlyInventory } from "./inventory";
import { MainBus } from "./mainbus";
import { ResearchOutput } from "./research";
import { NewChest } from "./storage";
import { Region } from "./types";
import { CurrentGameStateVersion, FactoryGameState } from "./useGameState";

function toType<T>(
  dataType: string,
  value: T[]
): { dataType: string; value: T[] } {
  if (value.length && (value[0] as unknown as unknown[])[0] == "region0") {
    //console.log((value as unknown as [[string, Region]])[0][1]);
  }
  return {
    dataType,
    value,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const replacer = (key: string, value: any): any => {
  switch (key) {
    case "Progress":
    case "Regions":
    case "BeltLines":
      return toType("ImmutableMap", Object.entries(value));
  }
  return value instanceof DebugInventory
    ? {
        dataType: "DebugInventory",
      }
    : value instanceof ReadonlyInventory
    ? {
        dataType: "ReadonlyInventory",
        maxCapacity: value.Capacity,
        Data: [...value.Data.entries()],
        immutableSlots: value.immutableSlots,
      }
    : isImmutable(value) && isMap(value)
    ? {
        dataType: "ImmutableMap",
        value: [...value.entries()],
      }
    : value instanceof Set
    ? {
        dataType: "Set",
        value: [...value],
      }
    : value instanceof MainBus
    ? {
        dataType: "MainBus",
        nextId: value.nextLaneId,
        lanes: value.lanes,
      }
    : value instanceof ResearchOutput
    ? {
        dataType: "ResearchOutput",
        researchId: value.researchId,
        progress: value.progress,
        maxProgress: value.maxProgress,
      }
    : value instanceof Map
    ? {
        dataType: "Map",
        value: [...value],
      }
    : value === Infinity
    ? "Infinity"
    : value;
};
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
    : value.dataType === "MainBus"
    ? new MainBus(value.nextId, value.lanes)
    : value.dataType === "DebugInventory"
    ? new DebugInventory()
    : value.dataType === "ReadonlyInventory"
    ? new ReadonlyInventory(
        value.maxCapacity,
        ImmutableMap(value.Data),
        value.immutableSlots
      )
    : value.dataType === "ResearchOutput"
    ? new ResearchOutput(value.researchId, value.progress, value.maxProgress)
    : value.kind === "Chest"
    ? NewChest(value, value.BuildingCount, value.outputBuffers.Data)
    : value;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serialize = (obj: any): string => JSON.stringify(obj, replacer);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parse = (s: string): any => JSON.parse(s, reviver);

export const saveStateToLocalStorage = (gs: FactoryGameState) => {
  localStorage.setItem("FactoryGameState", serialize(gs));
  localStorage.setItem("FactoryGameStateVersion", CurrentGameStateVersion);
};

// NOTE: Editing this contants will INVALIDATE ALL SAVED DATA EVERYWHERE.

function AcceptableStoredVersion(): boolean {
  return (
    localStorage.getItem("FactoryGameStateVersion") === CurrentGameStateVersion
  );
}

export const loadStateFromLocalStorage = (
  defaultState: FactoryGameState
): FactoryGameState => {
  try {
    if (!AcceptableStoredVersion()) return defaultState;
    return (
      parse(localStorage.getItem("FactoryGameState") || "false") || defaultState
    );
  } catch (e) {
    console.log(e);
  }
  return defaultState;
};
