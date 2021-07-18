import { Point } from "./astar";

var _entityIdx = 0;
const entityId = (): number => _entityIdx++;

export const GameState: {
  turrets: Map<number, EntityDef>;
  bugs: Map<number, EntityDef>;
} = {
  turrets: new Map(),
  bugs: new Map(),
};

export interface EntityDef {
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
}

const SpitterBugMaxHP = 600,
  SpitterBugDamage = 1,
  SpitterBugRange = 200,
  SpitterBugArmor = 0,
  SpitterBugRadius = 8;

const MeleeBugMaxHP = 600,
  MeleeBugDamage = 5,
  MeleeBugRange = 50,
  MeleeBugArmor = 3,
  MeleeBugRadius = 12;

const TurretMaxHP = 1500,
  TurretDamage = 1,
  TurretRange = 300,
  TurretArmor = 2,
  TurretRadius = 32;

export const NewSpitterBug = (x: number, y: number): EntityDef => ({
  id: entityId(),
  x,
  y,
  hitRadius: SpitterBugRadius,
  rotation: 0,
  topSpeed: 1,
  currentTarget: null,
  currentHP: SpitterBugMaxHP,
  maxHP: SpitterBugMaxHP,
  weapon: { damage: SpitterBugDamage, range: SpitterBugRange },
  defense: { armor: SpitterBugArmor },
});

export const NewMeleeBug = (x: number, y: number): EntityDef => ({
  id: entityId(),
  x,
  y,
  hitRadius: MeleeBugRadius,
  rotation: 0,
  topSpeed: 2,
  currentTarget: null,
  currentHP: MeleeBugMaxHP,
  maxHP: MeleeBugMaxHP,
  weapon: { damage: MeleeBugDamage, range: MeleeBugRange },
  defense: { armor: MeleeBugArmor },
});

export const NewTurret = (x: number, y: number): EntityDef => ({
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
