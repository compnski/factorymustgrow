import { Point } from "./astar";

var _entityIdx = 0;
const entityId = (): number => _entityIdx++;

export const GameState: {
  turrets: Map<number, EntityDef>;
  bugs: Map<number, EntityDef>;
  terrain: Map<number, TerrainDef>;
} = {
  turrets: new Map(),
  bugs: new Map(),
  terrain: new Map(),
};

type EntityKind = "MeleeBug" | "SpitterBug" | "Turret" | "Spawner" | "TestEnt";
export interface EntityDef {
  kind: EntityKind;
  id: number;
  x: number;
  y: number;
  hitRadius: number;
  rotation: number;
  topSpeed: number;
  currentTarget: EntityDef | null;
  currentHP: number;
  maxHP: number;
  weapon: {
    damage: number;
    range: number;
  };
  defense: {
    armor: number;
  };
  currentPath?: Point[];
  isAttacking?: boolean;
  lastMovedAt?: number;
  notAIControlled?: boolean;
  context?: any;
}

export interface TerrainDef {
  id: number;
  x: number;
  y: number;
  hitRadius: number;
}

export const NewTerrain = (x: number, y: number): TerrainDef => ({
  id: entityId(),
  x,
  y,
  hitRadius: 32,
});

const SpitterBugMaxHP = 400,
  SpitterBugDamage = 5,
  SpitterBugRange = 150,
  SpitterBugArmor = 0,
  SpitterBugRadius = 8;

const MeleeBugMaxHP = 500,
  MeleeBugDamage = 8,
  MeleeBugRange = 50,
  MeleeBugArmor = 2,
  MeleeBugRadius = 12;

const SpawnerMaxHP = 1500,
  SpawnerDamage = 0,
  SpawnerRange = 0,
  SpawnerArmor = 5,
  SpawnerRadius = 32;

const TurretMaxHP = 2500,
  TurretDamage = 25,
  TurretRange = 300,
  TurretArmor = 2,
  TurretRadius = 32;

export const NewSpitterBug = (x: number, y: number): EntityDef => ({
  kind: "SpitterBug",
  id: entityId(),
  x,
  y,
  hitRadius: SpitterBugRadius,
  rotation: 0,
  topSpeed: 3,
  currentTarget: null,
  currentHP: SpitterBugMaxHP,
  maxHP: SpitterBugMaxHP,
  weapon: { damage: SpitterBugDamage, range: SpitterBugRange },
  defense: { armor: SpitterBugArmor },
});

export const NewMeleeBug = (x: number, y: number): EntityDef => ({
  kind: "MeleeBug",
  id: entityId(),
  x,
  y,
  hitRadius: MeleeBugRadius,
  rotation: 0,
  topSpeed: 4,
  currentTarget: null,
  currentHP: MeleeBugMaxHP,
  maxHP: MeleeBugMaxHP,
  weapon: { damage: MeleeBugDamage, range: MeleeBugRange },
  defense: { armor: MeleeBugArmor },
});

export const NewSpawner = (x: number, y: number): EntityDef => ({
  kind: "Spawner",
  id: entityId(),
  x,
  y,
  hitRadius: SpawnerRadius,
  topSpeed: 0,
  rotation: 0,
  currentTarget: null,
  currentHP: SpawnerMaxHP,
  maxHP: SpawnerMaxHP,
  weapon: { damage: SpawnerDamage, range: SpawnerRange },
  defense: { armor: SpawnerArmor },
  context: { nextSpawnAt: 0 },
});

export const NewTurret = (x: number, y: number): EntityDef => ({
  kind: "Turret",
  id: entityId(),
  x,
  y,
  hitRadius: TurretRadius,
  topSpeed: 0,
  rotation: 0,
  currentTarget: null,
  currentHP: TurretMaxHP,
  maxHP: TurretMaxHP,
  weapon: { damage: TurretDamage, range: TurretRange },
  defense: { armor: TurretArmor },
});

export const NewTestEnt = (x: number, y: number): EntityDef => ({
  kind: "TestEnt",
  id: entityId(),
  x,
  y,
  hitRadius: 0,
  rotation: 0,
  topSpeed: 0,
  currentTarget: null,
  currentHP: 99999,
  maxHP: 99999,
  weapon: { damage: 0, range: 0 },
  defense: { armor: 999999 },
});
