import { Building } from "./building";
import { ImmutableMap } from "./immutable";
import { Inserter } from "./inserter";
import { ReadonlyInventory } from "./inventory";
import { GetRegionInfo } from "./region";
import { TruckLine, TruckLineDepot } from "./transport";
import {
  BeltConnection,
  EntityStack,
  NewEntityStack,
  NewMainBus,
  NewRegionFromInfo,
} from "./types";

export type ReadonlyItemBuffer = {
  readonly Capacity: number;
  AddItems(entity: string, count: number): ReadonlyItemBuffer;

  AvailableSpace(entity: string): number;
  Entities(): Readonly<[entity: string, count: number][]>;
  Count(entity: string): number;
  Accepts(entity: string): boolean;
};

export interface ReadonlyResearchState {
  readonly Progress: ImmutableMap<string, Readonly<EntityStack>>;
  readonly CurrentResearchId: string;
}

export type ReadonlyBuilding = {
  readonly inputBuffers: ReadonlyItemBuffer;
  readonly outputBuffers: ReadonlyItemBuffer;
} & Readonly<
  Pick<Building, "kind" | "subkind" | "ProducerType" | "BuildingCount">
> &
  Partial<{ RecipeId: string }> &
  Partial<Pick<TruckLineDepot, "direction" | "truckLineId">> &
  Partial<{ readonly progressTrackers: Readonly<number[]> }>;

export interface ReadonlyBuildingSlot {
  Building: ReadonlyBuilding;
  readonly Inserter: Readonly<Inserter>;
  readonly BeltConnections: Readonly<BeltConnection>[];
}

export interface ReadonlyRegion {
  readonly Id: string;
  readonly Ore: ReadonlyInventory;
  readonly LaneCount: number;
  readonly Bus: NewMainBus;
  readonly BuildingSlots: ReadonlyBuildingSlot[];
}

export const CurrentGameStateVersion = "0.2.5";

export type ResearchState = {
  CurrentResearchId: string;
  Progress: ImmutableMap<string, EntityStack>;
};

export type FactoryGameState = {
  RocketLaunchingAt: number;
  //  readonly HackyPropertyBag: Readonly<IHackyPropertyBag>;
  readonly Research: ReadonlyResearchState;
  readonly Inventory: ReadonlyInventory;
  readonly Regions: ImmutableMap<string, ReadonlyRegion>;
  readonly TruckLines: ImmutableMap<string, Readonly<TruckLine>>;
  readonly LastTick: number;
};

const initialInventorySize = 16;

const startingResearch = ["start", "automation"];

export const initialFactoryGameState = () => ({
  RocketLaunchingAt: 0,
  Research: {
    Progress: ImmutableMap(
      startingResearch.map((research) => [
        research,
        NewEntityStack(research, 0, 0),
      ])
    ),
    CurrentResearchId: "",
  },
  Inventory: new ReadonlyInventory(
    initialInventorySize,
    ImmutableMap([
      ["burner-mining-drill", 5],
      ["assembling-machine-1", 5],
      ["stone-furnace", 5],
      ["lab", 5],
      ["transport-belt", 100],
      ["inserter", 50],
      ["iron-chest", 5],
      ["automation-science-pack", 100],
      ["concrete", 50],
    ])
  ),
  Regions: ImmutableMap([
    ["region0", NewRegionFromInfo(GetRegionInfo("region0"))],
  ]),
  TruckLines: ImmutableMap<string, Readonly<TruckLine>>(),
  LastTick: 0,
});
