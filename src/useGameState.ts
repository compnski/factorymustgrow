import { useState } from "react";
import { Building } from "./building";
import { GetEntity } from "./gen/entities";
import { GameWindow } from "./globals";
import { ImmutableMap } from "./immutable";
import { Inserter } from "./inserter";
import { Inventory, ReadonlyInventory } from "./inventory";
import { loadStateFromLocalStorage } from "./localstorage";
import { ReadonlyMainBus } from "./mainbus";
import { GetRegionInfo } from "./region";
import { BeltLine, BeltLineDepot } from "./transport";
import {
  BeltConnection,
  CountRemover,
  EntityStack,
  ItemBuffer,
  NewEntityStack,
  NewRegionFromInfo,
  Region,
} from "./types";

export type ReadonlyItemBuffer = {
  readonly Capacity: number;
  AddItems(entity: string, count: number): ReadonlyItemBuffer;
  RemoveItems(entity: string, count: number): ReadonlyItemBuffer;

  AvailableSpace(entity: string): number;
  Entities(): Readonly<[entity: string, count: number][]>;
  Count(entity: string): number;
  Accepts(entity: string): boolean;
  SlotsUsed(): number;

  Remove(toStack: EntityStack, count?: number, integersOnly?: boolean): number;
  Add(
    fromStack: EntityStack,
    count?: number,
    exceedCapacity?: boolean,
    integersOnly?: boolean
  ): number;
  AddFromItemBuffer(
    from: CountRemover,
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
  Partial<Pick<BeltLineDepot, "name" | "direction" | "otherRegionId">>;

export interface ReadonlyBuildingSlot {
  Building: ReadonlyBuilding;
  readonly Inserter: Readonly<Inserter>;
  readonly BeltConnections: Readonly<BeltConnection>[];
}

export interface ReadonlyRegion {
  readonly Id: string;
  readonly Ore: ReadonlyItemBuffer;
  readonly LaneCount: number;
  readonly Bus: ReadonlyMainBus;
  readonly BuildingSlots: ReadonlyBuildingSlot[];
}

interface IHackyPropertyBag {
  RocketLaunchingAt?: number;
}

export interface ReadonlyState {
  readonly HackyPropertyBag: Readonly<IHackyPropertyBag>;
  readonly Research: ReadonlyResearchState;
  readonly Inventory: ReadonlyItemBuffer;
  readonly Regions: ReadonlyMap<string, ReadonlyRegion>;
  readonly BeltLines: ReadonlyMap<number, Readonly<BeltLine>>;
}

export const CurrentGameStateVersion = "0.1.6";

export const useGameState = () => useState<FactoryGameState>(GameState);

export type ResearchState = {
  CurrentResearchId: string;
  Progress: ImmutableMap<string, EntityStack>;
};

export type FactoryGameState = {
  RocketLaunchingAt: number;
  Research: ResearchState;
  Inventory: Inventory;
  Regions: Map<string, Region>;
  BeltLines: Map<number, BeltLine>;
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
  Inventory: new Inventory(initialInventorySize, [
    NewEntityStack(GetEntity("burner-mining-drill"), 5),
    NewEntityStack(GetEntity("assembling-machine-1"), 5),
    NewEntityStack(GetEntity("stone-furnace"), 5),
    NewEntityStack(GetEntity("lab"), 5),
    NewEntityStack(GetEntity("transport-belt"), 100),
    NewEntityStack(GetEntity("inserter"), 50),
    NewEntityStack(GetEntity("iron-chest"), 5),
    NewEntityStack(GetEntity("automation-science-pack"), 100),
  ]),
  Regions: new Map([["region0", NewRegionFromInfo(GetRegionInfo("region0"))]]),
  BeltLines: new Map(),
});

export function ResetGameState() {
  GameState = initialFactoryGameState();
}

export let GameState = loadStateFromLocalStorage(initialFactoryGameState());

(window as unknown as GameWindow).GameState = () => GameState;

export function GetRegion(regionId: string): Region {
  const region = GameState.Regions.get(regionId);
  if (!region) throw new Error("Cannot find current region " + regionId);
  return region;
}

export function GetReadonlyRegion(regionId: string): ReadonlyRegion {
  const region = GameState.Regions.get(regionId);
  if (!region) throw new Error("Cannot find current region " + regionId);
  return {
    ...region,
    Ore: new ReadonlyInventory(region.Ore),
    Bus: new ReadonlyMainBus(region.Bus),
  };
}

export function GetResearchState(): ReadonlyResearchState {
  return GameState.Research;
}
