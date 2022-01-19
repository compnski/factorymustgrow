import { Map } from "immutable";

export function ResearchTier(id: string): number {
  const tier = ResearchTiers.get(id);
  if (tier === undefined) throw new Error("No tier found for research " + id);
  return tier;
}

export const ResearchTiers = Map({
  start: -1,
  automation: -1,
  logistics: 0,
  "logistic-science-pack": 0,
  military: 0,
  optics: 0,
  turrets: 0,
  "steel-processing": 0,
  "stone-walls": 0,
  electronics: 0,
  "steel-axe": 1,
  "heavy-armor": 1,
  "weapon-shooting-speed-1": 1,
  "physical-projectile-damage-1": 1,
  "fast-inserter": 2,
  "logistics-2": 1,
  landfill: 1,
  engine: 1,
  "weapon-shooting-speed-2": 2,
  "physical-projectile-damage-2": 2,
  "automation-2": 2,
  "solar-energy": 2,
  toolbelt: 1,
  "military-2": 1,
  "advanced-material-processing": 1,
  "electric-energy-distribution-1": 2,
  "circuit-network": 2,
  "fluid-handling": 3,
  "military-science-pack": 2,
  "stronger-explosives-1": 2,
  "research-speed-1": 3,
  concrete: 3,
  gates: 2,
  automobilism: 2,
  railway: 2,
  "oil-processing": 4,
  "automated-rail-transportation": 3,
  "fluid-wagon": 4,
  "research-speed-2": 4,
  "rail-signals": 4,
  "sulfur-processing": 5,
  flammables: 5,
  plastics: 5,
  battery: 6,
  explosives: 6,
  "advanced-electronics": 6,
  "land-mine": 7,
  "cliff-explosives": 7,
  "weapon-shooting-speed-3": 3,
  "stack-inserter": 7,
  "stronger-explosives-2": 3,
  "physical-projectile-damage-3": 3,
  rocketry: 7,
  flamethrower: 6,
  "combat-robotics": 3,
  "mining-productivity-1": 7,
  "modular-armor": 7,
  modules: 7,
  "chemical-science-pack": 7,
  "electric-energy-accumulators": 7,
  "effectivity-module": 8,
  "follower-robot-count-1": 4,
  "refined-flammables-1": 7,
  "productivity-module": 8,
  "inserter-capacity-bonus-1": 8,
  "speed-module": 8,
  "solar-panel-equipment": 8,
  "weapon-shooting-speed-4": 4,
  "physical-projectile-damage-4": 4,
  "energy-shield-equipment": 9,
  "inserter-capacity-bonus-2": 9,
  "night-vision-equipment": 9,
  "follower-robot-count-2": 5,
  "belt-immunity-equipment": 9,
  "battery-equipment": 9,
  "refined-flammables-2": 8,
  "advanced-oil-processing": 8,
  "refined-flammables-3": 9,
  "advanced-material-processing-2": 8,
  "advanced-electronics-2": 8,
  "military-3": 8,
  "research-speed-3": 5,
  "physical-projectile-damage-5": 5,
  "mining-productivity-2": 8,
  "uranium-processing": 8,
  "stronger-explosives-3": 4,
  "electric-energy-distribution-2": 8,
  laser: 8,
  "follower-robot-count-3": 6,
  "weapon-shooting-speed-5": 5,
  "low-density-structure": 8,
  "inserter-capacity-bonus-3": 10,
  "braking-force-1": 8,
  lubricant: 9,
  "production-science-pack": 9,
  "braking-force-2": 9,
  "follower-robot-count-4": 7,
  "laser-turrets": 9,
  "energy-weapons-damage-1": 9,
  "rocket-fuel": 9,
  "explosive-rocketry": 9,
  "nuclear-power": 9,
  "effectivity-module-2": 9,
  "speed-module-2": 9,
  "combat-robotics-2": 9,
  "productivity-module-2": 9,
  tanks: 9,
  "research-speed-4": 6,
  "electric-engine": 10,
  "energy-weapons-damage-2": 10,
  "laser-turret-speed-1": 10,
  robotics: 11,
  "power-armor": 11,
  "laser-turret-speed-2": 11,
  "energy-weapons-damage-3": 11,
  "exoskeleton-equipment": 11,
  "personal-laser-defense-equipment": 12,
  "utility-science-pack": 12,
  "effect-transmission": 10,
  "speed-module-3": 10,
  "kovarex-enrichment-process": 10,
  "coal-liquefaction": 10,
  "inserter-capacity-bonus-4": 11,
  "nuclear-fuel-reprocessing": 10,
  "effectivity-module-3": 10,
  "research-speed-5": 7,
  "energy-shield-mk2-equipment": 12,
  "automation-3": 10,
  "discharge-defense-equipment": 12,
  "worker-robots-storage-1": 12,
  "logistic-robotics": 12,
  "construction-robotics": 12,
  "battery-mk2-equipment": 12,
  "worker-robots-speed-1": 12,
  "laser-turret-speed-3": 12,
  "productivity-module-3": 10,
  "logistics-3": 10,
  "braking-force-3": 10,
  "energy-weapons-damage-4": 12,
  "personal-roboport-equipment": 13,
  "braking-force-4": 11,
  "worker-robots-speed-2": 13,
  "inserter-capacity-bonus-5": 12,
  "worker-robots-storage-2": 13,
  "laser-turret-speed-4": 13,
  "braking-force-5": 12,
  "inserter-capacity-bonus-6": 13,
  "fusion-reactor-equipment": 13,
  "energy-weapons-damage-5": 13,
  "weapon-shooting-speed-6": 6,
  "laser-turret-speed-5": 14,
  "worker-robots-speed-3": 14,
  "logistic-system": 13,
  "inserter-capacity-bonus-7": 14,
  "rocket-control-unit": 13,
  "refined-flammables-4": 10,
  "braking-force-6": 13,
  "stronger-explosives-4": 5,
  "personal-roboport-mk2-equipment": 14,
  "mining-productivity-3": 9,
  "military-4": 13,
  "worker-robots-storage-3": 14,
  "research-speed-6": 8,
  "physical-projectile-damage-6": 6,
  "atomic-bomb": 14,
  "power-armor-mk2": 14,
  "worker-robots-speed-4": 15,
  "braking-force-7": 14,
  "stronger-explosives-5": 6,
  "energy-weapons-damage-6": 14,
  artillery: 14,
  "uranium-ammo": 14,
  spidertron: 14,
  "rocket-silo": 14,
  "combat-robotics-3": 14,
  "refined-flammables-5": 11,
  "laser-turret-speed-6": 15,
  "follower-robot-count-5": 15,
  "refined-flammables-6": 12,
  "stronger-explosives-6": 7,
  "space-science-pack": 15,
  "laser-turret-speed-7": 16,
  "worker-robots-speed-5": 16,
  "follower-robot-count-6": 16,
  "physical-projectile-damage-7": 16,
  "artillery-shell-speed-1": 16,
  "stronger-explosives-7": 16,
  "energy-weapons-damage-7": 16,
  "mining-productivity-4": 16,
  "follower-robot-count-7": 17,
  "worker-robots-speed-6": 17,
  "artillery-shell-range-1": 16,
  "refined-flammables-7": 16,
});
