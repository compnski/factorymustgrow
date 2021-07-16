import { Map } from "immutable";
import { useReducer } from "react";

export const useExploreState = () =>
  useReducer(exploreStateReducer, initialExploreState);
export type ExploreAction = {
  type: "PlaceTurret" | "SpawnBug" | "Tick";
  position?: { x: number; y: number };
};

var _entityIdx = 0;
const entityId = (): number => _entityIdx++;

interface Weapon {
  damage: number;
  range: number;
}

interface Defense {
  armor: number;
}

interface EntityDef {
  id: number;
  x: number;
  y: number;
  rotation: number;
  topSpeed: number;
  currentTarget: EntityDef | null;
  currentHP: number;
  maxHP: number;
  weapon: Weapon;
  defense: Defense;
}

const SpitterBugMaxHP = 600,
  SpitterBugDamage = 1,
  SpitterBugRange = 200,
  SpitterBugArmor = 0;

const MeleeBugMaxHP = 600,
  MeleeBugDamage = 5,
  MeleeBugRange = 50,
  MeleeBugArmor = 3;

const SpitterBug = (x: number, y: number): EntityDef => ({
  id: entityId(),
  x,
  y,
  rotation: 0,
  topSpeed: 1,
  currentTarget: null,
  currentHP: SpitterBugMaxHP,
  maxHP: SpitterBugMaxHP,
  weapon: { damage: SpitterBugDamage, range: SpitterBugRange },
  defense: { armor: SpitterBugArmor },
});

const MeleeBug = (x: number, y: number): EntityDef => ({
  id: entityId(),
  x,
  y,
  rotation: 0,
  topSpeed: 1,
  currentTarget: null,
  currentHP: MeleeBugMaxHP,
  maxHP: MeleeBugMaxHP,
  weapon: { damage: MeleeBugDamage, range: MeleeBugRange },
  defense: { armor: MeleeBugArmor },
});

const TurretMaxHP = 1500,
  TurretDamage = 5,
  TurretRange = 300,
  TurretArmor = 2;

const Turret = (x: number, y: number): EntityDef => ({
  id: entityId(),
  x,
  y,
  topSpeed: 0,
  rotation: 0,
  currentTarget: null,
  currentHP: TurretMaxHP,
  maxHP: TurretMaxHP,
  weapon: { damage: TurretDamage, range: TurretRange },
  defense: { armor: TurretArmor },
});

// Spawn Spawners
// Global Inputs:
// - Pollution
// - "Distance"
// - Factory size??
// Local Inputs:
// - Y-coord
// - Near other spawners
// - Near obstructions

// immutable point
interface iPoint {
  readonly x: number;
  readonly y: number;
}

const targetDistance = (t1: iPoint, t2: iPoint): number => {
  const a = t1.x - t2.x;
  const b = t1.y - t2.y;
  return Math.sqrt(a * a + b * b);
};

const chooseNearestTarget = (
  t: EntityDef,
  targets: Map<number, EntityDef>
): EntityDef | null => {
  // TODO:  Sort targets to get nearest
  var nearestTarget = null;
  var nearestDistance = 1e6;
  targets.forEach((target) => {
    const d = targetDistance(t, target);
    if (d < nearestDistance) {
      nearestDistance = d;
      nearestTarget = target;
    }
  });
  return nearestTarget;
};

const pickAndFaceTarget = (
  t: EntityDef,
  targets: Map<number, EntityDef>
): EntityDef => {
  if (
    !t.currentTarget ||
    !targets.has(t.currentTarget.id) ||
    !inRange(t, t.currentTarget)
  )
    t.currentTarget = null;
  if (!t.currentTarget && targets.count() > 0) {
    t.currentTarget = chooseNearestTarget(t, targets);
    console.log("Focus on ", t.currentTarget);
  }
  if (t.currentTarget) {
    const deltaY = t.currentTarget.y - t.y;
    const deltaX = t.x - t.currentTarget.x;
    let rotation = (Math.atan(deltaX / deltaY) * 180) / Math.PI;
    if (deltaY > 0) {
      rotation += 180;
    }
    t.rotation = rotation;
  }
  return { ...t };
};

export type ExploreDispatch = (action: ExploreAction) => void;

export type ExploreState = {
  bugs: Map<number, EntityDef>;
  turrets: Map<number, EntityDef>;
};

const initialExploreState: ExploreState = {
  bugs: Map(),
  turrets: Map(),
};

const belowSpawnCap = (m: Map<number, EntityDef>): boolean => {
  return m.count() < 20;
};

const doAttack = (attacker: EntityDef, defender: EntityDef): EntityDef => {
  const currentHP =
    defender.currentHP -
    Math.max(0, attacker.weapon.damage - defender.defense.armor);
  //  if (defender.currentHP < 0) console.log("killed ", defender);
  return { ...defender, currentHP };
};

const isAlive = (e: EntityDef): boolean => e?.currentHP > 0;

const inRange = (attacker: EntityDef, defender: EntityDef): boolean =>
  targetDistance(attacker, defender) < attacker.weapon.range;

const doMove = (
  entity: EntityDef,
  { x, y }: { x: number; y: number }
): EntityDef => {
  const rotationRad = Math.atan2(y - entity.y, x - entity.x);
  const deltaX = entity.topSpeed * Math.cos(rotationRad);
  const deltaY = entity.topSpeed * Math.sin(rotationRad);
  return { ...entity, x: entity.x + deltaX, y: entity.y + deltaY };
};

const doMoveAndCombat = (
  bugs: Map<number, EntityDef>,
  turrets: Map<number, EntityDef>
): [bugs: Map<number, EntityDef>, turrets: Map<number, EntityDef>] => {
  bugs = bugs.withMutations((bugs) => {
    turrets.forEach((turret) => {
      if (turret.currentTarget && inRange(turret, turret.currentTarget)) {
        bugs.update(turret.currentTarget.id, (bug) => {
          return doAttack(turret, bug);
        });
      }
    });

    turrets = turrets.withMutations((turrets) => {
      // combat stuff
      bugs.forEach((bug) => {
        if (bug.currentTarget) {
          if (inRange(bug, bug.currentTarget)) {
            turrets.update(bug.currentTarget.id, (turret) => {
              return doAttack(bug, turret);
            });
          } else {
            bugs.update(bug.id, (bug) => {
              if (!bug.currentTarget) return bug;
              return doMove(bug, {
                x: bug.currentTarget.x,
                y: bug.currentTarget.y,
              });
            });
          }
        }
      });

      return turrets;
    });
    return bugs;
  });

  return [bugs.filter(isAlive), turrets.filter(isAlive)];
};

export function exploreStateReducer(
  state: ExploreState,
  action: ExploreAction
): ExploreState {
  const type = action.type;
  const actionX = Math.floor(action.position?.x || 0);
  const actionY = Math.floor(action.position?.y || 0);
  switch (type) {
    case "Tick":
      // Spawn new biters?
      let turrets = state.turrets.map(
        // Allow to target spawners
        (t: EntityDef): EntityDef => pickAndFaceTarget(t, state.bugs)
      );
      let bugs = state.bugs.map(
        (b: EntityDef): EntityDef => pickAndFaceTarget(b, state.turrets)
      );
      [bugs, turrets] = doMoveAndCombat(bugs, turrets);
      (window as any).state = state;
      return { ...state, turrets, bugs };
    case "PlaceTurret":
      if (action.position && canPlaceTurretAt(state, actionX, actionY)) {
        const turrets = state.turrets.withMutations((mt) => {
          const t = Turret(actionX, actionY);
          mt.set(t.id, t);
        });

        return { ...state, turrets };
      }
      break;
    case "SpawnBug":
      if (action.position && belowSpawnCap(state.bugs)) {
        const bugs = state.bugs.withMutations((mb) => {
          const Bug = Math.random() > 0.7 ? MeleeBug : SpitterBug;
          const b = Bug(actionX, actionY);
          mb.set(b.id, b);
        });
        return { ...state, bugs };
      }
      break;
    default:
  }
  return state;
}

const canPlaceTurretAt = function (
  state: ExploreState,
  x: number,
  y: number
): boolean {
  return true;
};
