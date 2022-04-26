import { Research } from "./types";

export const TestResearch = {
  Id: "test-research",
  Name: "Test research",
  Icon: "test-research",
  Input: [
    { Entity: "automation-science-pack", Count: 1 },
    { Entity: "logistic-science-pack", Count: 1 },
  ],
  ProductionRequiredForCompletion: 150,
  ProductionPerTick: 0.25,
  DurationSeconds: 1,
  Row: 2,
  Prereqs: new Set(["fast-inserter", "logistics-2", "advanced-electronics"]),
  Unlocks: ["test-research", "stack-filter-inserter"],
  Effects: ["Test research capacity: +1"],
};

export const TestSlowResearch = {
  Id: "test-slow-research",
  Name: "Test research",
  Icon: "test-research",
  Input: [
    { Entity: "automation-science-pack", Count: 1 },
    { Entity: "logistic-science-pack", Count: 1 },
  ],
  ProductionPerTick: 0.033333335,
  DurationSeconds: 30,
  ProductionRequiredForCompletion: 150,
  Row: 2,
  Prereqs: new Set(["fast-inserter", "logistics-2", "advanced-electronics"]),
  Unlocks: ["test-slow-research", "slow-stack-filter-inserter"],
  Effects: ["Slow Test research capacity: +1"],
};

export const TestResearchBook = new Map<string, Research>([
  ["test-research", TestResearch],
  ["test-slow-research", TestSlowResearch],
]);
