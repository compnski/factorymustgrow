import { NewEntityStack, RegionInfo } from "./types";

const Regions = new Map([
  [
    "start",
    {
      Id: "start",
      Capacity: 250,
      MainBusCapacity: 10,
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
      Capacity: 30,
      MainBusCapacity: 3,
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
      Capacity: 300,
      MainBusCapacity: 6,
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
      Capacity: 500,
      MainBusCapacity: 6,
      AdjacentTo: ["start"],
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
      Capacity: 400,
      MainBusCapacity: 7,
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
    "region5",
    {
      Id: "region5",
      Capacity: 500,
      MainBusCapacity: 12,
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
