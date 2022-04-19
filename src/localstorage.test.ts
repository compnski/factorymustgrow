import { FactoryGameState, initialFactoryGameState } from "./useGameState";
import {
  saveStateToLocalStorage,
  loadStateFromLocalStorage,
  parse,
  serialize,
} from "./localstorage";
import { ImmutableMap } from "./immutable";
import { isImmutable, isMap } from "immutable";

fit("Can serialize various objects", () => {
  const types = [
    {
      original: new Map([["person", { name: "jason" }]]),
      expected: '{"dataType":"Map","value":[["person",{"name":"jason"}]]}',
    },
    {
      original: ImmutableMap([["person", { name: "jason" }]]),
      expected:
        '{"dataType":"ImmutableMap","value":[["person",{"name":"jason"}]]}',
    },
  ];
  const value = types[1].original;
  console.log(isImmutable(value), isMap(value));

  for (const { original, expected } of types) {
    const actual = serialize(original);
    expect(actual).toStrictEqual(expected);
    expect(parse(actual)).toStrictEqual(original);
  }
});

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
