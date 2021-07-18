//import { Map } from "immutable";
import { useReducer } from "react";
import { Point, PointToS, BestPath, PrintPath, ScoreFunc } from "./astar";
import {
  EntityDef,
  NewTurret,
  NewMeleeBug,
  NewSpitterBug,
  GameState,
} from "./defs";

export const useExploreState = () =>
  useReducer(exploreStateReducer, initialExploreState);

export type ExploreAction = {
  type: "PlaceTurret" | "SpawnBug" | "Tick";
  position?: { x: number; y: number };
};

export type ExploreDispatch = (action: ExploreAction) => void;

export type ExploreState = {
  bugs: Map<number, EntityDef>;
  turrets: Map<number, EntityDef>;
};

const initialExploreState: ExploreState = {
  bugs: new Map(),
  turrets: new Map(),
};

type EntityMap = Map<number, EntityDef>;
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

const pathfindingScaleFactor = 10;

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
  ent: EntityDef,
  targets: Map<number, EntityDef>,
  score: ScoreFunc
) => {
  if (
    ent.currentTarget &&
    (!targets.has(ent.currentTarget.id) ||
      (ent.topSpeed === 0 && !inRange(ent, ent.currentTarget)))
  ) {
    clearTarget(ent);
    console.log(`Clear target for ${ent.id}`);
  }
  if (!ent.currentTarget && targets.size > 0) {
    ent.currentTarget = chooseNearestTarget(ent, targets);
  }
  if (
    ent.topSpeed > 0 &&
    !ent.isAttacking &&
    ent.currentTarget != null &&
    (!ent.currentPath || !ent.currentPath.length)
  ) {
    console.log(`New path for ${ent.id} ${ent.currentPath?.length}`);
    ent.currentPath = BestPath(
      pathfindingScaleFactor,
      { x: ent.x, y: ent.y },
      { x: ent.currentTarget.x, y: ent.currentTarget.y },
      (p: Point) => (p.x === ent.x && p.y === ent.y ? 0 : score(p)),
      (p: Point) =>
        !ent.currentTarget ||
        targetDistance(p, ent.currentTarget) < ent.weapon.range
    ).slice(0, 20);
  }

  if (ent.currentTarget) {
    const rotationTarget = //ent.currentTarget;
      !ent.isAttacking && ent.currentPath?.length && ent.currentPath[0]
        ? ent.currentPath[0]
        : ent.currentTarget;
    const deltaY = rotationTarget.y - ent.y;
    const deltaX = ent.x - rotationTarget.x;
    let rotation = (Math.atan(deltaX / deltaY) * 180) / Math.PI;
    if (deltaY > 0) {
      rotation += 180;
    }
    ent.rotation = rotation;
  }
};

const belowSpawnCap = (m: Map<number, EntityDef>): boolean => {
  return m.size < 20;
};

const isAlive = (e: EntityDef): boolean => e?.currentHP > 0;

const inRange = (attacker: EntityDef, defender: EntityDef): boolean =>
  targetDistance(attacker, defender) < attacker.weapon.range;

const doAttack = (attacker: EntityDef, defender: EntityDef) => {
  attacker.isAttacking = true;
  defender.currentHP -= Math.max(
    0,
    attacker.weapon.damage - defender.defense.armor
  );
};

const doMove = (entity: EntityDef, bugs: EntityMap, turrets: EntityMap) => {
  if (!entity.currentPath || !entity.currentPath[0]) {
    if (entity.currentTarget) console.log("No path to target for ", entity.id);
    return;
  }
  const x = entity.currentPath[0].x,
    y = entity.currentPath[0].y;
  //  console.log(PointToS(entity.currentPath[0]));
  if (targetDistance(entity, entity.currentPath[0]) <= 1) {
    entity.currentPath.shift();
  }

  const rotationRad = Math.atan2(y - entity.y, x - entity.x);
  const deltaX = entity.topSpeed * Math.cos(rotationRad);
  const deltaY = entity.topSpeed * Math.sin(rotationRad);
  const newX = entity.x + deltaX;
  const newY = entity.y + deltaY;
  const newPos = { x: newX, y: newY };
  for (var [_, e] of bugs) {
    if (e.id == entity.id) continue;
    if (targetDistance(newPos, e) < entity.hitRadius) {
      //console.log(`${entity.id} Would collide with bug ${e.id}`);
      if (Date.now() - (entity?.lastMovedAt || 0) > 1000) {
        clearTarget(entity);
        //TODO Better collision fixing, maybe find angle between colliders and use that to unbounce
        entity.x -= 2 * deltaX;
        entity.y -= 2 * deltaY;
        entity.lastMovedAt = Date.now();
      }

      return;
    }
  }

  for (var [_, e] of turrets) {
    if (e.id == entity.id) continue;
    if (targetDistance(entity, e) < entity.hitRadius + e.hitRadius) {
      console.log(`${entity.id} Would collide with turret ${e.id}`);
      return;
    }
  }

  entity.x = newX;
  entity.y = newY;
  entity.lastMovedAt = Date.now();
};

const clearTarget = (e: EntityDef) => {
  e.currentTarget = null;
  e.currentPath = [];
  e.isAttacking = false;
};

const clearTargets = (
  bugs: Map<number, EntityDef>,
  turrets: Map<number, EntityDef>
) => {
  bugs.forEach(clearTarget);
  turrets.forEach(clearTarget);
};

const doMoveAndCombat = (
  bugs: Map<number, EntityDef>,
  turrets: Map<number, EntityDef>
) => {
  turrets.forEach((turret) => {
    turret.isAttacking = false;
    if (turret.currentTarget && inRange(turret, turret.currentTarget)) {
      doAttack(turret, turret.currentTarget);
    }
  });

  // combat stuff
  bugs.forEach((bug) => {
    bug.isAttacking = false;
    if (bug.currentTarget) {
      if (inRange(bug, bug.currentTarget)) {
        if ((bug.currentPath?.length || 0) > 0) {
          bug.currentPath = [];
        }
        return doAttack(bug, bug.currentTarget);
      } else {
        if (bug.currentTarget) doMove(bug, bugs, turrets);
      }
    }
  });

  bugs.forEach((bug) => {
    if (!isAlive(bug)) bugs.delete(bug.id);
  });
  turrets.forEach((turret) => {
    if (!isAlive(turret)) turrets.delete(turret.id);
  });
};

function scoreFunction(
  bufferRadius: number,
  friendlies: EntityMap,
  enemies: EntityMap,
  bottomRight: Point
): (p: Point) => number {
  const pointCache = new Map<string, number>();
  return (p: Point): number => {
    //p = { x: p.x * scalingFactor, y: p.y * scalingFactor };
    const pointS = PointToS(p);
    var points = pointCache.get(pointS);
    if (points != null) return points;
    const score = ((): number => {
      if (p.x < 0 || p.y < 0 || p.x > bottomRight.x || p.y > bottomRight.y)
        return Infinity;

      for (const [_, ent] of friendlies) {
        if (targetDistance(p, ent) <= bufferRadius + ent.hitRadius) {
          return 55; //Infinity;
        }
        // Prefer not hitting future paths
        // if (ent.currentPath?.length) {
        //   for (var i = 0; i < Math.min(ent.currentPath.length, 15); i++) {
        //     if (
        //       targetDistance(p, ent.currentPath[i]) <=
        //       bufferRadius + ent.hitRadius
        //     ) {
        //       return 10; //Infinity;
        //     }
        //   }
        // }
      }

      for (const [_, ent] of enemies) {
        //}.forEach((ent) => {
        if (targetDistance(p, ent) <= bufferRadius + ent.hitRadius) {
          return 55; //Infinity;
        }
        if (
          targetDistance(p, ent) <=
          bufferRadius + ent.hitRadius + ent.weapon.range
        ) {
          return 1;
        }
      }

      return 1;
    })();
    pointCache.set(PointToS(p), score);
    return score;
  };
}

export function AdvanceGameState(delta: number) {
  const score = scoreFunction(4, GameState.bugs, GameState.turrets, {
    x: 600,
    y: 600,
  });
  // Allow to target spawners
  for (var [_, t] of GameState.turrets)
    pickAndFaceTarget(t, GameState.bugs, score);
  for (var [_, b] of GameState.bugs)
    pickAndFaceTarget(b, GameState.turrets, score);
  doMoveAndCombat(GameState.bugs, GameState.turrets);
  // paintHitMap(10, hitContext, SpitterBugRadius, bugs, turrets);
  // if (counter++ > 500) {
  //   hitContext.fillStyle = "#000000";
  //   hitContext.fillRect(0, 0, 60, 60);
  //   console.log(JSON.stringify(hitContext.getImageData(0, 0, 60, 60).data));
  //   counter = 0;
}

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
      (window as any).state = state;
      const turrets = GameState.turrets,
        bugs = GameState.bugs;
      return { ...state, turrets, bugs };
    case "PlaceTurret":
      if (
        action.position &&
        canPlaceTurretAt(actionX, actionY, GameState.bugs, GameState.turrets)
      ) {
        clearTargets(GameState.bugs, GameState.turrets);
        const t = NewTurret(actionX, actionY);
        GameState.turrets.set(t.id, t);

        return { ...state, turrets: GameState.turrets };
      }
      break;
    case "SpawnBug":
      if (action.position && belowSpawnCap(state.bugs)) {
        for (var [_, e] of GameState.bugs) {
          if (targetDistance(action.position, e) < 16 + e.hitRadius) {
            console.log(`New Bug Would collid with ${e.id}`);
            return state;
          }
        }

        const Bug = Math.random() > 0.3 ? NewMeleeBug : NewSpitterBug;
        const b = Bug(actionX, actionY);
        GameState.bugs.set(b.id, b);
      }
      return { ...state, bugs: GameState.bugs };
    default:
  }
  return state;
}

const canPlaceTurretAt = function (
  x: number,
  y: number,
  bugs: EntityMap,
  turrets: EntityMap
): boolean {
  for (var [_, e] of bugs) {
    if (targetDistance({ x, y }, e) < 16 + e.hitRadius) {
      return false;
    }
  }
  for (var [_, e] of turrets) {
    if (targetDistance({ x, y }, e) < 16 + e.hitRadius) {
      return false;
    }
  }

  return true;
};
