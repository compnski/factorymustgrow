import { Research } from "./types";

export const IgnoredResearch: Set<string> = new Set([
  "stone-walls",
  "military",
  "turrets",
  "fast-inserter",
  "steel-axe",
  "electric-energy-distribution-1",
  "electric-energy-distribution-2",
  "solar-energy",
  "circuit-network",
  "automobilism",
  "explosives",
  "uranium-processing",
  "effectivity-module",
  "effectivity-module-2",
  "effectivity-module-3",
  "effect-transmission",
  "optics",
  "laser",
  "construction-robotics",
  "logistics",

  //
  "research-speed-1",
  "research-speed-2",
  "research-speed-3",
  "research-speed-4",
  "research-speed-5",
  "research-speed-6",
  //
  "inserter-capacity-bonus-1",
  "inserter-capacity-bonus-2",
  "inserter-capacity-bonus-3",
  "inserter-capacity-bonus-4",
  "inserter-capacity-bonus-5",
  "inserter-capacity-bonus-6",
  "inserter-capacity-bonus-7",
  //
  "mining-productivity-1",
  "mining-productivity-2",
  "mining-productivity-3",
  //
  "braking-force-1",
  "braking-force-2",
  "braking-force-3",
  "braking-force-4",
  "braking-force-5",
  "braking-force-6",
  "braking-force-7",
  //
  "automated-rail-transportation",
  "fluid-wagon",
  "worker-robots-storage-1",
  "logistic-robotics",
  "worker-robots-speed-1",
  "coal-liquefaction",
  "automation-3",
  "logistics-3",
  "nuclear-fuel-reprocessing",
  // Not yet
  "logistics-2",
  "toolbelt",
]);

export function FilterToAvailableResearch(r: Research) {
  if (
    IgnoredResearch.has(r.Id) ||
    [...r.Prereqs].filter((prereq) => IgnoredResearch.has(prereq)).length > 0 ||
    r.Icon === "worker-robots-speed" ||
    r.Icon === "worker-robots-storage"
  ) {
    return false;
  }
  return true;
}
