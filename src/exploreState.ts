import { Map } from "immutable";
import { useReducer } from "react";
import { Point, PointToS, BestPath, PrintPath, ScoreFunc } from "./astar";

export const useExploreState = () =>
  useReducer(exploreStateReducer, initialExploreState);
export type ExploreAction = {
  type: "PlaceTurret" | "SpawnBug" | "Tick";
  position?: { x: number; y: number };
};

const pathfindingScaleFactor = 10;

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
  hitRadius: number;
  rotation: number;
  topSpeed: number;
  currentTarget: EntityDef | null;
  currentHP: number;
  maxHP: number;
  weapon: Weapon;
  defense: Defense;
  currentPath?: Point[];
}

type EntityMap = Map<number, EntityDef>;

const SpitterBugMaxHP = 600,
  SpitterBugDamage = 1,
  SpitterBugRange = 200,
  SpitterBugArmor = 0,
  SpitterBugRadius = 16;

const MeleeBugMaxHP = 600,
  MeleeBugDamage = 5,
  MeleeBugRange = 50,
  MeleeBugArmor = 3,
  MeleeBugRadius = 16;

const SpitterBug = (x: number, y: number): EntityDef => ({
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

const MeleeBug = (x: number, y: number): EntityDef => ({
  id: entityId(),
  x,
  y,
  hitRadius: MeleeBugRadius,
  rotation: 0,
  topSpeed: 1,
  currentTarget: null,
  currentHP: MeleeBugMaxHP,
  maxHP: MeleeBugMaxHP,
  weapon: { damage: MeleeBugDamage, range: MeleeBugRange },
  defense: { armor: MeleeBugArmor },
});

const TurretMaxHP = 1500,
  TurretDamage = 1,
  TurretRange = 300,
  TurretArmor = 2,
  TurretRadius = 32;

const Turret = (x: number, y: number): EntityDef => ({
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
  targets: Map<number, EntityDef>,
  score: ScoreFunc
): EntityDef => {
  if (
    !t.currentTarget ||
    !targets.has(t.currentTarget.id) ||
    (!inRange(t, t.currentTarget) && t.topSpeed === 0)
  )
    t.currentTarget = null;
  if (!t.currentTarget && targets.count() > 0) {
    t.currentTarget = chooseNearestTarget(t, targets);
  }
  if (
    t.topSpeed > 0 &&
    t.currentTarget != null &&
    (!t.currentPath || !t.currentPath.length)
  ) {
    t.currentPath = BestPath(
      pathfindingScaleFactor,
      { x: t.x, y: t.y },
      { x: t.currentTarget.x, y: t.currentTarget.y },
      (p: Point) => (p.x === t.x && p.y === t.y ? 0 : score(p))
    ).slice(0, 5);

    //console.log(PrintPath(t.currentPath, pathfindingScaleFactor));
  }
  //console.log("Focus on ", t.currentTarget);

  if (t.currentTarget) {
    const rotationTarget = //t.currentTarget;
      t.currentPath?.length && t.currentPath[0]
        ? t.currentPath[0]
        : t.currentTarget;
    const deltaY = rotationTarget.y - t.y;
    const deltaX = t.x - rotationTarget.x;
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

const doMove = (entity: EntityDef): EntityDef => {
  if (!entity.currentPath || !entity.currentPath[0]) return entity;
  const x = entity.currentPath[0].x,
    y = entity.currentPath[0].y;
  //  console.log(PointToS(entity.currentPath[0]));
  if (targetDistance(entity, entity.currentPath[0]) <= pathfindingScaleFactor) {
    entity.currentPath.shift();
  }

  const rotationRad = Math.atan2(y - entity.y, x - entity.x);
  const deltaX = entity.topSpeed * Math.cos(rotationRad);
  const deltaY = entity.topSpeed * Math.sin(rotationRad);
  return {
    ...entity,
    currentPath: entity.currentPath,
    x: entity.x + deltaX,
    y: entity.y + deltaY,
  };
};

const clearTargets = (
  bugs: Map<number, EntityDef>,
  turrets: Map<number, EntityDef>
): [bugs: Map<number, EntityDef>, turrets: Map<number, EntityDef>] => {
  bugs = bugs.map((bug) => ({
    ...bug,
    currentTarget: null,
    currentPath: [],
  }));

  turrets = turrets.map((turret) => ({
    ...turret,
    currentTarget: null,
    currentPath: [],
  }));

  return [bugs, turrets];
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
            if ((bug.currentPath?.length || 0) > 0) {
              bugs.update(bug.id, (bug) => ({
                ...bug,
                currentPath: [],
              }));
            }
            turrets.update(bug.currentTarget.id, (turret) => {
              return doAttack(bug, turret);
            });
          } else {
            bugs.update(bug.id, (bug) => {
              if (!bug.currentTarget) return bug;
              return doMove(bug);
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

function scoreFunction(
  bufferRadius: number,
  friendlies: EntityMap,
  enemies: EntityMap,
  bottomRight: Point
): (p: Point) => number {
  const pointCache = Map<string, number>();
  return (p: Point): number => {
    //p = { x: p.x * scalingFactor, y: p.y * scalingFactor };
    const pointS = PointToS(p);
    var points = pointCache.get(pointS);
    if (points != null) return points;
    const score = ((): number => {
      if (p.x < 0 || p.y < 0 || p.x > bottomRight.x || p.y > bottomRight.y)
        return Infinity;

      for (const [_, ent] of friendlies) {
        //.forEach((ent) => {
        if (targetDistance(p, ent) <= bufferRadius + ent.hitRadius) {
          //console.log("hit entity", PointToS(p));
          return 15; //Infinity;
        }
      }

      for (const [_, ent] of enemies) {
        //}.forEach((ent) => {
        if (targetDistance(p, ent) <= bufferRadius + ent.hitRadius) {
          return 25; //Infinity;
        }
        if (
          targetDistance(p, ent) <=
          bufferRadius + ent.hitRadius + ent.weapon.range
        ) {
          return 5;
        }
      }

      return 1;
    })();
    pointCache.set(PointToS(p), score);
    return score;
  };
}

export function exploreStateReducer(
  state: ExploreState,
  action: ExploreAction
): ExploreState {
  const type = action.type;
  const actionX = Math.floor(action.position?.x || 0);
  const actionY = Math.floor(action.position?.y || 0);
  var turrets = state.turrets,
    bugs = state.bugs;

  switch (type) {
    case "Tick":
      // Spawn new biters?
      const score = scoreFunction(16, state.bugs, state.turrets, {
        x: 600,
        y: 600,
      });
      turrets = state.turrets.map(
        // Allow to target spawners
        (t: EntityDef): EntityDef => pickAndFaceTarget(t, state.bugs, score)
      );
      bugs = state.bugs.map(
        (b: EntityDef): EntityDef => pickAndFaceTarget(b, state.turrets, score)
      );
      // paintHitMap(10, hitContext, SpitterBugRadius, bugs, turrets);
      // if (counter++ > 500) {
      //   hitContext.fillStyle = "#000000";
      //   hitContext.fillRect(0, 0, 60, 60);
      //   console.log(JSON.stringify(hitContext.getImageData(0, 0, 60, 60).data));
      //   counter = 0;
      // }

      [bugs, turrets] = doMoveAndCombat(bugs, turrets);
      (window as any).state = state;
      return { ...state, turrets, bugs };
    case "PlaceTurret":
      if (action.position && canPlaceTurretAt(state, actionX, actionY)) {
        [bugs, turrets] = clearTargets(bugs, turrets);
        turrets = state.turrets.withMutations((mt) => {
          const t = Turret(actionX, actionY);
          mt.set(t.id, t);
        });
        return { ...state, turrets, bugs };
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
