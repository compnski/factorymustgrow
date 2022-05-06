import { ImmutableMap } from "./immutable";
import { ReadonlyFixedInventory, ReadonlyInventory } from "./inventory";
import { NewEntityStack } from "./types";

describe("AvailableSpace", () => {
  it("Allows when there is extra slot capacity", () => {
    const inventory = new ReadonlyInventory(1);
    expect(inventory.AvailableSpace("iron-ore")).toBe(50);
  });

  describe("Fixed Readonly Inventory", () => {
    const initialInput = [
      { Entity: "automation-science-pack", Count: 50 },
      { Entity: "logistic-science-pack", Count: 0 },
    ];

    it("Calculates AvailableSpace", () => {
      const inventory = ReadonlyFixedInventory(
        initialInput.map((input) => NewEntityStack(input.Entity, input.Count))
      );

      expect(inventory.AvailableSpace("automation-science-pack")).toBe(150);
      expect(inventory.AvailableSpace("logistic-science-pack")).toBe(200);
      expect(inventory.AvailableSpace("production-science-pack")).toBe(0);
    });

    it("Can Remove", () => {
      const inventory = ReadonlyFixedInventory(
        initialInput.map((input) => NewEntityStack(input.Entity, input.Count))
      );

      expect(inventory.AddItems("automation-science-pack", -1)).toEqual(
        new ReadonlyInventory(
          2,
          ImmutableMap([
            ["automation-science-pack", 49],
            ["logistic-science-pack", 0],
          ]),
          true
        )
      );

      expect(inventory.AddItems("automation-science-pack", -0.1)).toEqual(
        new ReadonlyInventory(
          2,
          ImmutableMap([
            ["automation-science-pack", 49.9],
            ["logistic-science-pack", 0],
          ]),
          true
        )
      );
    });
  });

  it.todo(
    "Allows when there is no slot slot capacity but existing slot has capacity"
  );
  it.todo("Denies when totally full");
  it.todo("Denies when some other object has some capacity");
});
