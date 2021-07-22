import { FactoryGameState } from "./factoryGame";
import { MainBus } from "./types";

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
        value: [value.nextLaneId, value.lanes],
      }
    : value;

const reviver = (key: string, value: any): any =>
  typeof value !== "object" || !value
    ? value
    : value.dataType === "Map"
    ? new Map(value.value)
    : value.dataType === "Set"
    ? new Set(value.value)
    : value.dataType === "MainBus"
    ? new MainBus(...value.value)
    : value;

const serialize = (obj: any): string => JSON.stringify(obj, replacer);
const parse = (s: string): any => JSON.parse(s, reviver);

export const saveStateToLocalStorage = (gs: FactoryGameState) => {
  localStorage.setItem("FactoryGameState", serialize(gs));
};

export const loadStateFromLocalStorage = (
  defaultState: FactoryGameState
): FactoryGameState =>
  parse(localStorage.getItem("FactoryGameState") || "false") || defaultState;
