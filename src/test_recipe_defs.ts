import { NewEntityStack, Recipe } from "./types";
export const TestOreRecipe: Recipe = {
  //Name: "Test Ore",
  Icon: "test-ore",
  Id: "test-ore",
  ProducerType: "Miner",
  DurationSeconds: 1,
  Input: [NewEntityStack("test-ore", 1)],
  Output: [NewEntityStack("test-ore", 1)],
  ProductionPerTick: 1,
};

export const TestSlowOreRecipe: Recipe = {
  //Name: "Test Slow Ore",
  Icon: "test-slow-ore",
  Id: "test-slow-ore",
  ProducerType: "Miner",
  DurationSeconds: 2,
  Input: [NewEntityStack("test-ore", 1)],
  Output: [NewEntityStack("test-ore", 1)],
  ProductionPerTick: 0.5,
};

export const TestRecipe: Recipe = {
  //Name: "Test Item",
  Icon: "test-item",
  Id: "test-item",
  ProducerType: "Assembler",
  DurationSeconds: 1,
  Input: [NewEntityStack("test-ore", 2), NewEntityStack("test-slow-ore", 3)],
  Output: [NewEntityStack("test-item", 1)],
  ProductionPerTick: 1,
};

export const TestSlowRecipe: Recipe = {
  //Name: "Test Slow Item",
  Icon: "test-item",
  Id: "test-slow-item",
  ProducerType: "Assembler",
  DurationSeconds: 2,
  Input: [NewEntityStack("test-ore", 2), NewEntityStack("test-slow-ore", 3)],
  Output: [NewEntityStack("test-item", 1)],
  ProductionPerTick: 0.5,
};

export const TestItemConsumerRecipe: Recipe = {
  //Name: "Test Item Consumer",
  Icon: "test-item-consumer",
  Id: "test-item-consumer",
  ProducerType: "Assembler",
  DurationSeconds: 1,
  Input: [NewEntityStack("test-item", 2)],
  Output: [NewEntityStack("test-ore", 1)],
  ProductionPerTick: 1,
};

export const TestRecipeBook = new Map<string, Recipe>([
  ["test-ore", TestOreRecipe],
  ["test-slow-ore", TestSlowOreRecipe],
  ["test-item", TestRecipe],
  ["test-slow-item", TestSlowRecipe],
  ["test-item-consumer", TestItemConsumerRecipe],
]);
