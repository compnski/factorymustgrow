import PriorityQueue from "ts-priority-queue";

// From https://en.wikipedia.org/wiki/A*_search_algorithm#Pseudocode

export type Point = {
  x: number;
  y: number;
};

export function PointToS(p: Point): string {
  return `${p.x}X${p.y}	`;
}

const distanceFunc = (start: Point, goal: Point): number =>
  Math.abs(goal.x - start.x) + Math.abs(goal.y - start.y);

export function BestPath(
  start: Point,
  goal: Point,
  scoreMap: ScoredMap
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

  openSet.queue(start);
  openSetSet.add(PointToS(start));

  gScore.set(PointToS(start), 0);

  var maxIter = 1000;

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

    if (current.x === goal.x && current.y === goal.y) {
      return reconstructPath(cameFrom, current);
    }
    scoreNeighbors(current, scoreMap).forEach(([neighbor, score]) => {
      if (score === Infinity) return;
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
    });
  }

  return [];
}

interface ScoredMap {
  score(at: Point): number;
}

function scoreNeighbors(n: Point, map: ScoredMap): [Point, number][] {
  return [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ].map(([x, y]) => {
    x = n.x + x;
    y = n.y + y;
    const score = map.score({ x, y });
    return [{ x, y }, score];
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

export function PrintPath(path: Point[]): string {
  var maxX = -Infinity,
    maxY = -Infinity,
    minX = Infinity,
    minY = Infinity;
  var pathMap = new Map<string, number>();

  path.forEach((p, idx) => {
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    pathMap.set(PointToS(p), idx);
  });

  var output = "";
  for (var y = minY; y <= maxY; y++) {
    var line = "";
    for (var x = minX; x <= maxX; x++) {
      line += pathMap.get(PointToS({ x, y })) != undefined ? "X" : "0";
    }
    output += line + "\n";
  }
  return output;
}
