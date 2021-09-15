import { FactoryGameState } from "./useGameState";
import { Inventory } from "./inventory";
import { MainBus } from "./mainbus";

const replacer = (key: string, value: any): any =>
  value instanceof Map
    ? {
        dataType: "Map",
        value: [...value],
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
        slots: value.Slots,
        immutableSlots: value.immutableSlots,
      }
    : value === Infinity
    ? "Infinity"
    : value;

const reviver = (key: string, value: any): any => {
  return value === "Infinity"
    ? Infinity
    : typeof value !== "object" || !value
    ? value
    : value.dataType === "Map"
    ? new Map(value.value)
    : value.dataType === "Set"
    ? new Set(value.value)
    : value.dataType === "MainBus"
    ? new MainBus(value.nextId, value.lanes)
    : value.dataType === "Inventory"
    ? new Inventory(value.maxCapacity, value.slots, value.immutableSlots)
    : value;
};

const serialize = (obj: any): string => JSON.stringify(obj, replacer);
const parse = (s: string): any => JSON.parse(s, reviver);

export const saveStateToLocalStorage = (gs: FactoryGameState) => {
  localStorage.setItem("FactoryGameState", serialize(gs));
};

export const loadStateFromLocalStorage = (
  defaultState: FactoryGameState
): FactoryGameState => {
  try {
    return (
      parse(localStorage.getItem("FactoryGameState") || "false") || defaultState
    );
  } catch (e) {
    console.log(e);
  }
  return defaultState;
};
