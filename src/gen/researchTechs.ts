import { ResearchTech } from "../types";
export const Research: Map<string, ResearchTech> = new Map([
  [
    "steel-axe",
    {
      Id: "steel-axe",
      Name: "Steel axe",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 1,
      Prereqs: ["steel-processing"],
      Unlocks: [],
      Input: [{ Entity: "automation-science-pack", Count: 50 }],
      Effects: ["Character mining speed: +100%"],
    },
  ],
  [
    "electronics",
    {
      Id: "electronics",
      Name: "Electronics",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 1,
      Prereqs: ["automation"],
      Unlocks: [],
      Input: [{ Entity: "automation-science-pack", Count: 30 }],
      Effects: [],
    },
  ],

  [
    "heavy-armor",
    {
      Id: "heavy-armor",
      Name: "Heavy armor",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 1,
      Prereqs: ["military", "steel-processing"],
      Unlocks: ["heavy-armor"],
      Input: [{ Entity: "automation-science-pack", Count: 30 }],
      Effects: [],
    },
  ],

  [
    "weapon-shooting-speed-1",
    {
      Id: "weapon-shooting-speed-1",
      Name: "Weapon shooting speed 1",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 1,
      Prereqs: ["military"],
      Unlocks: [],
      Input: [{ Entity: "automation-science-pack", Count: 100 }],
      Effects: [
        "Bullet shooting speed: +10%",
        "Shotgun shell shooting speed: +10%",
      ],
    },
  ],

  [
    "physical-projectile-damage-1",
    {
      Id: "physical-projectile-damage-1",
      Name: "Physical projectile damage 1",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 1,
      Prereqs: ["military"],
      Unlocks: [],
      Input: [{ Entity: "automation-science-pack", Count: 100 }],
      Effects: [
        "Bullet damage: +10%",
        "Gun turret damage: +10%",
        "Shotgun shell damage: +10%",
      ],
    },
  ],

  [
    "fast-inserter",
    {
      Id: "fast-inserter",
      Name: "Fast inserter",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 1,
      Prereqs: ["electronics"],
      Unlocks: ["fast-inserter", "filter-inserter"],
      Input: [{ Entity: "automation-science-pack", Count: 30 }],
      Effects: [],
    },
  ],

  [
    "logistics-2",
    {
      Id: "logistics-2",
      Name: "Logistics 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["logistics", "logistic-science-pack"],
      Unlocks: [
        "fast-transport-belt",
        "fast-underground-belt",
        "fast-splitter",
      ],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
      ],
      Effects: [],
    },
  ],

  [
    "landfill",
    {
      Id: "landfill",
      Name: "Landfill",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["logistic-science-pack"],
      Unlocks: ["landfill"],
      Input: [
        { Entity: "automation-science-pack", Count: 50 },
        { Entity: "logistic-science-pack", Count: 50 },
      ],
      Effects: [],
    },
  ],

  [
    "engine",
    {
      Id: "engine",
      Name: "Engine",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 2,
      Prereqs: ["steel-processing", "logistic-science-pack"],
      Unlocks: ["engine-unit"],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "weapon-shooting-speed-2",
    {
      Id: "weapon-shooting-speed-2",
      Name: "Weapon shooting speed 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["weapon-shooting-speed-1"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
      ],
      Effects: [
        "Bullet shooting speed: +20%",
        "Shotgun shell shooting speed: +20%",
      ],
    },
  ],

  [
    "physical-projectile-damage-2",
    {
      Id: "physical-projectile-damage-2",
      Name: "Physical projectile damage 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["physical-projectile-damage-1"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
      ],
      Effects: [
        "Bullet damage: +10%",
        "Gun turret damage: +10%",
        "Shotgun shell damage: +10%",
      ],
    },
  ],

  [
    "automation-2",
    {
      Id: "automation-2",
      Name: "Automation 2",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 2,
      Prereqs: ["electronics", "steel-processing", "logistic-science-pack"],
      Unlocks: ["assembling-machine-2"],
      Input: [
        { Entity: "automation-science-pack", Count: 40 },
        { Entity: "logistic-science-pack", Count: 40 },
      ],
      Effects: [],
    },
  ],

  [
    "solar-energy",
    {
      Id: "solar-energy",
      Name: "Solar energy",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: [
        "optics",
        "electronics",
        "steel-processing",
        "logistic-science-pack",
      ],
      Unlocks: ["solar-panel"],
      Input: [
        { Entity: "automation-science-pack", Count: 250 },
        { Entity: "logistic-science-pack", Count: 250 },
      ],
      Effects: [],
    },
  ],

  [
    "toolbelt",
    {
      Id: "toolbelt",
      Name: "Toolbelt",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["logistic-science-pack"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
      ],
      Effects: ["Character inventory slots: +10"],
    },
  ],

  [
    "military-2",
    {
      Id: "military-2",
      Name: "Military 2",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 2,
      Prereqs: ["military", "steel-processing", "logistic-science-pack"],
      Unlocks: ["piercing-rounds-magazine", "grenade"],
      Input: [
        { Entity: "automation-science-pack", Count: 20 },
        { Entity: "logistic-science-pack", Count: 20 },
      ],
      Effects: [],
    },
  ],

  [
    "advanced-material-processing",
    {
      Id: "advanced-material-processing",
      Name: "Advanced material processing",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["steel-processing", "logistic-science-pack"],
      Unlocks: ["steel-furnace"],
      Input: [
        { Entity: "automation-science-pack", Count: 75 },
        { Entity: "logistic-science-pack", Count: 75 },
      ],
      Effects: [],
    },
  ],

  [
    "electric-energy-distribution-1",
    {
      Id: "electric-energy-distribution-1",
      Name: "Electric energy distribution 1",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["electronics", "steel-processing", "logistic-science-pack"],
      Unlocks: ["medium-electric-pole", "big-electric-pole"],
      Input: [
        { Entity: "automation-science-pack", Count: 120 },
        { Entity: "logistic-science-pack", Count: 120 },
      ],
      Effects: [],
    },
  ],

  [
    "circuit-network",
    {
      Id: "circuit-network",
      Name: "Circuit network",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 2,
      Prereqs: ["electronics", "logistic-science-pack"],
      Unlocks: [
        "red-wire",
        "green-wire",
        "arithmetic-combinator",
        "decider-combinator",
        "constant-combinator",
        "power-switch",
        "programmable-speaker",
      ],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "fluid-handling",
    {
      Id: "fluid-handling",
      Name: "Fluid handling",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 2,
      Prereqs: ["automation-2", "engine"],
      Unlocks: ["storage-tank", "pump", "empty-barrel"],
      Input: [
        { Entity: "automation-science-pack", Count: 50 },
        { Entity: "logistic-science-pack", Count: 50 },
      ],
      Effects: [],
    },
  ],

  [
    "military-science-pack",
    {
      Id: "military-science-pack",
      Name: "Military science pack",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 2,
      Prereqs: ["military-2", "stone-walls"],
      Unlocks: ["military-science-pack"],
      Input: [
        { Entity: "automation-science-pack", Count: 30 },
        { Entity: "logistic-science-pack", Count: 30 },
      ],
      Effects: [],
    },
  ],

  [
    "stronger-explosives-1",
    {
      Id: "stronger-explosives-1",
      Name: "Stronger explosives 1",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["military-2"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
      ],
      Effects: ["Grenade damage: +25%"],
    },
  ],

  [
    "research-speed-1",
    {
      Id: "research-speed-1",
      Name: "Lab research speed 1",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["automation-2"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
      ],
      Effects: ["Lab research speed: +20%"],
    },
  ],

  [
    "concrete",
    {
      Id: "concrete",
      Name: "Concrete",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["advanced-material-processing", "automation-2"],
      Unlocks: [
        "concrete",
        "hazard-concrete",
        "refined-concrete",
        "refined-hazard-concrete",
      ],
      Input: [
        { Entity: "automation-science-pack", Count: 250 },
        { Entity: "logistic-science-pack", Count: 250 },
      ],
      Effects: [],
    },
  ],

  [
    "gates",
    {
      Id: "gates",
      Name: "Gates",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["stone-walls", "military-2"],
      Unlocks: ["gate"],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "automobilism",
    {
      Id: "automobilism",
      Name: "Automobilism",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["logistics-2", "engine"],
      Unlocks: ["car"],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "railway",
    {
      Id: "railway",
      Name: "Railway",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["logistics-2", "engine"],
      Unlocks: ["rail", "locomotive", "cargo-wagon"],
      Input: [
        { Entity: "automation-science-pack", Count: 75 },
        { Entity: "logistic-science-pack", Count: 75 },
      ],
      Effects: [],
    },
  ],

  [
    "oil-processing",
    {
      Id: "oil-processing",
      Name: "Oil processing",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["fluid-handling"],
      Unlocks: [
        "pumpjack",
        "oil-refinery",
        "chemical-plant",
        "basic-oil-processing",
        "solid-fuel-from-petroleum-gas",
      ],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "automated-rail-transportation",
    {
      Id: "automated-rail-transportation",
      Name: "Automated rail transportation",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["railway"],
      Unlocks: ["train-stop"],
      Input: [
        { Entity: "automation-science-pack", Count: 75 },
        { Entity: "logistic-science-pack", Count: 75 },
      ],
      Effects: [],
    },
  ],

  [
    "fluid-wagon",
    {
      Id: "fluid-wagon",
      Name: "Fluid wagon",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["railway", "fluid-handling"],
      Unlocks: ["fluid-wagon"],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
      ],
      Effects: [],
    },
  ],

  [
    "research-speed-2",
    {
      Id: "research-speed-2",
      Name: "Lab research speed 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["research-speed-1"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
      ],
      Effects: ["Lab research speed: +30%"],
    },
  ],

  [
    "rail-signals",
    {
      Id: "rail-signals",
      Name: "Rail signals",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["automated-rail-transportation"],
      Unlocks: ["rail-signal", "rail-chain-signal"],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "sulfur-processing",
    {
      Id: "sulfur-processing",
      Name: "Sulfur processing",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["oil-processing"],
      Unlocks: ["sulfuric-acid", "sulfur"],
      Input: [
        { Entity: "automation-science-pack", Count: 150 },
        { Entity: "logistic-science-pack", Count: 150 },
      ],
      Effects: [],
    },
  ],

  [
    "flammables",
    {
      Id: "flammables",
      Name: "Flammables",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["oil-processing"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 50 },
        { Entity: "logistic-science-pack", Count: 50 },
      ],
      Effects: [],
    },
  ],

  [
    "plastics",
    {
      Id: "plastics",
      Name: "Plastics",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["oil-processing"],
      Unlocks: ["plastic-bar"],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
      ],
      Effects: [],
    },
  ],

  [
    "battery",
    {
      Id: "battery",
      Name: "Battery",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["sulfur-processing"],
      Unlocks: ["battery"],
      Input: [
        { Entity: "automation-science-pack", Count: 150 },
        { Entity: "logistic-science-pack", Count: 150 },
      ],
      Effects: [],
    },
  ],

  [
    "explosives",
    {
      Id: "explosives",
      Name: "Explosives",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 2,
      Prereqs: ["sulfur-processing"],
      Unlocks: ["explosives"],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "advanced-electronics",
    {
      Id: "advanced-electronics",
      Name: "Advanced electronics",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 2,
      Prereqs: ["plastics"],
      Unlocks: ["advanced-circuit"],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
      ],
      Effects: [],
    },
  ],

  [
    "land-mine",
    {
      Id: "land-mine",
      Name: "Land mines",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 3,
      Prereqs: ["explosives", "military-science-pack"],
      Unlocks: ["land-mine"],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
        { Entity: "military-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "cliff-explosives",
    {
      Id: "cliff-explosives",
      Name: "Cliff explosives",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 2,
      Prereqs: ["explosives", "military-2"],
      Unlocks: ["cliff-explosives"],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
      ],
      Effects: [],
    },
  ],

  [
    "weapon-shooting-speed-3",
    {
      Id: "weapon-shooting-speed-3",
      Name: "Weapon shooting speed 3",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 3,
      Prereqs: ["weapon-shooting-speed-2"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 300 },
        { Entity: "logistic-science-pack", Count: 300 },
        { Entity: "military-science-pack", Count: 300 },
      ],
      Effects: [
        "Bullet shooting speed: +20%",
        "Shotgun shell shooting speed: +20%",
        "Rocket shooting speed: +50%",
      ],
    },
  ],

  [
    "stack-inserter",
    {
      Id: "stack-inserter",
      Name: "Stack inserter",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["fast-inserter", "logistics-2", "advanced-electronics"],
      Unlocks: ["stack-inserter", "stack-filter-inserter"],
      Input: [
        { Entity: "automation-science-pack", Count: 150 },
        { Entity: "logistic-science-pack", Count: 150 },
      ],
      Effects: ["Stack inserter capacity: +1"],
    },
  ],

  [
    "stronger-explosives-2",
    {
      Id: "stronger-explosives-2",
      Name: "Stronger explosives 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 3,
      Prereqs: ["stronger-explosives-1"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
        { Entity: "military-science-pack", Count: 200 },
      ],
      Effects: ["Grenade damage: +20%", "Land mine damage: +20%"],
    },
  ],

  [
    "physical-projectile-damage-3",
    {
      Id: "physical-projectile-damage-3",
      Name: "Physical projectile damage 3",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 3,
      Prereqs: ["physical-projectile-damage-2"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 300 },
        { Entity: "logistic-science-pack", Count: 300 },
        { Entity: "military-science-pack", Count: 300 },
      ],
      Effects: [
        "Bullet damage: +20%",
        "Gun turret damage: +20%",
        "Shotgun shell damage: +20%",
      ],
    },
  ],

  [
    "rocketry",
    {
      Id: "rocketry",
      Name: "Rocketry",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 3,
      Prereqs: ["explosives", "flammables", "military-science-pack"],
      Unlocks: ["rocket-launcher", "rocket"],
      Input: [
        { Entity: "automation-science-pack", Count: 120 },
        { Entity: "logistic-science-pack", Count: 120 },
        { Entity: "military-science-pack", Count: 120 },
      ],
      Effects: [],
    },
  ],

  [
    "flamethrower",
    {
      Id: "flamethrower",
      Name: "Flamethrower",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 3,
      Prereqs: ["flammables", "military-science-pack"],
      Unlocks: ["flamethrower", "flamethrower-ammo", "flamethrower-turret"],
      Input: [
        { Entity: "automation-science-pack", Count: 50 },
        { Entity: "logistic-science-pack", Count: 50 },
        { Entity: "military-science-pack", Count: 50 },
      ],
      Effects: [],
    },
  ],

  [
    "combat-robotics",
    {
      Id: "combat-robotics",
      Name: "Combat robotics",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 3,
      Prereqs: ["military-science-pack"],
      Unlocks: ["defender-capsule"],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
        { Entity: "military-science-pack", Count: 100 },
      ],
      Effects: ["Maximum following robots: +4"],
    },
  ],

  [
    "mining-productivity-1",
    {
      Id: "mining-productivity-1",
      Name: "Mining productivity 1",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 2,
      Prereqs: ["advanced-electronics"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 250 },
        { Entity: "logistic-science-pack", Count: 250 },
      ],
      Effects: ["Mining productivity: +10%"],
    },
  ],

  [
    "modular-armor",
    {
      Id: "modular-armor",
      Name: "Modular armor",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["heavy-armor", "advanced-electronics"],
      Unlocks: ["modular-armor"],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "modules",
    {
      Id: "modules",
      Name: "Modules",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["advanced-electronics"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "chemical-science-pack",
    {
      Id: "chemical-science-pack",
      Name: "Chemical science pack",
      DurationSeconds: 10,
      ProductionPerTick: 0.1,
      Row: 2,
      Prereqs: ["advanced-electronics", "sulfur-processing"],
      Unlocks: ["chemical-science-pack"],
      Input: [
        { Entity: "automation-science-pack", Count: 75 },
        { Entity: "logistic-science-pack", Count: 75 },
      ],
      Effects: [],
    },
  ],

  [
    "electric-energy-accumulators",
    {
      Id: "electric-energy-accumulators",
      Name: "Electric energy accumulators",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["electric-energy-distribution-1", "battery"],
      Unlocks: ["accumulator"],
      Input: [
        { Entity: "automation-science-pack", Count: 150 },
        { Entity: "logistic-science-pack", Count: 150 },
      ],
      Effects: [],
    },
  ],

  [
    "effectivity-module",
    {
      Id: "effectivity-module",
      Name: "Efficiency module",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["modules"],
      Unlocks: ["effectivity-module"],
      Input: [
        { Entity: "automation-science-pack", Count: 50 },
        { Entity: "logistic-science-pack", Count: 50 },
      ],
      Effects: [],
    },
  ],

  [
    "follower-robot-count-1",
    {
      Id: "follower-robot-count-1",
      Name: "Follower robot count 1",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 3,
      Prereqs: ["combat-robotics"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
        { Entity: "military-science-pack", Count: 200 },
      ],
      Effects: ["Maximum following robots: +5"],
    },
  ],

  [
    "refined-flammables-1",
    {
      Id: "refined-flammables-1",
      Name: "Refined flammables 1",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 3,
      Prereqs: ["flamethrower"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
        { Entity: "military-science-pack", Count: 100 },
      ],
      Effects: ["Fire damage: +20%", "Flamethrower turret damage: +20%"],
    },
  ],

  [
    "productivity-module",
    {
      Id: "productivity-module",
      Name: "Productivity module",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["modules"],
      Unlocks: ["productivity-module"],
      Input: [
        { Entity: "automation-science-pack", Count: 50 },
        { Entity: "logistic-science-pack", Count: 50 },
      ],
      Effects: [],
    },
  ],

  [
    "inserter-capacity-bonus-1",
    {
      Id: "inserter-capacity-bonus-1",
      Name: "Inserter capacity bonus 1",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["stack-inserter"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
      ],
      Effects: ["Stack inserter capacity: +1"],
    },
  ],

  [
    "speed-module",
    {
      Id: "speed-module",
      Name: "Speed module",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["modules"],
      Unlocks: ["speed-module"],
      Input: [
        { Entity: "automation-science-pack", Count: 50 },
        { Entity: "logistic-science-pack", Count: 50 },
      ],
      Effects: [],
    },
  ],

  [
    "solar-panel-equipment",
    {
      Id: "solar-panel-equipment",
      Name: "Portable solar panel",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 2,
      Prereqs: ["modular-armor", "solar-energy"],
      Unlocks: ["solar-panel-equipment"],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "weapon-shooting-speed-4",
    {
      Id: "weapon-shooting-speed-4",
      Name: "Weapon shooting speed 4",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 3,
      Prereqs: ["weapon-shooting-speed-3"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 400 },
        { Entity: "logistic-science-pack", Count: 400 },
        { Entity: "military-science-pack", Count: 400 },
      ],
      Effects: [
        "Bullet shooting speed: +30%",
        "Shotgun shell shooting speed: +30%",
        "Rocket shooting speed: +70%",
      ],
    },
  ],

  [
    "physical-projectile-damage-4",
    {
      Id: "physical-projectile-damage-4",
      Name: "Physical projectile damage 4",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 3,
      Prereqs: ["physical-projectile-damage-3"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 400 },
        { Entity: "logistic-science-pack", Count: 400 },
        { Entity: "military-science-pack", Count: 400 },
      ],
      Effects: [
        "Bullet damage: +20%",
        "Gun turret damage: +20%",
        "Shotgun shell damage: +20%",
      ],
    },
  ],

  [
    "energy-shield-equipment",
    {
      Id: "energy-shield-equipment",
      Name: "Energy shield equipment",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 3,
      Prereqs: ["solar-panel-equipment", "military-science-pack"],
      Unlocks: ["energy-shield-equipment"],
      Input: [
        { Entity: "automation-science-pack", Count: 150 },
        { Entity: "logistic-science-pack", Count: 150 },
        { Entity: "military-science-pack", Count: 150 },
      ],
      Effects: [],
    },
  ],

  [
    "inserter-capacity-bonus-2",
    {
      Id: "inserter-capacity-bonus-2",
      Name: "Inserter capacity bonus 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 2,
      Prereqs: ["inserter-capacity-bonus-1"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 250 },
        { Entity: "logistic-science-pack", Count: 250 },
      ],
      Effects: [
        "Non-stack inserter capacity: +1",
        "Stack inserter capacity: +1",
      ],
    },
  ],

  [
    "night-vision-equipment",
    {
      Id: "night-vision-equipment",
      Name: "Nightvision equipment",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 2,
      Prereqs: ["solar-panel-equipment"],
      Unlocks: ["night-vision-equipment"],
      Input: [
        { Entity: "automation-science-pack", Count: 50 },
        { Entity: "logistic-science-pack", Count: 50 },
      ],
      Effects: [],
    },
  ],

  [
    "follower-robot-count-2",
    {
      Id: "follower-robot-count-2",
      Name: "Follower robot count 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 3,
      Prereqs: ["follower-robot-count-1"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 300 },
        { Entity: "logistic-science-pack", Count: 300 },
        { Entity: "military-science-pack", Count: 300 },
      ],
      Effects: ["Maximum following robots: +5"],
    },
  ],

  [
    "belt-immunity-equipment",
    {
      Id: "belt-immunity-equipment",
      Name: "Belt immunity equipment",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 2,
      Prereqs: ["solar-panel-equipment"],
      Unlocks: ["belt-immunity-equipment"],
      Input: [
        { Entity: "automation-science-pack", Count: 50 },
        { Entity: "logistic-science-pack", Count: 50 },
      ],
      Effects: [],
    },
  ],

  [
    "battery-equipment",
    {
      Id: "battery-equipment",
      Name: "Personal battery",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 2,
      Prereqs: ["battery", "solar-panel-equipment"],
      Unlocks: ["battery-equipment"],
      Input: [
        { Entity: "automation-science-pack", Count: 50 },
        { Entity: "logistic-science-pack", Count: 50 },
      ],
      Effects: [],
    },
  ],

  [
    "refined-flammables-2",
    {
      Id: "refined-flammables-2",
      Name: "Refined flammables 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 3,
      Prereqs: ["refined-flammables-1"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
        { Entity: "military-science-pack", Count: 200 },
      ],
      Effects: ["Fire damage: +20%", "Flamethrower turret damage: +20%"],
    },
  ],

  [
    "advanced-oil-processing",
    {
      Id: "advanced-oil-processing",
      Name: "Advanced oil processing",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["chemical-science-pack"],
      Unlocks: [
        "advanced-oil-processing",
        "heavy-oil-cracking",
        "light-oil-cracking",
        "solid-fuel-from-heavy-oil",
        "solid-fuel-from-light-oil",
      ],
      Input: [
        { Entity: "automation-science-pack", Count: 75 },
        { Entity: "logistic-science-pack", Count: 75 },
        { Entity: "chemical-science-pack", Count: 75 },
      ],
      Effects: [],
    },
  ],

  [
    "refined-flammables-3",
    {
      Id: "refined-flammables-3",
      Name: "Refined flammables 3",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 4,
      Prereqs: ["refined-flammables-2"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 300 },
        { Entity: "logistic-science-pack", Count: 300 },
        { Entity: "military-science-pack", Count: 300 },
        { Entity: "chemical-science-pack", Count: 300 },
      ],
      Effects: ["Fire damage: +20%", "Flamethrower turret damage: +20%"],
    },
  ],

  [
    "advanced-material-processing-2",
    {
      Id: "advanced-material-processing-2",
      Name: "Advanced material processing 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["advanced-material-processing", "chemical-science-pack"],
      Unlocks: ["electric-furnace"],
      Input: [
        { Entity: "automation-science-pack", Count: 250 },
        { Entity: "logistic-science-pack", Count: 250 },
        { Entity: "chemical-science-pack", Count: 250 },
      ],
      Effects: [],
    },
  ],

  [
    "advanced-electronics-2",
    {
      Id: "advanced-electronics-2",
      Name: "Advanced electronics 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["chemical-science-pack"],
      Unlocks: ["processing-unit"],
      Input: [
        { Entity: "automation-science-pack", Count: 300 },
        { Entity: "logistic-science-pack", Count: 300 },
        { Entity: "chemical-science-pack", Count: 300 },
      ],
      Effects: [],
    },
  ],

  [
    "military-3",
    {
      Id: "military-3",
      Name: "Military 3",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["chemical-science-pack", "military-science-pack"],
      Unlocks: ["poison-capsule", "slowdown-capsule", "combat-shotgun"],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
        { Entity: "military-science-pack", Count: 100 },
        { Entity: "chemical-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "research-speed-3",
    {
      Id: "research-speed-3",
      Name: "Lab research speed 3",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["research-speed-2"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 250 },
        { Entity: "logistic-science-pack", Count: 250 },
        { Entity: "chemical-science-pack", Count: 250 },
      ],
      Effects: ["Lab research speed: +40%"],
    },
  ],

  [
    "physical-projectile-damage-5",
    {
      Id: "physical-projectile-damage-5",
      Name: "Physical projectile damage 5",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 4,
      Prereqs: ["physical-projectile-damage-4"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 500 },
        { Entity: "logistic-science-pack", Count: 500 },
        { Entity: "military-science-pack", Count: 500 },
        { Entity: "chemical-science-pack", Count: 500 },
      ],
      Effects: [
        "Bullet damage: +20%",
        "Gun turret damage: +20%",
        "Shotgun shell damage: +20%",
        "Cannon shell damage: +90%",
      ],
    },
  ],

  [
    "mining-productivity-2",
    {
      Id: "mining-productivity-2",
      Name: "Mining productivity 2",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 4,
      Prereqs: ["mining-productivity-1"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 500 },
        { Entity: "logistic-science-pack", Count: 500 },
        { Entity: "chemical-science-pack", Count: 500 },
      ],
      Effects: ["Mining productivity: +10%"],
    },
  ],

  [
    "uranium-processing",
    {
      Id: "uranium-processing",
      Name: "Uranium processing",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["chemical-science-pack", "concrete"],
      Unlocks: ["centrifuge", "uranium-processing", "uranium-fuel-cell"],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
        { Entity: "chemical-science-pack", Count: 200 },
      ],
      Effects: [],
    },
  ],

  [
    "stronger-explosives-3",
    {
      Id: "stronger-explosives-3",
      Name: "Stronger explosives 3",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 4,
      Prereqs: ["stronger-explosives-2"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 300 },
        { Entity: "logistic-science-pack", Count: 300 },
        { Entity: "military-science-pack", Count: 300 },
        { Entity: "chemical-science-pack", Count: 300 },
      ],
      Effects: [
        "Rocket damage: +30%",
        "Grenade damage: +20%",
        "Land mine damage: +20%",
      ],
    },
  ],

  [
    "electric-energy-distribution-2",
    {
      Id: "electric-energy-distribution-2",
      Name: "Electric energy distribution 2",
      DurationSeconds: 45,
      ProductionPerTick: 0.022222223,
      Row: 4,
      Prereqs: ["electric-energy-distribution-1", "chemical-science-pack"],
      Unlocks: ["substation"],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
        { Entity: "chemical-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "laser",
    {
      Id: "laser",
      Name: "Laser",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["optics", "battery", "chemical-science-pack"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
        { Entity: "chemical-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "follower-robot-count-3",
    {
      Id: "follower-robot-count-3",
      Name: "Follower robot count 3",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["follower-robot-count-2"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 400 },
        { Entity: "logistic-science-pack", Count: 400 },
        { Entity: "military-science-pack", Count: 400 },
        { Entity: "chemical-science-pack", Count: 400 },
      ],
      Effects: ["Maximum following robots: +5"],
    },
  ],

  [
    "weapon-shooting-speed-5",
    {
      Id: "weapon-shooting-speed-5",
      Name: "Weapon shooting speed 5",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 4,
      Prereqs: ["weapon-shooting-speed-4"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 500 },
        { Entity: "logistic-science-pack", Count: 500 },
        { Entity: "military-science-pack", Count: 500 },
        { Entity: "chemical-science-pack", Count: 500 },
      ],
      Effects: [
        "Bullet shooting speed: +30%",
        "Shotgun shell shooting speed: +40%",
        "Cannon shell shooting speed: +80%",
        "Rocket shooting speed: +90%",
      ],
    },
  ],

  [
    "low-density-structure",
    {
      Id: "low-density-structure",
      Name: "Low density structure",
      DurationSeconds: 45,
      ProductionPerTick: 0.022222223,
      Row: 4,
      Prereqs: ["advanced-material-processing", "chemical-science-pack"],
      Unlocks: ["low-density-structure"],
      Input: [
        { Entity: "automation-science-pack", Count: 300 },
        { Entity: "logistic-science-pack", Count: 300 },
        { Entity: "chemical-science-pack", Count: 300 },
      ],
      Effects: [],
    },
  ],

  [
    "inserter-capacity-bonus-3",
    {
      Id: "inserter-capacity-bonus-3",
      Name: "Inserter capacity bonus 3",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["inserter-capacity-bonus-2"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 250 },
        { Entity: "logistic-science-pack", Count: 250 },
        { Entity: "chemical-science-pack", Count: 250 },
      ],
      Effects: ["Stack inserter capacity: +1"],
    },
  ],

  [
    "braking-force-1",
    {
      Id: "braking-force-1",
      Name: "Braking force 1",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["railway", "chemical-science-pack"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
        { Entity: "chemical-science-pack", Count: 100 },
      ],
      Effects: ["Train braking force: +10%"],
    },
  ],

  [
    "lubricant",
    {
      Id: "lubricant",
      Name: "Lubricant",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["advanced-oil-processing"],
      Unlocks: ["lubricant"],
      Input: [
        { Entity: "automation-science-pack", Count: 50 },
        { Entity: "logistic-science-pack", Count: 50 },
        { Entity: "chemical-science-pack", Count: 50 },
      ],
      Effects: [],
    },
  ],

  [
    "production-science-pack",
    {
      Id: "production-science-pack",
      Name: "Production science pack",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: [
        "productivity-module",
        "advanced-material-processing-2",
        "railway",
      ],
      Unlocks: ["production-science-pack"],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
        { Entity: "chemical-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "braking-force-2",
    {
      Id: "braking-force-2",
      Name: "Braking force 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["braking-force-1"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
        { Entity: "chemical-science-pack", Count: 200 },
      ],
      Effects: ["Train braking force: +15%"],
    },
  ],

  [
    "follower-robot-count-4",
    {
      Id: "follower-robot-count-4",
      Name: "Follower robot count 4",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["follower-robot-count-3"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 600 },
        { Entity: "logistic-science-pack", Count: 600 },
        { Entity: "military-science-pack", Count: 600 },
        { Entity: "chemical-science-pack", Count: 600 },
      ],
      Effects: ["Maximum following robots: +10"],
    },
  ],

  [
    "laser-turrets",
    {
      Id: "laser-turrets",
      Name: "Laser turrets",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["turrets", "laser", "military-science-pack"],
      Unlocks: ["laser-turret"],
      Input: [
        { Entity: "automation-science-pack", Count: 150 },
        { Entity: "logistic-science-pack", Count: 150 },
        { Entity: "military-science-pack", Count: 150 },
        { Entity: "chemical-science-pack", Count: 150 },
      ],
      Effects: [],
    },
  ],

  [
    "energy-weapons-damage-1",
    {
      Id: "energy-weapons-damage-1",
      Name: "Energy weapons damage 1",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["laser", "military-science-pack"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
        { Entity: "military-science-pack", Count: 100 },
        { Entity: "chemical-science-pack", Count: 100 },
      ],
      Effects: ["Laser turret damage: +20%"],
    },
  ],

  [
    "rocket-fuel",
    {
      Id: "rocket-fuel",
      Name: "Rocket fuel",
      DurationSeconds: 45,
      ProductionPerTick: 0.022222223,
      Row: 4,
      Prereqs: ["flammables", "advanced-oil-processing"],
      Unlocks: ["rocket-fuel"],
      Input: [
        { Entity: "automation-science-pack", Count: 300 },
        { Entity: "logistic-science-pack", Count: 300 },
        { Entity: "chemical-science-pack", Count: 300 },
      ],
      Effects: [],
    },
  ],

  [
    "explosive-rocketry",
    {
      Id: "explosive-rocketry",
      Name: "Explosive rocketry",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["rocketry", "military-3"],
      Unlocks: ["explosive-rocket"],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
        { Entity: "military-science-pack", Count: 100 },
        { Entity: "chemical-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "nuclear-power",
    {
      Id: "nuclear-power",
      Name: "Nuclear power",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["uranium-processing"],
      Unlocks: [
        "nuclear-reactor",
        "heat-exchanger",
        "heat-pipe",
        "steam-turbine",
        "used-up-uranium-fuel-cell",
      ],
      Input: [
        { Entity: "automation-science-pack", Count: 800 },
        { Entity: "logistic-science-pack", Count: 800 },
        { Entity: "chemical-science-pack", Count: 800 },
      ],
      Effects: [],
    },
  ],

  [
    "effectivity-module-2",
    {
      Id: "effectivity-module-2",
      Name: "Efficiency module 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["effectivity-module", "advanced-electronics-2"],
      Unlocks: ["effectivity-module-2"],
      Input: [
        { Entity: "automation-science-pack", Count: 75 },
        { Entity: "logistic-science-pack", Count: 75 },
        { Entity: "chemical-science-pack", Count: 75 },
      ],
      Effects: [],
    },
  ],

  [
    "speed-module-2",
    {
      Id: "speed-module-2",
      Name: "Speed module 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["speed-module", "advanced-electronics-2"],
      Unlocks: ["speed-module-2"],
      Input: [
        { Entity: "automation-science-pack", Count: 75 },
        { Entity: "logistic-science-pack", Count: 75 },
        { Entity: "chemical-science-pack", Count: 75 },
      ],
      Effects: [],
    },
  ],

  [
    "combat-robotics-2",
    {
      Id: "combat-robotics-2",
      Name: "Combat robotics 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["combat-robotics", "military-3", "laser"],
      Unlocks: ["distractor-capsule"],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
        { Entity: "military-science-pack", Count: 200 },
        { Entity: "chemical-science-pack", Count: 200 },
      ],
      Effects: [],
    },
  ],

  [
    "productivity-module-2",
    {
      Id: "productivity-module-2",
      Name: "Productivity module 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["productivity-module", "advanced-electronics-2"],
      Unlocks: ["productivity-module-2"],
      Input: [
        { Entity: "automation-science-pack", Count: 75 },
        { Entity: "logistic-science-pack", Count: 75 },
        { Entity: "chemical-science-pack", Count: 75 },
      ],
      Effects: [],
    },
  ],

  [
    "tanks",
    {
      Id: "tanks",
      Name: "Tanks",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["automobilism", "military-3", "explosives"],
      Unlocks: ["tank", "cannon-shell", "explosive-cannon-shell"],
      Input: [
        { Entity: "automation-science-pack", Count: 250 },
        { Entity: "logistic-science-pack", Count: 250 },
        { Entity: "military-science-pack", Count: 250 },
        { Entity: "chemical-science-pack", Count: 250 },
      ],
      Effects: [],
    },
  ],

  [
    "research-speed-4",
    {
      Id: "research-speed-4",
      Name: "Lab research speed 4",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["research-speed-3"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 500 },
        { Entity: "logistic-science-pack", Count: 500 },
        { Entity: "chemical-science-pack", Count: 500 },
      ],
      Effects: ["Lab research speed: +50%"],
    },
  ],

  [
    "electric-engine",
    {
      Id: "electric-engine",
      Name: "Electric engine",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["lubricant"],
      Unlocks: ["electric-engine-unit"],
      Input: [
        { Entity: "automation-science-pack", Count: 50 },
        { Entity: "logistic-science-pack", Count: 50 },
        { Entity: "chemical-science-pack", Count: 50 },
      ],
      Effects: [],
    },
  ],

  [
    "energy-weapons-damage-2",
    {
      Id: "energy-weapons-damage-2",
      Name: "Energy weapons damage 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["energy-weapons-damage-1"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
        { Entity: "military-science-pack", Count: 200 },
        { Entity: "chemical-science-pack", Count: 200 },
      ],
      Effects: ["Laser turret damage: +20%"],
    },
  ],

  [
    "laser-turret-speed-1",
    {
      Id: "laser-turret-speed-1",
      Name: "Laser turret shooting speed 1",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["laser-turrets"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 50 },
        { Entity: "logistic-science-pack", Count: 50 },
        { Entity: "military-science-pack", Count: 50 },
        { Entity: "chemical-science-pack", Count: 50 },
      ],
      Effects: ["Laser turret shooting speed: +10%"],
    },
  ],

  [
    "robotics",
    {
      Id: "robotics",
      Name: "Robotics",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["electric-engine", "battery"],
      Unlocks: ["flying-robot-frame"],
      Input: [
        { Entity: "automation-science-pack", Count: 75 },
        { Entity: "logistic-science-pack", Count: 75 },
        { Entity: "chemical-science-pack", Count: 75 },
      ],
      Effects: [],
    },
  ],

  [
    "power-armor",
    {
      Id: "power-armor",
      Name: "Power armor",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["modular-armor", "electric-engine", "advanced-electronics-2"],
      Unlocks: ["power-armor"],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
        { Entity: "chemical-science-pack", Count: 200 },
      ],
      Effects: [],
    },
  ],

  [
    "laser-turret-speed-2",
    {
      Id: "laser-turret-speed-2",
      Name: "Laser turret shooting speed 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["laser-turret-speed-1"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
        { Entity: "military-science-pack", Count: 100 },
        { Entity: "chemical-science-pack", Count: 100 },
      ],
      Effects: ["Laser turret shooting speed: +20%"],
    },
  ],

  [
    "energy-weapons-damage-3",
    {
      Id: "energy-weapons-damage-3",
      Name: "Energy weapons damage 3",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 4,
      Prereqs: ["energy-weapons-damage-2"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 300 },
        { Entity: "logistic-science-pack", Count: 300 },
        { Entity: "military-science-pack", Count: 300 },
        { Entity: "chemical-science-pack", Count: 300 },
      ],
      Effects: ["Laser turret damage: +30%"],
    },
  ],

  [
    "exoskeleton-equipment",
    {
      Id: "exoskeleton-equipment",
      Name: "Exoskeleton equipment",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: [
        "advanced-electronics-2",
        "electric-engine",
        "solar-panel-equipment",
      ],
      Unlocks: ["exoskeleton-equipment"],
      Input: [
        { Entity: "automation-science-pack", Count: 50 },
        { Entity: "logistic-science-pack", Count: 50 },
        { Entity: "chemical-science-pack", Count: 50 },
      ],
      Effects: [],
    },
  ],

  [
    "personal-laser-defense-equipment",
    {
      Id: "personal-laser-defense-equipment",
      Name: "Personal laser defense",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: [
        "laser-turrets",
        "military-3",
        "low-density-structure",
        "power-armor",
        "solar-panel-equipment",
      ],
      Unlocks: ["personal-laser-defense-equipment"],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
        { Entity: "military-science-pack", Count: 100 },
        { Entity: "chemical-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "utility-science-pack",
    {
      Id: "utility-science-pack",
      Name: "Utility science pack",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["robotics", "advanced-electronics-2", "low-density-structure"],
      Unlocks: ["utility-science-pack"],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
        { Entity: "chemical-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "effect-transmission",
    {
      Id: "effect-transmission",
      Name: "Effect transmission",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 5,
      Prereqs: ["advanced-electronics-2", "production-science-pack"],
      Unlocks: ["beacon"],
      Input: [
        { Entity: "automation-science-pack", Count: 75 },
        { Entity: "logistic-science-pack", Count: 75 },
        { Entity: "chemical-science-pack", Count: 75 },
        { Entity: "production-science-pack", Count: 75 },
      ],
      Effects: [],
    },
  ],

  [
    "speed-module-3",
    {
      Id: "speed-module-3",
      Name: "Speed module 3",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 5,
      Prereqs: ["speed-module-2", "production-science-pack"],
      Unlocks: ["speed-module-3"],
      Input: [
        { Entity: "automation-science-pack", Count: 300 },
        { Entity: "logistic-science-pack", Count: 300 },
        { Entity: "chemical-science-pack", Count: 300 },
        { Entity: "production-science-pack", Count: 300 },
      ],
      Effects: [],
    },
  ],

  [
    "kovarex-enrichment-process",
    {
      Id: "kovarex-enrichment-process",
      Name: "Kovarex enrichment process",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 5,
      Prereqs: ["production-science-pack", "uranium-processing", "rocket-fuel"],
      Unlocks: ["kovarex-enrichment-process", "nuclear-fuel"],
      Input: [
        { Entity: "automation-science-pack", Count: 1500 },
        { Entity: "logistic-science-pack", Count: 1500 },
        { Entity: "chemical-science-pack", Count: 1500 },
        { Entity: "production-science-pack", Count: 1500 },
      ],
      Effects: [],
    },
  ],

  [
    "coal-liquefaction",
    {
      Id: "coal-liquefaction",
      Name: "Coal liquefaction",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 5,
      Prereqs: ["advanced-oil-processing", "production-science-pack"],
      Unlocks: ["coal-liquefaction"],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
        { Entity: "chemical-science-pack", Count: 200 },
        { Entity: "production-science-pack", Count: 200 },
      ],
      Effects: [],
    },
  ],

  [
    "inserter-capacity-bonus-4",
    {
      Id: "inserter-capacity-bonus-4",
      Name: "Inserter capacity bonus 4",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 5,
      Prereqs: ["inserter-capacity-bonus-3"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 250 },
        { Entity: "logistic-science-pack", Count: 250 },
        { Entity: "chemical-science-pack", Count: 250 },
        { Entity: "production-science-pack", Count: 250 },
      ],
      Effects: ["Stack inserter capacity: +1"],
    },
  ],

  [
    "nuclear-fuel-reprocessing",
    {
      Id: "nuclear-fuel-reprocessing",
      Name: "Nuclear fuel reprocessing",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 5,
      Prereqs: ["nuclear-power", "production-science-pack"],
      Unlocks: ["nuclear-fuel-reprocessing"],
      Input: [
        { Entity: "automation-science-pack", Count: 50 },
        { Entity: "logistic-science-pack", Count: 50 },
        { Entity: "chemical-science-pack", Count: 50 },
        { Entity: "production-science-pack", Count: 50 },
      ],
      Effects: [],
    },
  ],

  [
    "effectivity-module-3",
    {
      Id: "effectivity-module-3",
      Name: "Efficiency module 3",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 5,
      Prereqs: ["effectivity-module-2", "production-science-pack"],
      Unlocks: ["effectivity-module-3"],
      Input: [
        { Entity: "automation-science-pack", Count: 300 },
        { Entity: "logistic-science-pack", Count: 300 },
        { Entity: "chemical-science-pack", Count: 300 },
        { Entity: "production-science-pack", Count: 300 },
      ],
      Effects: [],
    },
  ],

  [
    "research-speed-5",
    {
      Id: "research-speed-5",
      Name: "Lab research speed 5",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 5,
      Prereqs: ["research-speed-4"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 500 },
        { Entity: "logistic-science-pack", Count: 500 },
        { Entity: "chemical-science-pack", Count: 500 },
        { Entity: "production-science-pack", Count: 500 },
      ],
      Effects: ["Lab research speed: +50%"],
    },
  ],

  [
    "energy-shield-mk2-equipment",
    {
      Id: "energy-shield-mk2-equipment",
      Name: "Energy shield MK2 equipment",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: [
        "energy-shield-equipment",
        "military-3",
        "low-density-structure",
        "power-armor",
      ],
      Unlocks: ["energy-shield-mk2-equipment"],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
        { Entity: "military-science-pack", Count: 200 },
        { Entity: "chemical-science-pack", Count: 200 },
      ],
      Effects: [],
    },
  ],

  [
    "automation-3",
    {
      Id: "automation-3",
      Name: "Automation 3",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 5,
      Prereqs: ["speed-module", "production-science-pack"],
      Unlocks: ["assembling-machine-3"],
      Input: [
        { Entity: "automation-science-pack", Count: 150 },
        { Entity: "logistic-science-pack", Count: 150 },
        { Entity: "chemical-science-pack", Count: 150 },
        { Entity: "production-science-pack", Count: 150 },
      ],
      Effects: [],
    },
  ],

  [
    "discharge-defense-equipment",
    {
      Id: "discharge-defense-equipment",
      Name: "Discharge defense",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: [
        "laser-turrets",
        "military-3",
        "power-armor",
        "solar-panel-equipment",
      ],
      Unlocks: ["discharge-defense-equipment", "discharge-defense-remote"],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
        { Entity: "military-science-pack", Count: 100 },
        { Entity: "chemical-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "worker-robots-storage-1",
    {
      Id: "worker-robots-storage-1",
      Name: "Worker robot cargo size 1",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["robotics"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
        { Entity: "chemical-science-pack", Count: 200 },
      ],
      Effects: ["Worker robot capacity: +1"],
    },
  ],

  [
    "logistic-robotics",
    {
      Id: "logistic-robotics",
      Name: "Logistic robotics",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["robotics"],
      Unlocks: [
        "roboport",
        "logistic-chest-passive-provider",
        "logistic-chest-storage",
        "logistic-robot",
      ],
      Input: [
        { Entity: "automation-science-pack", Count: 250 },
        { Entity: "logistic-science-pack", Count: 250 },
        { Entity: "chemical-science-pack", Count: 250 },
      ],
      Effects: [
        "Character logistic requests",
        "Character auto trash filters",
        "Character logistic trash slots: +30",
      ],
    },
  ],

  [
    "construction-robotics",
    {
      Id: "construction-robotics",
      Name: "Construction robotics",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["robotics"],
      Unlocks: [
        "roboport",
        "logistic-chest-passive-provider",
        "logistic-chest-storage",
        "construction-robot",
      ],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
        { Entity: "chemical-science-pack", Count: 100 },
      ],
      Effects: ["Ghost rebuild timeout: +168 hours"],
    },
  ],

  [
    "battery-mk2-equipment",
    {
      Id: "battery-mk2-equipment",
      Name: "Personal battery MK2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["battery-equipment", "low-density-structure", "power-armor"],
      Unlocks: ["battery-mk2-equipment"],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
        { Entity: "chemical-science-pack", Count: 100 },
      ],
      Effects: [],
    },
  ],

  [
    "worker-robots-speed-1",
    {
      Id: "worker-robots-speed-1",
      Name: "Worker robot speed 1",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["robotics"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 50 },
        { Entity: "logistic-science-pack", Count: 50 },
        { Entity: "chemical-science-pack", Count: 50 },
      ],
      Effects: ["Worker robot speed: +35%"],
    },
  ],

  [
    "laser-turret-speed-3",
    {
      Id: "laser-turret-speed-3",
      Name: "Laser turret shooting speed 3",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 4,
      Prereqs: ["laser-turret-speed-2"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
        { Entity: "military-science-pack", Count: 200 },
        { Entity: "chemical-science-pack", Count: 200 },
      ],
      Effects: ["Laser turret shooting speed: +30%"],
    },
  ],

  [
    "productivity-module-3",
    {
      Id: "productivity-module-3",
      Name: "Productivity module 3",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 5,
      Prereqs: ["productivity-module-2", "production-science-pack"],
      Unlocks: ["productivity-module-3"],
      Input: [
        { Entity: "automation-science-pack", Count: 300 },
        { Entity: "logistic-science-pack", Count: 300 },
        { Entity: "chemical-science-pack", Count: 300 },
        { Entity: "production-science-pack", Count: 300 },
      ],
      Effects: [],
    },
  ],

  [
    "logistics-3",
    {
      Id: "logistics-3",
      Name: "Logistics 3",
      DurationSeconds: 15,
      ProductionPerTick: 0.06666667,
      Row: 5,
      Prereqs: ["production-science-pack", "lubricant"],
      Unlocks: [
        "express-transport-belt",
        "express-underground-belt",
        "express-splitter",
      ],
      Input: [
        { Entity: "automation-science-pack", Count: 300 },
        { Entity: "logistic-science-pack", Count: 300 },
        { Entity: "chemical-science-pack", Count: 300 },
        { Entity: "production-science-pack", Count: 300 },
      ],
      Effects: [],
    },
  ],

  [
    "braking-force-3",
    {
      Id: "braking-force-3",
      Name: "Braking force 3",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 5,
      Prereqs: ["braking-force-2"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 250 },
        { Entity: "logistic-science-pack", Count: 250 },
        { Entity: "chemical-science-pack", Count: 250 },
        { Entity: "production-science-pack", Count: 250 },
      ],
      Effects: ["Train braking force: +15%"],
    },
  ],

  [
    "energy-weapons-damage-4",
    {
      Id: "energy-weapons-damage-4",
      Name: "Energy weapons damage 4",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 4,
      Prereqs: ["energy-weapons-damage-3"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 400 },
        { Entity: "logistic-science-pack", Count: 400 },
        { Entity: "military-science-pack", Count: 400 },
        { Entity: "chemical-science-pack", Count: 400 },
      ],
      Effects: ["Laser turret damage: +40%", "Combat robot laser damage: +20%"],
    },
  ],

  [
    "personal-roboport-equipment",
    {
      Id: "personal-roboport-equipment",
      Name: "Personal roboport",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["construction-robotics", "solar-panel-equipment"],
      Unlocks: ["personal-roboport-equipment"],
      Input: [
        { Entity: "automation-science-pack", Count: 50 },
        { Entity: "logistic-science-pack", Count: 50 },
        { Entity: "chemical-science-pack", Count: 50 },
      ],
      Effects: [],
    },
  ],

  [
    "braking-force-4",
    {
      Id: "braking-force-4",
      Name: "Braking force 4",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 5,
      Prereqs: ["braking-force-3"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 350 },
        { Entity: "logistic-science-pack", Count: 350 },
        { Entity: "chemical-science-pack", Count: 350 },
        { Entity: "production-science-pack", Count: 350 },
      ],
      Effects: ["Train braking force: +15%"],
    },
  ],

  [
    "worker-robots-speed-2",
    {
      Id: "worker-robots-speed-2",
      Name: "Worker robot speed 2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 4,
      Prereqs: ["worker-robots-speed-1"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 100 },
        { Entity: "logistic-science-pack", Count: 100 },
        { Entity: "chemical-science-pack", Count: 100 },
      ],
      Effects: ["Worker robot speed: +40%"],
    },
  ],

  [
    "inserter-capacity-bonus-5",
    {
      Id: "inserter-capacity-bonus-5",
      Name: "Inserter capacity bonus 5",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 5,
      Prereqs: ["inserter-capacity-bonus-4"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 300 },
        { Entity: "logistic-science-pack", Count: 300 },
        { Entity: "chemical-science-pack", Count: 300 },
        { Entity: "production-science-pack", Count: 300 },
      ],
      Effects: ["Stack inserter capacity: +2"],
    },
  ],

  [
    "worker-robots-storage-2",
    {
      Id: "worker-robots-storage-2",
      Name: "Worker robot cargo size 2",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 5,
      Prereqs: ["worker-robots-storage-1"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 300 },
        { Entity: "logistic-science-pack", Count: 300 },
        { Entity: "chemical-science-pack", Count: 300 },
        { Entity: "production-science-pack", Count: 300 },
      ],
      Effects: ["Worker robot capacity: +1"],
    },
  ],

  [
    "laser-turret-speed-4",
    {
      Id: "laser-turret-speed-4",
      Name: "Laser turret shooting speed 4",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 4,
      Prereqs: ["laser-turret-speed-3"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
        { Entity: "military-science-pack", Count: 200 },
        { Entity: "chemical-science-pack", Count: 200 },
      ],
      Effects: ["Laser turret shooting speed: +30%"],
    },
  ],

  [
    "braking-force-5",
    {
      Id: "braking-force-5",
      Name: "Braking force 5",
      DurationSeconds: 35,
      ProductionPerTick: 0.028571429,
      Row: 5,
      Prereqs: ["braking-force-4"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 450 },
        { Entity: "logistic-science-pack", Count: 450 },
        { Entity: "chemical-science-pack", Count: 450 },
        { Entity: "production-science-pack", Count: 450 },
      ],
      Effects: ["Train braking force: +15%"],
    },
  ],

  [
    "inserter-capacity-bonus-6",
    {
      Id: "inserter-capacity-bonus-6",
      Name: "Inserter capacity bonus 6",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 5,
      Prereqs: ["inserter-capacity-bonus-5"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 400 },
        { Entity: "logistic-science-pack", Count: 400 },
        { Entity: "chemical-science-pack", Count: 400 },
        { Entity: "production-science-pack", Count: 400 },
      ],
      Effects: ["Stack inserter capacity: +2"],
    },
  ],

  [
    "fusion-reactor-equipment",
    {
      Id: "fusion-reactor-equipment",
      Name: "Portable fusion reactor",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 6,
      Prereqs: ["utility-science-pack", "power-armor", "military-science-pack"],
      Unlocks: ["fusion-reactor-equipment"],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
        { Entity: "military-science-pack", Count: 200 },
        { Entity: "chemical-science-pack", Count: 200 },
        { Entity: "utility-science-pack", Count: 200 },
      ],
      Effects: [],
    },
  ],

  [
    "energy-weapons-damage-5",
    {
      Id: "energy-weapons-damage-5",
      Name: "Energy weapons damage 5",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["energy-weapons-damage-4"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 500 },
        { Entity: "logistic-science-pack", Count: 500 },
        { Entity: "military-science-pack", Count: 500 },
        { Entity: "chemical-science-pack", Count: 500 },
        { Entity: "utility-science-pack", Count: 500 },
      ],
      Effects: [
        "Laser turret damage: +50%",
        "Combat robot laser damage: +40%",
        "Combat robot beam damage: +40%",
      ],
    },
  ],

  [
    "weapon-shooting-speed-6",
    {
      Id: "weapon-shooting-speed-6",
      Name: "Weapon shooting speed 6",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["weapon-shooting-speed-5"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 600 },
        { Entity: "logistic-science-pack", Count: 600 },
        { Entity: "military-science-pack", Count: 600 },
        { Entity: "chemical-science-pack", Count: 600 },
        { Entity: "utility-science-pack", Count: 600 },
      ],
      Effects: [
        "Bullet shooting speed: +40%",
        "Shotgun shell shooting speed: +40%",
        "Cannon shell shooting speed: +150%",
        "Rocket shooting speed: +130%",
      ],
    },
  ],

  [
    "laser-turret-speed-5",
    {
      Id: "laser-turret-speed-5",
      Name: "Laser turret shooting speed 5",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["laser-turret-speed-4"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 200 },
        { Entity: "logistic-science-pack", Count: 200 },
        { Entity: "military-science-pack", Count: 200 },
        { Entity: "chemical-science-pack", Count: 200 },
        { Entity: "utility-science-pack", Count: 200 },
      ],
      Effects: ["Laser turret shooting speed: +40%"],
    },
  ],

  [
    "worker-robots-speed-3",
    {
      Id: "worker-robots-speed-3",
      Name: "Worker robot speed 3",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["worker-robots-speed-2"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 150 },
        { Entity: "logistic-science-pack", Count: 150 },
        { Entity: "chemical-science-pack", Count: 150 },
        { Entity: "utility-science-pack", Count: 150 },
      ],
      Effects: ["Worker robot speed: +45%"],
    },
  ],

  [
    "logistic-system",
    {
      Id: "logistic-system",
      Name: "Logistic system",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 6,
      Prereqs: ["utility-science-pack", "logistic-robotics"],
      Unlocks: [
        "logistic-chest-active-provider",
        "logistic-chest-requester",
        "logistic-chest-buffer",
      ],
      Input: [
        { Entity: "automation-science-pack", Count: 500 },
        { Entity: "logistic-science-pack", Count: 500 },
        { Entity: "chemical-science-pack", Count: 500 },
        { Entity: "utility-science-pack", Count: 500 },
      ],
      Effects: [],
    },
  ],

  [
    "inserter-capacity-bonus-7",
    {
      Id: "inserter-capacity-bonus-7",
      Name: "Inserter capacity bonus 7",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 6,
      Prereqs: ["inserter-capacity-bonus-6"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 600 },
        { Entity: "logistic-science-pack", Count: 600 },
        { Entity: "chemical-science-pack", Count: 600 },
        { Entity: "production-science-pack", Count: 600 },
        { Entity: "utility-science-pack", Count: 600 },
      ],
      Effects: [
        "Non-stack inserter capacity: +1",
        "Stack inserter capacity: +2",
      ],
    },
  ],

  [
    "rocket-control-unit",
    {
      Id: "rocket-control-unit",
      Name: "Rocket control unit",
      DurationSeconds: 45,
      ProductionPerTick: 0.022222223,
      Row: 6,
      Prereqs: ["utility-science-pack", "speed-module"],
      Unlocks: ["rocket-control-unit"],
      Input: [
        { Entity: "automation-science-pack", Count: 300 },
        { Entity: "logistic-science-pack", Count: 300 },
        { Entity: "chemical-science-pack", Count: 300 },
        { Entity: "utility-science-pack", Count: 300 },
      ],
      Effects: [],
    },
  ],

  [
    "refined-flammables-4",
    {
      Id: "refined-flammables-4",
      Name: "Refined flammables 4",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["refined-flammables-3"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 400 },
        { Entity: "logistic-science-pack", Count: 400 },
        { Entity: "military-science-pack", Count: 400 },
        { Entity: "chemical-science-pack", Count: 400 },
        { Entity: "utility-science-pack", Count: 400 },
      ],
      Effects: ["Fire damage: +30%", "Flamethrower turret damage: +30%"],
    },
  ],

  [
    "braking-force-6",
    {
      Id: "braking-force-6",
      Name: "Braking force 6",
      DurationSeconds: 45,
      ProductionPerTick: 0.022222223,
      Row: 6,
      Prereqs: ["braking-force-5"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 550 },
        { Entity: "logistic-science-pack", Count: 550 },
        { Entity: "chemical-science-pack", Count: 550 },
        { Entity: "production-science-pack", Count: 550 },
        { Entity: "utility-science-pack", Count: 550 },
      ],
      Effects: ["Train braking force: +15%"],
    },
  ],

  [
    "stronger-explosives-4",
    {
      Id: "stronger-explosives-4",
      Name: "Stronger explosives 4",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["stronger-explosives-3"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 400 },
        { Entity: "logistic-science-pack", Count: 400 },
        { Entity: "military-science-pack", Count: 400 },
        { Entity: "chemical-science-pack", Count: 400 },
        { Entity: "utility-science-pack", Count: 400 },
      ],
      Effects: [
        "Rocket damage: +40%",
        "Grenade damage: +20%",
        "Land mine damage: +20%",
      ],
    },
  ],

  [
    "personal-roboport-mk2-equipment",
    {
      Id: "personal-roboport-mk2-equipment",
      Name: "Personal roboport MK2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 6,
      Prereqs: ["personal-roboport-equipment", "utility-science-pack"],
      Unlocks: ["personal-roboport-mk2-equipment"],
      Input: [
        { Entity: "automation-science-pack", Count: 250 },
        { Entity: "logistic-science-pack", Count: 250 },
        { Entity: "chemical-science-pack", Count: 250 },
        { Entity: "utility-science-pack", Count: 250 },
      ],
      Effects: [],
    },
  ],

  [
    "mining-productivity-3",
    {
      Id: "mining-productivity-3",
      Name: "Mining productivity 3",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["mining-productivity-2"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 1000 },
        { Entity: "logistic-science-pack", Count: 1000 },
        { Entity: "chemical-science-pack", Count: 1000 },
        { Entity: "production-science-pack", Count: 1000 },
        { Entity: "utility-science-pack", Count: 1000 },
      ],
      Effects: ["Mining productivity: +10%"],
    },
  ],

  [
    "military-4",
    {
      Id: "military-4",
      Name: "Military 4",
      DurationSeconds: 45,
      ProductionPerTick: 0.022222223,
      Row: 6,
      Prereqs: ["military-3", "utility-science-pack", "explosives"],
      Unlocks: ["piercing-shotgun-shell", "cluster-grenade"],
      Input: [
        { Entity: "automation-science-pack", Count: 150 },
        { Entity: "logistic-science-pack", Count: 150 },
        { Entity: "military-science-pack", Count: 150 },
        { Entity: "chemical-science-pack", Count: 150 },
        { Entity: "utility-science-pack", Count: 150 },
      ],
      Effects: [],
    },
  ],

  [
    "worker-robots-storage-3",
    {
      Id: "worker-robots-storage-3",
      Name: "Worker robot cargo size 3",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["worker-robots-storage-2"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 450 },
        { Entity: "logistic-science-pack", Count: 450 },
        { Entity: "chemical-science-pack", Count: 450 },
        { Entity: "production-science-pack", Count: 450 },
        { Entity: "utility-science-pack", Count: 450 },
      ],
      Effects: ["Worker robot capacity: +1"],
    },
  ],

  [
    "research-speed-6",
    {
      Id: "research-speed-6",
      Name: "Lab research speed 6",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 6,
      Prereqs: ["research-speed-5"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 500 },
        { Entity: "logistic-science-pack", Count: 500 },
        { Entity: "chemical-science-pack", Count: 500 },
        { Entity: "production-science-pack", Count: 500 },
        { Entity: "utility-science-pack", Count: 500 },
      ],
      Effects: ["Lab research speed: +60%"],
    },
  ],

  [
    "physical-projectile-damage-6",
    {
      Id: "physical-projectile-damage-6",
      Name: "Physical projectile damage 6",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["physical-projectile-damage-5"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 600 },
        { Entity: "logistic-science-pack", Count: 600 },
        { Entity: "military-science-pack", Count: 600 },
        { Entity: "chemical-science-pack", Count: 600 },
        { Entity: "utility-science-pack", Count: 600 },
      ],
      Effects: [
        "Bullet damage: +40%",
        "Gun turret damage: +40%",
        "Shotgun shell damage: +40%",
        "Cannon shell damage: +130%",
      ],
    },
  ],

  [
    "atomic-bomb",
    {
      Id: "atomic-bomb",
      Name: "Atomic bomb",
      DurationSeconds: 45,
      ProductionPerTick: 0.022222223,
      Row: 6,
      Prereqs: [
        "military-4",
        "kovarex-enrichment-process",
        "rocket-control-unit",
        "rocketry",
      ],
      Unlocks: ["atomic-bomb"],
      Input: [
        { Entity: "automation-science-pack", Count: 5000 },
        { Entity: "logistic-science-pack", Count: 5000 },
        { Entity: "military-science-pack", Count: 5000 },
        { Entity: "chemical-science-pack", Count: 5000 },
        { Entity: "production-science-pack", Count: 5000 },
        { Entity: "utility-science-pack", Count: 5000 },
      ],
      Effects: [],
    },
  ],

  [
    "power-armor-mk2",
    {
      Id: "power-armor-mk2",
      Name: "Power armor MK2",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 6,
      Prereqs: [
        "power-armor",
        "military-4",
        "speed-module-2",
        "effectivity-module-2",
      ],
      Unlocks: ["power-armor-mk2"],
      Input: [
        { Entity: "automation-science-pack", Count: 400 },
        { Entity: "logistic-science-pack", Count: 400 },
        { Entity: "military-science-pack", Count: 400 },
        { Entity: "chemical-science-pack", Count: 400 },
        { Entity: "utility-science-pack", Count: 400 },
      ],
      Effects: [],
    },
  ],

  [
    "worker-robots-speed-4",
    {
      Id: "worker-robots-speed-4",
      Name: "Worker robot speed 4",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["worker-robots-speed-3"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 250 },
        { Entity: "logistic-science-pack", Count: 250 },
        { Entity: "chemical-science-pack", Count: 250 },
        { Entity: "utility-science-pack", Count: 250 },
      ],
      Effects: ["Worker robot speed: +55%"],
    },
  ],

  [
    "braking-force-7",
    {
      Id: "braking-force-7",
      Name: "Braking force 7",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["braking-force-6"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 650 },
        { Entity: "logistic-science-pack", Count: 650 },
        { Entity: "chemical-science-pack", Count: 650 },
        { Entity: "production-science-pack", Count: 650 },
        { Entity: "utility-science-pack", Count: 650 },
      ],
      Effects: ["Train braking force: +15%"],
    },
  ],

  [
    "stronger-explosives-5",
    {
      Id: "stronger-explosives-5",
      Name: "Stronger explosives 5",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["stronger-explosives-4"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 500 },
        { Entity: "logistic-science-pack", Count: 500 },
        { Entity: "military-science-pack", Count: 500 },
        { Entity: "chemical-science-pack", Count: 500 },
        { Entity: "utility-science-pack", Count: 500 },
      ],
      Effects: [
        "Rocket damage: +50%",
        "Grenade damage: +20%",
        "Land mine damage: +20%",
      ],
    },
  ],

  [
    "energy-weapons-damage-6",
    {
      Id: "energy-weapons-damage-6",
      Name: "Energy weapons damage 6",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["energy-weapons-damage-5"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 600 },
        { Entity: "logistic-science-pack", Count: 600 },
        { Entity: "military-science-pack", Count: 600 },
        { Entity: "chemical-science-pack", Count: 600 },
        { Entity: "utility-science-pack", Count: 600 },
      ],
      Effects: [
        "Laser turret damage: +70%",
        "Combat robot laser damage: +40%",
        "Combat robot beam damage: +60%",
      ],
    },
  ],

  [
    "artillery",
    {
      Id: "artillery",
      Name: "Artillery",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 6,
      Prereqs: ["military-4", "tanks"],
      Unlocks: [
        "artillery-wagon",
        "artillery-turret",
        "artillery-shell",
        "artillery-targeting-remote",
      ],
      Input: [
        { Entity: "automation-science-pack", Count: 2000 },
        { Entity: "logistic-science-pack", Count: 2000 },
        { Entity: "military-science-pack", Count: 2000 },
        { Entity: "chemical-science-pack", Count: 2000 },
        { Entity: "utility-science-pack", Count: 2000 },
      ],
      Effects: [],
    },
  ],

  [
    "uranium-ammo",
    {
      Id: "uranium-ammo",
      Name: "Uranium ammo",
      DurationSeconds: 45,
      ProductionPerTick: 0.022222223,
      Row: 6,
      Prereqs: ["uranium-processing", "military-4", "tanks"],
      Unlocks: [
        "uranium-rounds-magazine",
        "uranium-cannon-shell",
        "explosive-uranium-cannon-shell",
      ],
      Input: [
        { Entity: "automation-science-pack", Count: 1000 },
        { Entity: "logistic-science-pack", Count: 1000 },
        { Entity: "military-science-pack", Count: 1000 },
        { Entity: "chemical-science-pack", Count: 1000 },
        { Entity: "utility-science-pack", Count: 1000 },
      ],
      Effects: [],
    },
  ],

  [
    "spidertron",
    {
      Id: "spidertron",
      Name: "Spidertron",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 6,
      Prereqs: [
        "military-4",
        "exoskeleton-equipment",
        "fusion-reactor-equipment",
        "rocketry",
        "rocket-control-unit",
        "effectivity-module-3",
      ],
      Unlocks: ["spidertron", "spidertron-remote"],
      Input: [
        { Entity: "automation-science-pack", Count: 2500 },
        { Entity: "logistic-science-pack", Count: 2500 },
        { Entity: "military-science-pack", Count: 2500 },
        { Entity: "chemical-science-pack", Count: 2500 },
        { Entity: "production-science-pack", Count: 2500 },
        { Entity: "utility-science-pack", Count: 2500 },
      ],
      Effects: [],
    },
  ],

  [
    "rocket-silo",
    {
      Id: "rocket-silo",
      Name: "Rocket silo",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: [
        "concrete",
        "speed-module-3",
        "productivity-module-3",
        "rocket-fuel",
        "rocket-control-unit",
      ],
      Unlocks: ["rocket-silo", "rocket-part"],
      Input: [
        { Entity: "automation-science-pack", Count: 1000 },
        { Entity: "logistic-science-pack", Count: 1000 },
        { Entity: "chemical-science-pack", Count: 1000 },
        { Entity: "production-science-pack", Count: 1000 },
        { Entity: "utility-science-pack", Count: 1000 },
      ],
      Effects: [],
    },
  ],

  [
    "combat-robotics-3",
    {
      Id: "combat-robotics-3",
      Name: "Combat robotics 3",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 6,
      Prereqs: ["military-4", "combat-robotics-2", "speed-module"],
      Unlocks: ["destroyer-capsule"],
      Input: [
        { Entity: "automation-science-pack", Count: 300 },
        { Entity: "logistic-science-pack", Count: 300 },
        { Entity: "military-science-pack", Count: 300 },
        { Entity: "chemical-science-pack", Count: 300 },
        { Entity: "utility-science-pack", Count: 300 },
      ],
      Effects: [],
    },
  ],

  [
    "refined-flammables-5",
    {
      Id: "refined-flammables-5",
      Name: "Refined flammables 5",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["refined-flammables-4"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 500 },
        { Entity: "logistic-science-pack", Count: 500 },
        { Entity: "military-science-pack", Count: 500 },
        { Entity: "chemical-science-pack", Count: 500 },
        { Entity: "utility-science-pack", Count: 500 },
      ],
      Effects: ["Fire damage: +30%", "Flamethrower turret damage: +30%"],
    },
  ],

  [
    "laser-turret-speed-6",
    {
      Id: "laser-turret-speed-6",
      Name: "Laser turret shooting speed 6",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["laser-turret-speed-5"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 350 },
        { Entity: "logistic-science-pack", Count: 350 },
        { Entity: "military-science-pack", Count: 350 },
        { Entity: "chemical-science-pack", Count: 350 },
        { Entity: "utility-science-pack", Count: 350 },
      ],
      Effects: ["Laser turret shooting speed: +40%"],
    },
  ],

  [
    "follower-robot-count-5",
    {
      Id: "follower-robot-count-5",
      Name: "Follower robot count 5",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 6,
      Prereqs: ["follower-robot-count-4", "combat-robotics-3"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 800 },
        { Entity: "logistic-science-pack", Count: 800 },
        { Entity: "military-science-pack", Count: 800 },
        { Entity: "chemical-science-pack", Count: 800 },
        { Entity: "utility-science-pack", Count: 800 },
      ],
      Effects: ["Maximum following robots: +10"],
    },
  ],

  [
    "refined-flammables-6",
    {
      Id: "refined-flammables-6",
      Name: "Refined flammables 6",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["refined-flammables-5"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 600 },
        { Entity: "logistic-science-pack", Count: 600 },
        { Entity: "military-science-pack", Count: 600 },
        { Entity: "chemical-science-pack", Count: 600 },
        { Entity: "utility-science-pack", Count: 600 },
      ],
      Effects: ["Fire damage: +40%", "Flamethrower turret damage: +40%"],
    },
  ],

  [
    "stronger-explosives-6",
    {
      Id: "stronger-explosives-6",
      Name: "Stronger explosives 6",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["stronger-explosives-5"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 600 },
        { Entity: "logistic-science-pack", Count: 600 },
        { Entity: "military-science-pack", Count: 600 },
        { Entity: "chemical-science-pack", Count: 600 },
        { Entity: "utility-science-pack", Count: 600 },
      ],
      Effects: [
        "Rocket damage: +60%",
        "Grenade damage: +20%",
        "Land mine damage: +20%",
      ],
    },
  ],

  [
    "space-science-pack",
    {
      Id: "space-science-pack",
      Name: "Space science pack",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 6,
      Prereqs: ["rocket-silo", "electric-energy-accumulators", "solar-energy"],
      Unlocks: ["satellite", "space-science-pack", "raw-fish"],
      Input: [
        { Entity: "automation-science-pack", Count: 2000 },
        { Entity: "logistic-science-pack", Count: 2000 },
        { Entity: "chemical-science-pack", Count: 2000 },
        { Entity: "production-science-pack", Count: 2000 },
        { Entity: "utility-science-pack", Count: 2000 },
      ],
      Effects: [],
    },
  ],

  [
    "laser-turret-speed-7",
    {
      Id: "laser-turret-speed-7",
      Name: "Laser turret shooting speed 7",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["laser-turret-speed-6"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 450 },
        { Entity: "logistic-science-pack", Count: 450 },
        { Entity: "military-science-pack", Count: 450 },
        { Entity: "chemical-science-pack", Count: 450 },
        { Entity: "utility-science-pack", Count: 450 },
      ],
      Effects: ["Laser turret shooting speed: +50%"],
    },
  ],

  [
    "worker-robots-speed-5",
    {
      Id: "worker-robots-speed-5",
      Name: "Worker robot speed 5",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 6,
      Prereqs: ["worker-robots-speed-4"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 500 },
        { Entity: "logistic-science-pack", Count: 500 },
        { Entity: "chemical-science-pack", Count: 500 },
        { Entity: "production-science-pack", Count: 500 },
        { Entity: "utility-science-pack", Count: 500 },
      ],
      Effects: ["Worker robot speed: +65%"],
    },
  ],

  [
    "follower-robot-count-6",
    {
      Id: "follower-robot-count-6",
      Name: "Follower robot count 6",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 6,
      Prereqs: ["follower-robot-count-5"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 1000 },
        { Entity: "logistic-science-pack", Count: 1000 },
        { Entity: "military-science-pack", Count: 1000 },
        { Entity: "chemical-science-pack", Count: 1000 },
        { Entity: "utility-science-pack", Count: 1000 },
      ],
      Effects: ["Maximum following robots: +10"],
    },
  ],

  [
    "physical-projectile-damage-7",
    {
      Id: "physical-projectile-damage-7",
      Name: "Physical projectile damage 7",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 7,
      Prereqs: [
        "physical-projectile-damage-6",
        "space-science-pack",
        "physical-projectile-damage-6",
      ],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 1000 },
        { Entity: "logistic-science-pack", Count: 1000 },
        { Entity: "military-science-pack", Count: 1000 },
        { Entity: "chemical-science-pack", Count: 1000 },
        { Entity: "utility-science-pack", Count: 1000 },
        { Entity: "space-science-pack", Count: 1000 },
      ],
      Effects: [
        "Bullet damage: +40%",
        "Gun turret damage: +70%",
        "Shotgun shell damage: +40%",
        "Cannon shell damage: +100%",
      ],
    },
  ],

  [
    "artillery-shell-speed-1",
    {
      Id: "artillery-shell-speed-1",
      Name: "Artillery shell shooting speed 1",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 7,
      Prereqs: ["artillery", "space-science-pack"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 2000 },
        { Entity: "logistic-science-pack", Count: 2000 },
        { Entity: "military-science-pack", Count: 2000 },
        { Entity: "chemical-science-pack", Count: 2000 },
        { Entity: "utility-science-pack", Count: 2000 },
        { Entity: "space-science-pack", Count: 2000 },
      ],
      Effects: ["Artillery shell shooting speed: +100%"],
    },
  ],

  [
    "stronger-explosives-7",
    {
      Id: "stronger-explosives-7",
      Name: "Stronger explosives 7",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 7,
      Prereqs: [
        "stronger-explosives-6",
        "space-science-pack",
        "stronger-explosives-6",
      ],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 1000 },
        { Entity: "logistic-science-pack", Count: 1000 },
        { Entity: "military-science-pack", Count: 1000 },
        { Entity: "chemical-science-pack", Count: 1000 },
        { Entity: "utility-science-pack", Count: 1000 },
        { Entity: "space-science-pack", Count: 1000 },
      ],
      Effects: [
        "Rocket damage: +50%",
        "Grenade damage: +20%",
        "Land mine damage: +20%",
      ],
    },
  ],

  [
    "energy-weapons-damage-7",
    {
      Id: "energy-weapons-damage-7",
      Name: "Energy weapons damage 7",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 7,
      Prereqs: [
        "energy-weapons-damage-6",
        "space-science-pack",
        "energy-weapons-damage-6",
      ],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 1000 },
        { Entity: "logistic-science-pack", Count: 1000 },
        { Entity: "military-science-pack", Count: 1000 },
        { Entity: "chemical-science-pack", Count: 1000 },
        { Entity: "utility-science-pack", Count: 1000 },
        { Entity: "space-science-pack", Count: 1000 },
      ],
      Effects: [
        "Laser turret damage: +70%",
        "Combat robot laser damage: +30%",
        "Combat robot beam damage: +30%",
      ],
    },
  ],

  [
    "mining-productivity-4",
    {
      Id: "mining-productivity-4",
      Name: "Mining productivity 4",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 7,
      Prereqs: [
        "mining-productivity-3",
        "space-science-pack",
        "mining-productivity-3",
      ],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 2500 },
        { Entity: "logistic-science-pack", Count: 2500 },
        { Entity: "chemical-science-pack", Count: 2500 },
        { Entity: "production-science-pack", Count: 2500 },
        { Entity: "utility-science-pack", Count: 2500 },
        { Entity: "space-science-pack", Count: 2500 },
      ],
      Effects: ["Mining productivity: +10%"],
    },
  ],

  [
    "follower-robot-count-7",
    {
      Id: "follower-robot-count-7",
      Name: "Follower robot count 7",
      DurationSeconds: 30,
      ProductionPerTick: 0.033333335,
      Row: 7,
      Prereqs: [
        "follower-robot-count-6",
        "space-science-pack",
        "follower-robot-count-6",
      ],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 1000 },
        { Entity: "logistic-science-pack", Count: 1000 },
        { Entity: "military-science-pack", Count: 1000 },
        { Entity: "chemical-science-pack", Count: 1000 },
        { Entity: "production-science-pack", Count: 1000 },
        { Entity: "utility-science-pack", Count: 1000 },
        { Entity: "space-science-pack", Count: 1000 },
      ],
      Effects: ["Maximum following robots: +10"],
    },
  ],

  [
    "worker-robots-speed-6",
    {
      Id: "worker-robots-speed-6",
      Name: "Worker robot speed 6",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 7,
      Prereqs: [
        "worker-robots-speed-5",
        "space-science-pack",
        "worker-robots-speed-5",
      ],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 1000 },
        { Entity: "logistic-science-pack", Count: 1000 },
        { Entity: "chemical-science-pack", Count: 1000 },
        { Entity: "production-science-pack", Count: 1000 },
        { Entity: "utility-science-pack", Count: 1000 },
        { Entity: "space-science-pack", Count: 1000 },
      ],
      Effects: ["Worker robot speed: +65%"],
    },
  ],

  [
    "artillery-shell-range-1",
    {
      Id: "artillery-shell-range-1",
      Name: "Artillery shell range 1",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 7,
      Prereqs: ["artillery", "space-science-pack"],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 2000 },
        { Entity: "logistic-science-pack", Count: 2000 },
        { Entity: "military-science-pack", Count: 2000 },
        { Entity: "chemical-science-pack", Count: 2000 },
        { Entity: "utility-science-pack", Count: 2000 },
        { Entity: "space-science-pack", Count: 2000 },
      ],
      Effects: ["Artillery shell range: +30%"],
    },
  ],

  [
    "refined-flammables-7",
    {
      Id: "refined-flammables-7",
      Name: "Refined flammables 7",
      DurationSeconds: 60,
      ProductionPerTick: 0.016666668,
      Row: 7,
      Prereqs: [
        "refined-flammables-6",
        "space-science-pack",
        "refined-flammables-6",
      ],
      Unlocks: [],
      Input: [
        { Entity: "automation-science-pack", Count: 1000 },
        { Entity: "logistic-science-pack", Count: 1000 },
        { Entity: "military-science-pack", Count: 1000 },
        { Entity: "chemical-science-pack", Count: 1000 },
        { Entity: "utility-science-pack", Count: 1000 },
        { Entity: "space-science-pack", Count: 1000 },
      ],
      Effects: ["Fire damage: +20%", "Flamethrower turret damage: +20%"],
    },
  ],
]);
