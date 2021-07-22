import { FactoryGameState, initialFactoryGameState } from "./factoryGame";
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
