import { ReadOnlyBuildingSlot } from "../building";
import { Inserter } from "../inserter";
import { ReadOnlyMainBus } from "../mainbus";
import {
  BeltConnection,
  ItemBuffer,
  ReadOnlyItemBuffer,
  Region,
} from "../types";
import { GameStateFunc } from "./FactoryGameState";

export interface ReadOnlyRegion {
  readonly Id: string;
  readonly Ore: ReadOnlyItemBuffer;
  readonly LaneCount: number;
  readonly LaneSize: number;
  readonly MainBusCount: number;
  readonly BuildingSlots: ReadOnlyBuildingSlot[];
  readonly Bus: ReadOnlyMainBus;
}

export function HasRegion(regionId: string): boolean {
  return GameStateFunc().Regions.has(regionId);
}

export function GetRegion(regionId: string): ReadOnlyRegion {
  return GetMutableRegion(regionId) as ReadOnlyRegion;
}

export function GetMutableRegion(regionId: string): Region {
  const currentRegion = GameStateFunc().Regions.get(regionId);
  if (!currentRegion)
    throw new Error(
      "Cannot find current region " + GameStateFunc().CurrentRegionId
    );
  return currentRegion;
}

export function CurrentRegion(): Readonly<ReadOnlyRegion> {
  return CurrentMutableRegion() as ReadOnlyRegion;
}

export function CurrentMutableRegion(): Region {
  return GetMutableRegion(GameStateFunc().CurrentRegionId);
}
