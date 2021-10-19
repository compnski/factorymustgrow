import { ResearchMap } from "./gen/research";

export const IgnoredResearch: Set<string> = new Set([
  "stone-walls",
  "military",
  "turrets",
  "fast-inserter",
  "steel-axe",
  "electric-energy-distribution-2",
  "circuit-network",
  "automobilism",
  "explosives",
  "uranium-processing",
  "effectivity-module",
  "effect-transmission",
  "laser",

  //
  "research-speed-1",
  //"toolbelt",
  "mining-productivity-1",
  "braking-force-1",

  //
  "automated-rail-transportation",
  "fluid-wagon",
  "worker-robots-storage-1",
  "logistic-robotics",
  "worker-robots-speed-1",
  "coal-liquefaction",
  "automation-3",
  "logistics-3",
]);

export const AvailableResearchList = [...ResearchMap.values()].filter((r) => {
  if (
    IgnoredResearch.has(r.Id) ||
    [...r.Prereqs].filter((prereq) => IgnoredResearch.has(prereq)).length > 0 ||
    r.Icon === "worker-robots-speed" ||
    r.Icon === "worker-robots-storage"
  ) {
    return false;
  }
  return true;
});
