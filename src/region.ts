import { NewEntityStack, Region, RegionInfo } from "./types";

export function RemainingRegionBuildingCapacity(region: Region): number {
  return (
    region.LaneCount -
    region.BuildingSlots.filter((b) => b.Building.kind !== "Empty").length
  );
}

const Regions = new Map<string, RegionInfo>([
  [
    "start",
    {
      Id: "start",
      LaneCount: 8,
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
      LaneCount: 5,
      LaneSize: 10,
      MainBusCount: 3,
      Cost: [],
      AdjacentTo: ["start"],
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
      AdjacentTo: ["start"],
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
    "region4",
    {
      Id: "region4",
      LaneCount: 10,
      LaneSize: 20,
      MainBusCount: 6,
      AdjacentTo: ["start"],
      Cost: [],
      Provides: [
        NewEntityStack("crude-oil", Infinity),
        NewEntityStack("water", Infinity),
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
      AdjacentTo: ["start"],
      Cost: [],
      Provides: [
        NewEntityStack("iron-ore", 10000),
        NewEntityStack("copper-ore", 10000),
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
      AdjacentTo: ["start"],
      Cost: [],
      Provides: [
        NewEntityStack("iron-ore", 500000),
        NewEntityStack("copper-ore", 500000),
        NewEntityStack("stone", 100000),
        NewEntityStack("coal", 100000),
      ],
    },
  ],
]);

export function GetRegionInfo(s: string): RegionInfo {
  return Regions.get(s)!;
}
