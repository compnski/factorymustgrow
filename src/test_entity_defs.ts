import { Entity } from "./types"

export const TestOreEntity = {
  Name: "Test Ore",
  Id: "test-ore",
  Icon: "test-ore",
  StackSize: 50,
  Category: "fluids",
  Row: 1,
  Col: 2,
}
export const TestSlowOreEntity = {
  Name: "Test Slow Ore",
  Id: "test-slow-ore",
  Icon: "test-slow-ore",
  StackSize: 50,
  Category: "fluids",
  Row: 1,
  Col: 3,
}

export const TestItemEntity = {
  Name: "Test Item",
  Id: "test-item",
  Icon: "test-item",
  StackSize: 50,
  Category: "fluids",
  Row: 1,
  Col: 2,
}
export const TestSlowItemEntity = {
  Name: "Test Slow Item",
  Id: "test-slow-item",
  Icon: "test-slow-item",
  StackSize: 50,
  Category: "fluids",
  Row: 1,
  Col: 3,
}

export const TestAutomationSciencePack = {
  Name: "Test Automation Science Pack",
  Id: "automation-science-pack",
  Icon: "automation-science-pack",
  StackSize: 200,
  Category: "intermediate-products",
  Row: 2,
  Col: 1,
}

export const TestLogisticsSciencePack = {
  Name: "Test Logistics Science Pack",
  Id: "logistics-science-pack",
  Icon: "logistics-science-pack",
  StackSize: 200,
  Category: "intermediate-products",
  Row: 2,
  Col: 2,
}

export const TestEntityList = new Map<string, Entity>([
  ["test-ore", TestOreEntity],
  ["test-slow-ore", TestSlowOreEntity],
  ["test-item", TestItemEntity],
  ["test-slow-item", TestSlowItemEntity],
  ["automation-science-pack", TestAutomationSciencePack],
  ["logistic-science-pack", TestLogisticsSciencePack],
  //   ["test-item-consumer", TestItemConsumerRecipe],
])

export function GetTestEntity(name: string): Entity {
  const e = TestEntityList.get(name)
  if (!e) throw new Error("Cannot find entity for " + name)
  return e
}
