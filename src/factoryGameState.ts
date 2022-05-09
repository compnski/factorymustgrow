import { Building } from "./building";
import { ImmutableMap } from "./immutable";
import { Inserter } from "./inserter";
import { ReadonlyInventory } from "./inventory";
import { ReadonlyMainBus } from "./mainbus";
import { GetRegionInfo } from "./region";
import { BeltLine, BeltLineDepot } from "./transport";
import {
  BeltConnection,
  EntityStack,
  NewEntityStack,
  NewRegionFromInfo,
} from "./types";

export type ReadonlyItemBuffer = {
  readonly Capacity: number;
  AddItems(entity: string, count: number): ReadonlyItemBuffer;
  //RemoveItems(entity: string, count: number): ReadonlyItemBuffer;

  AvailableSpace(entity: string): number;
  Entities(): Readonly<[entity: string, count: number][]>;
  Count(entity: string): number;
  Accepts(entity: string): boolean;
  //SlotsUsed(): number;

  Remove(toStack: EntityStack, count?: number, integersOnly?: boolean): number;
  Add(
    fromStack: EntityStack,
    count?: number,
    exceedCapacity?: boolean,
    integersOnly?: boolean
  ): number;
  AddFromItemBuffer(
    from: ReadonlyItemBuffer,
    entity: string,
    itemCount?: number,
    exceedCapacity?: boolean,
    integersOnly?: boolean
  ): number;
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
  Partial<Pick<BeltLineDepot, "direction" | "beltLineId">> &
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
  readonly Bus: ReadonlyMainBus;
  readonly BuildingSlots: ReadonlyBuildingSlot[];
}

export const CurrentGameStateVersion = "0.2.2";

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
  readonly BeltLines: ImmutableMap<string, Readonly<BeltLine>>;
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
    ])
  ),
  Regions: ImmutableMap([
    ["region0", NewRegionFromInfo(GetRegionInfo("region0"))],
  ]),
  BeltLines: ImmutableMap<string, Readonly<BeltLine>>(),
});
