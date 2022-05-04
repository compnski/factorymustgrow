import { FactoryGameState, initialFactoryGameState } from "./useGameState";
import {
  saveStateToLocalStorage,
  loadStateFromLocalStorage,
  parse,
  serialize,
} from "./localstorage";
import { ImmutableMap } from "./immutable";
import { isImmutable, isMap } from "immutable";
import { NewChest } from "./storage";

fit("Can serialize various objects", () => {
  const types = [
    {
      original: new Map([["person", { name: "jason" }]]),
      expected: '{"dataType":"Map","value":[["person",{"name":"jason"}]]}',
    },
    {
      original: { Progress: ImmutableMap([["person", { name: "jason" }]]) },
      expected:
        '{"Progress":{"dataType":"ImmutableMap","value":[["person",{"name":"jason"}]]}}',
    },
    // {
    //   original: NewChest(
    //     { subkind: "iron-chest" },
    //     4,
    //     ImmutableMap([["iron-ore", 10]])
    //   ),
    //   expected:
    //     '{"Progress":{"dataType":"ImmutableMap","value":[["person",{"name":"jason"}]]}}',
    // },
  ];

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

it("Saves and loads a chest", () => {
  const chest = NewChest(
    { subkind: "iron-chest" },
    4,
    ImmutableMap([["iron-ore", 10]])
  );
  const serializedChest = serialize(chest);
  const deserializedChest = parse(serializedChest);
  expect(deserializedChest).toEqual(chest);
});
