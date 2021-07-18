import { BestPath, PrintPath } from "./astar";

type Point = {
  x: number;
  y: number;
};

it("computes a path", () => {
  const score = (at: Point): number =>
    at.x > 10 || at.y > 10 || at.x < 0 || at.y < 0 ? Infinity : 1;

  const expectedPath = `XX0000
0X0000
0XXX00
000X00
000XX0
0000XX
`;

  expect(PrintPath(BestPath(1, { x: 0, y: 0 }, { x: 5, y: 5 }, score))).toEqual(
    expectedPath
  );
});

it("passes obstacles", () => {
  const score = (at: Point): number =>
    at.x > 10 ||
    at.y > 10 ||
    at.x < 0 ||
    at.y < 0 ||
    (at.y === 1 && at.x !== 9) ||
    (at.y === 3 && at.x !== 1)
      ? Infinity
      : 1;
  const expectedPath = `XXXXXXXXXX
000000000X
0XXXXXXXXX
0X00000000
0XXXX00000
0000XX0000
`;

  expect(PrintPath(BestPath(1, { x: 0, y: 0 }, { x: 5, y: 5 }, score))).toEqual(
    expectedPath
  );
});

it("returns [] when there is no path", () => {
  const score = (at: Point): number =>
    at.x > 10 || at.y > 10 || at.x < 0 || at.y < 0 || at.y === 1 ? Infinity : 1;

  const path = BestPath(1, { x: 0, y: 0 }, { x: 5, y: 5 }, score);
  expect(path).toEqual([]);
});

it("computes a scaled path", () => {
  const score = (at: Point): number =>
    at.x > 100 || at.y > 100 || at.x < 0 || at.y < 0 ? Infinity : 1;

  const expectedPath = `XX0000
0X0000
0XXX00
000X00
000XX0
0000XX
`;

  expect(
    PrintPath(BestPath(10, { x: 0, y: 0 }, { x: 50, y: 50 }, score), 10)
  ).toEqual(expectedPath);
});
