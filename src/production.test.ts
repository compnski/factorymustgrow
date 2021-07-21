import { NewFactory, ProduceFromFactory } from "./production";
import { FillEntityStack, NewEntityStack, Recipe } from "./types";

const TestRecipe: Recipe = {
  Name: "Test Item",
  Icon: "test-item",
  Id: "test-item",
  ProducerType: "Assembler",
  DurationSeconds: 1,
  Input: [NewEntityStack("iron-ore", 0, 2), NewEntityStack("copper-ore", 0, 3)],
  Output: NewEntityStack("test-item", 0, 1),
  ProductionPerTick: 1,
};

const TestSlowRecipe: Recipe = {
  Name: "Test Slow Item",
  Icon: "test-item",
  Id: "test-slow-item",
  ProducerType: "Assembler",
  DurationSeconds: 2,
  Input: [NewEntityStack("iron-ore", 0, 2), NewEntityStack("copper-ore", 0, 3)],
  Output: NewEntityStack("test-item", 0, 1),
  ProductionPerTick: 0.5,
};

const TestRecipeBook = new Map<string, Recipe>([
  ["test-item", TestRecipe],
  ["test-slow-item", TestSlowRecipe],
]);

it("Produces a single item", () => {
  const factory = NewFactory(TestRecipe, 1);
  factory.inputBuffers.forEach((input) => FillEntityStack(input, 10));

  const produced = ProduceFromFactory(
    factory,
    TestRecipeBook.get.bind(TestRecipeBook)
  );
  expect(produced).toBe(1);
  expect(factory.outputBuffer.Count).toBe(1);
  expect(factory.inputBuffers.get("iron-ore")?.Count).toBe(8);
  expect(factory.inputBuffers.get("copper-ore")?.Count).toBe(7);
});

it("Produces three item", () => {
  const factory = NewFactory(TestRecipe, 1);
  factory.inputBuffers.forEach((input) => FillEntityStack(input, 10));
  factory.ProducerCount = 3;

  const produced = ProduceFromFactory(
    factory,
    TestRecipeBook.get.bind(TestRecipeBook)
  );
  expect(produced).toBe(3);
  expect(factory.outputBuffer.Count).toBe(3);
  expect(factory.inputBuffers.get("iron-ore")?.Count).toBe(4);
  expect(factory.inputBuffers.get("copper-ore")?.Count).toBe(1);
});

it("Produces 1.5 items", () => {
  const factory = NewFactory(TestSlowRecipe, 1);
  factory.inputBuffers.forEach((input) => FillEntityStack(input, 10));
  factory.ProducerCount = 3;

  const produced = ProduceFromFactory(
    factory,
    TestRecipeBook.get.bind(TestRecipeBook)
  );
  expect(produced).toBe(1.5);
  expect(factory.outputBuffer.Count).toBe(1.5);
  expect(factory.inputBuffers.get("iron-ore")?.Count).toBe(7);
  expect(factory.inputBuffers.get("copper-ore")?.Count).toBe(5.5);
});
