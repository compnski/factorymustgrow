import { ImmutableMap } from "./immutable";
import {
  Inventory,
  ReadonlyFixedInventory,
  ReadonlyInventory,
} from "./inventory";
import { NewEntityStack } from "./types";

describe("AvailableSpace", () => {
  it("Allows when there is extra slot capacity", () => {
    const inventory = new Inventory(1);
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

describe("Remove", () => {
  it.todo("ignores when entity not in inventory");
  describe("when target is capacity limited", () => {
    it("Removes properly from a single stack", () => {
      const targetStack = NewEntityStack("iron-ore", 0, 10);
      const inv = new Inventory(1, [NewEntityStack("iron-ore", 20, 50)]);
      const removed = inv.Remove(targetStack, 20);
      expect(removed).toBe(10);
      expect(inv.Count("iron-ore")).toBe(10);
      expect(targetStack.Count).toBe(10);
    });
    it("Removes properly from multiple stacks", () => {
      const targetStack = NewEntityStack("iron-ore", 0, 60);
      const inv = new Inventory(2, [
        NewEntityStack("iron-ore", 50, 50),
        NewEntityStack("iron-ore", 20, 50),
      ]);
      const removed = inv.Remove(targetStack, 70);
      expect(removed).toBe(60);
      expect(inv.Count("iron-ore")).toBe(10);
      expect(targetStack.Count).toBe(60);
    });
  });

  describe("when target capacity is unlimited", () => {
    it("Removes properly from a single stack", () => {
      const targetStack = NewEntityStack("iron-ore", 0, Infinity);
      const inv = new Inventory(1, [NewEntityStack("iron-ore", 20, 50)]);
      const removed = inv.Remove(targetStack, 20);
      expect(removed).toBe(20);
      expect(inv.Count("iron-ore")).toBe(0);
      expect(targetStack.Count).toBe(20);
    });

    it("Removes properly from multiple stacks", () => {
      const targetStack = NewEntityStack("iron-ore", 0, Infinity);
      const inv = new Inventory(2, [
        NewEntityStack("iron-ore", 50, 50),
        NewEntityStack("iron-ore", 20, 50),
      ]);
      const removed = inv.Remove(targetStack, 70);
      expect(removed).toBe(70);
      expect(inv.Count("iron-ore")).toBe(0);
      expect(targetStack.Count).toBe(70);
    });
  });
});
describe("Add", () => {
  describe("when target is capacity limited", () => {
    it.todo("properly from a single stack");
    it.todo("properly from multiple stacks");
  });
  describe("when target capacity is unlimited", () => {
    it.todo("properly from a single stack");
    it.todo("properly from multiple stacks");
  });
});
