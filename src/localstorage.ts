import { CurrentGameStateVersion, FactoryGameState } from "./useGameState";
import { Inventory } from "./inventory";
import { MainBus } from "./mainbus";
import { ResearchOutput } from "./research";
import { NewChest } from "./storage";
import { ImmutableMap } from "./immutable";
import { isImmutable, isMap } from "immutable";

function toType<T>(
  dataType: string,
  value: T[]
): { dataType: string; value: T[] } {
  return {
    dataType,
    value,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const replacer = (key: string, value: any): any => {
  switch (key) {
    case "Progress":
      return toType("ImmutableMap", Object.entries(value));
  }
  return value instanceof Map
    ? {
        dataType: "Map",
        value: [...value],
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
    : value instanceof Inventory
    ? {
        dataType: "Inventory",
        maxCapacity: value.Capacity,
        slots: value.slots,
        immutableSlots: value.immutableSlots,
      }
    : value instanceof ResearchOutput
    ? {
        dataType: "ResearchOutput",
        researchId: value.researchId,
        progress: value.progress,
        maxProgress: value.maxProgress,
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
    : value.dataType === "Inventory"
    ? new Inventory(value.maxCapacity, value.slots, value.immutableSlots)
    : value.dataType === "ResearchOutput"
    ? new ResearchOutput(value.researchId, value.progress, value.maxProgress)
    : value.kind === "Chest"
    ? NewChest(value, value.BuildingCount, value.inputBuffers.slots)
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
