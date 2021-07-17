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
0X0000
0XXX00
000XXX
00000X
`;

  expect(
    PrintPath(BestPath({ x: 0, y: 0 }, { x: 5, y: 5 }, { score }))
  ).toEqual(expectedPath);
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
0XX0000000
00XXXX0000
`;

  expect(
    PrintPath(BestPath({ x: 0, y: 0 }, { x: 5, y: 5 }, { score }))
  ).toEqual(expectedPath);
});

it("returns [] when there is no path", () => {
  const score = (at: Point): number =>
    at.x > 10 || at.y > 10 || at.x < 0 || at.y < 0 || at.y === 1 ? Infinity : 1;

  const path = BestPath({ x: 0, y: 0 }, { x: 5, y: 5 }, { score });
  expect(path).toEqual([]);
});
