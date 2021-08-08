import { Inventory } from "./inventory";
import { NewEntityStack } from "./types";

describe("CanFit", () => {
  it("Allows when there is extra slot capacity", () => {
    const inventory = new Inventory(1);
    expect(inventory.CanFit(NewEntityStack("iron-ore", 10))).toBe(true);
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
    it.todo("Removes properly from a single stack");
    it.todo("Removes properly from multiple stacks");
  });
  describe("when target capacity is unlimited", () => {
    it.todo("Removes properly from a single stack");
    it.todo("Removes properly from multiple stacks");
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
