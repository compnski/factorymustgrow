//import { Map } from "immutable";
import { useReducer } from "react";
import { Point, PointToS, BestPath, PrintPath, ScoreFunc } from "./astar";
import {
  EntityDef,
  NewTurret,
  NewMeleeBug,
  NewSpitterBug,
  NewSpawner,
  NewTestEnt,
  GameState,
} from "./defs";
import poissonProcess from "poisson-process";

export const useExploreState = () =>
  useReducer(exploreStateReducer, initialExploreState);

export type ExploreAction = {
  type: "Reset" | "PlaceTurret" | "SpawnBug" | "SpawnSpawner" | "Tick";
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
const BugSpawnRate = 2500;
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
  if (ent.kind == "Spawner") return;
  if (
    ent.currentTarget &&
    (!targets.has(ent.currentTarget.id) ||
      (ent.topSpeed === 0 && !inRange(ent, ent.currentTarget)))
  ) {
    clearTarget(ent);
    console.log(`Clear target for ${ent.id}`);
  }
  if (!ent.currentTarget && ent.currentPath?.length) {
    console.log(`Dead Path for ${ent.id}!!!`);
    clearTarget(ent);
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
    //console.log(`New path for ${ent.id} ${ent.currentPath?.length}`);
    ent.currentPath = BestPath(
      pathfindingScaleFactor,
      { x: ent.x, y: ent.y },
      { x: ent.currentTarget.x, y: ent.currentTarget.y },
      ent.weapon.range,
      (p: Point) => (p.x === ent.x && p.y === ent.y ? 0 : score(p))
    ); //.slice(0, 125);
  }

  if (ent.currentTarget) {
    const rotationTarget = //ent.currentTarget;
      !ent.isAttacking && ent.currentPath?.length && ent.currentPath[0]
        ? ent.currentPath[0]
        : ent.currentTarget;
    const deltaY = rotationTarget.y - ent.y;
    const deltaX = rotationTarget.x - ent.x;
    let rotation = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

    var rotationDelta = ent.rotation - rotation;
    rotationDelta = Math.min(Math.max(rotationDelta, -1), 1);
    ent.rotation = rotation + rotationDelta;
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
  if (entity.topSpeed <= 0) return;
  if (!entity.currentPath || !entity.currentPath[0]) {
    if (entity.currentTarget) console.log("No path to target for ", entity.id);
    return;
  }
  const x = entity.currentPath[0].x,
    y = entity.currentPath[0].y;
  //  console.log(PointToS(entity.currentPath[0]));
  if (targetDistance(entity, entity.currentPath[0]) <= entity.topSpeed) {
    entity.currentPath.shift();
  }

  const rotationRad =
    Math.atan2(y - entity.y, x - entity.x) + normalRand(-0.3, 0.3);
  const deltaX = entity.topSpeed * Math.cos(rotationRad);
  const deltaY = entity.topSpeed * Math.sin(rotationRad);
  const newX = entity.x + deltaX;
  const newY = entity.y + deltaY;
  const newPos = { x: newX, y: newY };

  for (var [_, e] of new Map([...turrets])) {
    if (e.id == entity.id) continue;
    if (targetDistance(newPos, e) < entity.hitRadius) {
      //console.log(`${entity.id} Would collide with bug ${e.id}`);
      if (Date.now() - (entity?.lastMovedAt || 0) > 100) {
        entity.currentPath.shift();
        //clearTarget(entity);
        //TODO Better collision fixing, maybe find angle between colliders and use that to unbounce
        entity.x -= 2 * deltaX;
        entity.y -= 2 * deltaY;
        entity.lastMovedAt = Date.now();
      }

      return;
    }
  }

  // for (var [_, e] of turrets) {
  //   if (e.id == entity.id) continue;
  //   if (targetDistance(entity, e) < entity.hitRadius + e.hitRadius) {
  //     console.log(`${entity.id} Would collide with turret ${e.id}`);
  //     return;
  //   }
  // }

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
          return 5; //Infinity;
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

const mouseEnt = NewTestEnt(0, 0);
const mouseEntList = new Map<number, EntityDef>([[0, mouseEnt]]);

function inBounds(n: number): number {
  return Math.min(Math.max(n, 32), 568);
}

function pickBugSpawnCoords(bug: Point): Point {
  var x = inBounds(bug.x + normalRand(-100, 100));
  var y = inBounds(bug.y + normalRand(-100, 100));
  x = x < bug.x ? x - 24 : x + 24;
  y = y < bug.y ? y - 24 : y + 24;
  return { x, y };
}

function spawnNewBugs(delta: number, bugs: Map<number, EntityDef>) {
  const spawners: EntityDef[] = [];
  bugs.forEach((bug) => {
    if (bug.kind === "Spawner") {
      spawners.push(bug);
    }
  });
  const numSpawners = spawners.length;
  const numBugs = bugs.size - numSpawners;
  if (numBugs < numSpawners * AllowedBugsPerSpawner)
    spawners.forEach((bug) => {
      bug.context.nextSpawnAt -= delta;
      if (bug.context.nextSpawnAt <= 0) {
        bug.context.nextSpawnAt = poissonProcess.sample(BugSpawnRate);
        const { x, y } = pickBugSpawnCoords(bug);
        console.log(
          `Spawn at (${x},${y}) from ${bug.id}, ${bug.context.nextSpawnAt}`
        );
        spawnBug({ x, y });
      }
    });
}

var lastTick = 0;
export function AdvanceGameState(tick: number, mousePos: Point) {
  const score = scoreFunction(4, GameState.bugs, GameState.turrets, {
    x: 600,
    y: 600,
  });

  const delta = tick - lastTick;
  lastTick = tick;
  mouseEnt.x = mousePos.x;
  mouseEnt.y = mousePos.y;
  // Allow to target spawners
  for (var [_, t] of GameState.turrets)
    if (!t.notAIControlled) pickAndFaceTarget(t, GameState.bugs, score);
  for (var [_, b] of GameState.bugs)
    if (!b.notAIControlled) pickAndFaceTarget(b, GameState.turrets, score);
  doMoveAndCombat(GameState.bugs, GameState.turrets);

  spawnNewBugs(delta, GameState.bugs);

  // paintHitMap(10, hitContext, SpitterBugRadius, bugs, turrets);
  // if (counter++ > 500) {
  //   hitContext.fillStyle = "#000000";
  //   hitContext.fillRect(0, 0, 60, 60);
  //   console.log(JSON.stringify(hitContext.getImageData(0, 0, 60, 60).data));
  //   counter = 0;
}

const NumSpawners = 7;
const AllowedBugsPerSpawner = 10;

function spawnSpawners() {
  for (var i = 0; i < NumSpawners; i++) {
    const x = inBounds(normalRand(32, 500, 1) + Math.random() * 200);
    const y = inBounds(normalRand(32, 500, 1.2) + (75 - Math.random() * 200));
    const b = NewSpawner(x, y);
    GameState.bugs.set(b.id, b);
    for (var j = 0; j < normalRand(2, AllowedBugsPerSpawner / 2); j++) {
      spawnBug(pickBugSpawnCoords(b));
    }
  }
}

export function exploreStateReducer(
  state: ExploreState,
  action: ExploreAction
): ExploreState {
  const type = action.type;
  const actionX = Math.floor(action.position?.x || 0);
  const actionY = Math.floor(action.position?.y || 0);

  switch (type) {
    case "Reset":
      console.log("reset");
      GameState.turrets = new Map();
      GameState.bugs = new Map();
      spawnSpawners();
      return { ...state, turrets: GameState.turrets, bugs: GameState.bugs };
    case "Tick":
      // Spawn new biters?
      (window as any).state = state;
      return { ...state, turrets: GameState.turrets, bugs: GameState.bugs };
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
    case "SpawnSpawner":
      if (action.position) {
        for (var [_, e] of GameState.bugs) {
          if (targetDistance(action.position, e) < 16 + e.hitRadius) {
            console.log(`New Spawner Would collide with ${e.id} ${e.x},${e.y}`);
            return state;
          }
        }
        const b = NewSpawner(actionX, actionY);
        GameState.bugs.set(b.id, b);
      }
      return { ...state, bugs: GameState.bugs };

    case "SpawnBug":
      if (action.position && belowSpawnCap(state.bugs)) {
        spawnBug(action.position);
      }
      return { ...state, bugs: GameState.bugs };
    default:
  }
  return state;
}

function spawnBug(at: Point) {
  const Bug = Math.random() > 0.4 ? NewMeleeBug : NewSpitterBug;
  const b = Bug(at.x, at.y);
  GameState.bugs.set(b.id, b);
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

function normalRand(min: number = 0, max: number = 1, skew: number = 1) {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) num = normalRand(min, max, skew);
  // resample between 0 and 1 if out of range
  else {
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
  }
  return num;
}
