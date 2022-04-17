import { NewEntityStack, RegionInfo } from "./types";
import { ReadonlyRegion } from "./useGameState";

export function RemainingRegionBuildingCapacity(
  region: ReadonlyRegion
): number {
  return (
    region.LaneCount -
    region.BuildingSlots.filter((b) => b.Building.kind !== "Empty").length
  );
}

const Regions = new Map<string, RegionInfo>([
  [
    "region0",
    {
      Id: "region0",
      LaneCount: 12,
      LaneSize: 50,
      MainBusCount: 10,
      Cost: [],
      Provides: [
        NewEntityStack("iron-ore", 9000),
        NewEntityStack("copper-ore", 9000),
        NewEntityStack("stone", 9000),
        NewEntityStack("coal", 9000),
        NewEntityStack("crude-oil", 9000),
        NewEntityStack("water", Infinity),
      ],
      AdjacentTo: ["region1", "region2", "region3", "region4"],
    },
  ],
  [
    "region1",
    {
      Id: "region1",
      LaneCount: 10,
      LaneSize: 50,
      MainBusCount: 0,
      Cost: [],
      AdjacentTo: ["region0"],
      Provides: [
        NewEntityStack("iron-ore", Infinity),
        NewEntityStack("copper-ore", Infinity),
        NewEntityStack("stone", Infinity),
        NewEntityStack("coal", Infinity),
        NewEntityStack("crude-oil", Infinity),
        NewEntityStack("water", Infinity),
      ],
    },
  ],
  [
    "region2",
    {
      Id: "region2",
      LaneCount: 40,
      LaneSize: 50,
      MainBusCount: 7,
      AdjacentTo: ["region0"],
      Cost: [],
      Provides: [
        NewEntityStack("iron-ore", 500000),
        NewEntityStack("copper-ore", 500000),
        NewEntityStack("stone", 100000),
        NewEntityStack("coal", 100000),
      ],
    },
  ],
  [
    "region3",
    {
      Id: "region3",
      LaneCount: 20,
      LaneSize: 100,
      MainBusCount: 6,
      AdjacentTo: ["region0"],
      Cost: [],
      Provides: [
        NewEntityStack("iron-ore", 10000),
        NewEntityStack("copper-ore", 10000),
      ],
    },
  ],
  [
    "region4",
    {
      Id: "region4",
      LaneCount: 10,
      LaneSize: 20,
      MainBusCount: 6,
      AdjacentTo: ["region0"],
      Cost: [],
      Provides: [
        NewEntityStack("crude-oil", Infinity),
        NewEntityStack("water", Infinity),
      ],
    },
  ],
  [
    "region5",
    {
      Id: "region5",
      LaneCount: 30,
      LaneSize: 100,
      MainBusCount: 12,
      AdjacentTo: ["region0"],
      Cost: [],
      Provides: [
        NewEntityStack("iron-ore", 500000),
        NewEntityStack("copper-ore", 500000),
        NewEntityStack("stone", 100000),
        NewEntityStack("coal", 100000),
      ],
    },
  ],
  [
    "region6",
    {
      Id: "region6",
      LaneCount: 40,
      LaneSize: 100,
      MainBusCount: 10,
      AdjacentTo: ["region0"],
      Cost: [],
      Provides: [NewEntityStack("water", Infinity)],
    },
  ],

  [
    "HelpRegion",
    {
      Id: "HelpRegion",
      LaneCount: 4,
      LaneSize: 50,
      MainBusCount: 3,
      Cost: [],
      Provides: [
        NewEntityStack("iron-ore", 9000),
        NewEntityStack("copper-ore", 9000),
        NewEntityStack("stone", 9000),
        NewEntityStack("coal", 9000),
        NewEntityStack("crude-oil", 9000),
        NewEntityStack("water", Infinity),
      ],
      AdjacentTo: [],
    },
  ],
]);

export function GetRegionInfo(s: string): RegionInfo {
  const r = Regions.get(s);
  if (!r) throw new Error("No region info for " + s);
  return r;
}
