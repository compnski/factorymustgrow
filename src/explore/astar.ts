import PriorityQueue from "ts-priority-queue";

// From https://en.wikipedia.org/wiki/A*_search_algorithm#Pseudocode

export type Point = {
  x: number;
  y: number;
};

export function PointToS(p: Point): string {
  return `${p.x}X${p.y}`;
}

// const distanceFunc = (start: Point, goal: Point): number =>
//   Math.abs(goal.x - start.x) + Math.abs(goal.y - start.y);

const distanceFunc = (start: Point, goal: Point): number =>
  Math.sqrt(Math.pow(goal.x - start.x, 2) + Math.pow(goal.y - start.y, 2));

const scalePoint = (p: Point, scalingFactor: number): Point => ({
  x: Math.floor(p.x / scalingFactor),
  y: Math.floor(p.y / scalingFactor),
});

// const scalePoint = (p: Point, scalingFactor: number): Point => ({
//   x: p.x,
//   y: p.y,
// });
// GoalFunc should return true if this is a goal state
// type GoalFunc = (p: Point) => boolean;
export function BestPath(
  scalingFactor: number,
  start: Point,
  goal: Point,
  goalRadius: number,
  score: ScoreFunc
  //goalFunc: GoalFunc
): Point[] {
  const cameFrom = new Map<string, Point>(),
    gScore = new Map<string, number>(),
    fScore = new Map<string, number>(),
    openSetSet = new Set<string>(),
    openSet = new PriorityQueue<Point>({
      comparator: function (a: Point, b: Point) {
        return (fScore.get(PointToS(a)) || 0) - (fScore.get(PointToS(b)) || 0);
      },
    });

  start = scalePoint(start, scalingFactor);
  goal = scalePoint(goal, scalingFactor);
  goalRadius = (goalRadius - 1) / scalingFactor;

  openSet.queue(start);
  openSetSet.add(PointToS(start));

  gScore.set(PointToS(start), 0);

  let maxIter = 100000;

  while (openSet.length > 0) {
    if (maxIter-- < 0) {
      console.log("max iter reached");
      console.log(openSet.length, openSetSet.size);
      console.log(openSetSet);
      console.log(gScore);
      console.log(fScore);
      return [];
    }
    const current = openSet.dequeue(),
      currentS = PointToS(current);

    openSetSet.delete(currentS);

    if (
      (current.x === goal.x && current.y === goal.y) ||
      distanceFunc(current, goal) < goalRadius
    ) {
      return reconstructPath(cameFrom, current).map((p) =>
        scalePoint(p, 1 / scalingFactor)
      );
    }
    scoreNeighbors(scalingFactor, current, score).forEach(
      ([neighbor, score]) => {
        if (PointToS(neighbor) !== PointToS(goal) && score === Infinity) return;
        const neighborS = PointToS(neighbor);

        const localGScore = (gScore.get(currentS) ?? Infinity) + score;
        if (localGScore < (gScore.get(neighborS) ?? Infinity)) {
          cameFrom.set(neighborS, current);
          gScore.set(neighborS, localGScore);
          fScore.set(neighborS, localGScore + distanceFunc(neighbor, goal));
          if (!openSetSet.has(neighborS)) {
            openSetSet.add(neighborS);
            openSet.queue(neighbor);
          }
        }
      }
    );
  }

  return [];
}

export type ScoreFunc = (at: Point) => number;

function scoreNeighbors(
  scalingFactor: number,
  n: Point,
  score: ScoreFunc
): [Point, number][] {
  return [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ].map(([x, y]) => {
    x = n.x + x;
    y = n.y + y;
    return [{ x, y }, score(scalePoint({ x, y }, 1 / scalingFactor))];
  });
}

function reconstructPath(
  cameFrom: Map<string, Point>,
  current: Point
): Point[] {
  const totalPath: Point[] = [current];
  while (cameFrom.has(PointToS(current))) {
    current = cameFrom.get(PointToS(current)) as Point;
    totalPath.unshift(current);
  }
  return totalPath;
}

export function PrintPath(path: Point[], scalingFactor = 1): string {
  let maxX = -Infinity,
    maxY = -Infinity,
    minX = Infinity,
    minY = Infinity;
  const pathMap = new Map<string, number>();

  path.forEach((p, idx) => {
    p = scalePoint(p, scalingFactor);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    pathMap.set(PointToS(p), idx);
  });

  let output = "";
  for (let y = minY; y <= maxY; y++) {
    let line = "";
    for (let x = minX; x <= maxX; x++) {
      line += pathMap.get(PointToS({ x, y })) !== undefined ? "X" : "0";
    }
    output += line + "\n";
  }
  return output;
}
