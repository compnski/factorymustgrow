import { FactoryGameState, initialFactoryGameState } from "./useGameState";
import {
  saveStateToLocalStorage,
  loadStateFromLocalStorage,
} from "./localstorage";

it("Saves a serialized state to local storage", () => {
  saveStateToLocalStorage(initialFactoryGameState());
  expect(loadStateFromLocalStorage({} as FactoryGameState)).toStrictEqual(
    initialFactoryGameState()
  );
});

it("Saves a mainBus to local storage", () => {
  const state = initialFactoryGameState();
  const region0 = state.Regions.get("region0");
  if (!region0) throw new Error("State region0 missing");
  region0.Bus.AddLane("copper-ore");
  saveStateToLocalStorage(state);
  expect(loadStateFromLocalStorage({} as FactoryGameState)).toStrictEqual(
    state
  );
});
