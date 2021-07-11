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
  currentTarget: EntityDef | null;
  currentHP: number;
  maxHP: number;
  weapon: Weapon;
  defense: Defense;
}
const SpitterBugMaxHP = 300,
  SpitterBugDamage = 5,
  SpitterBugRange = 400,
  SpitterBugArmor = 0;

const Bug = (x: number, y: number): EntityDef => ({
  id: entityId(),
  x,
  y,
  rotation: 0,
  currentTarget: null,
  currentHP: SpitterBugMaxHP,
  maxHP: SpitterBugMaxHP,
  weapon: { damage: SpitterBugDamage, range: SpitterBugRange },
  defense: { armor: SpitterBugArmor },
});

const TurretMaxHP = 500,
  TurretDamage = 10,
  TurretRange = 500,
  TurretArmor = 2;

const Turret = (x: number, y: number): EntityDef => ({
  id: entityId(),
  x,
  y,
  rotation: 0,
  currentTarget: null,
  currentHP: TurretMaxHP,
  maxHP: TurretMaxHP,
  weapon: { damage: TurretDamage, range: TurretRange },
  defense: { armor: TurretArmor },
});

const targetDistance = (t1: EntityDef, t2: EntityDef): number => {
  const a = t1.x - t2.x;
  const b = t1.y - t2.y;
  return Math.sqrt(a * a + b * b);
};

const chooseNearestInRangeTarget = (
  t: EntityDef,
  targets: Map<number, EntityDef>
): EntityDef => {
  // TODO:  Sort targets to get nearest
  return targets
    .filter((target) => targetDistance(t, target) < t.weapon.range)
    .first();
};

const pickAndFaceTarget = (
  t: EntityDef,
  targets: Map<number, EntityDef>
): EntityDef => {
  if (t.currentTarget && !targets.has(t.currentTarget.id))
    t.currentTarget = null;
  if (!t.currentTarget && targets.count() > 0) {
    t.currentTarget = chooseNearestInRangeTarget(t, targets);
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

const doCombat = (
  bugs: Map<number, EntityDef>,
  turrets: Map<number, EntityDef>
): [bugs: Map<number, EntityDef>, turrets: Map<number, EntityDef>] => {
  bugs = bugs.withMutations((bugs) => {
    turrets.forEach((turret) => {
      if (turret.currentTarget) {
        bugs.update(turret.currentTarget.id, (bug) => {
          return doAttack(turret, bug);
        });
      }
    });

    return bugs;
  });
  turrets = turrets.withMutations((turrets) => {
    // combat stuff
    bugs.forEach((bug) => {
      if (bug.currentTarget) {
        turrets.update(bug.currentTarget.id, (turret) => {
          return doAttack(bug, turret);
        });
      }
    });

    return turrets;
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
      [bugs, turrets] = doCombat(bugs, turrets);
      //console.log(bugs.first()?.currentHP);
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
