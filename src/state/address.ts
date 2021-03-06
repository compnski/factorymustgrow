import { InserterId } from "../building";

export type StateAddress =
  | MainBusAddress
  | BuildingAddress
  | InventoryAddress
  | RegionAddress
  | BeltLineAddress
  | GlobalAddress
  | BeltConnectionAddress;
type GlobalAddress = "global";
export type InserterAddress = InserterId;
export type BeltConnectionAddress = BuildingAddress & { connectionIdx: number };
export type BeltLineAddress = {
  beltLineId: string;
};
export type MainBusAddress = {
  regionId: string;
  laneId: number;
};

export type BuildingAddress = {
  regionId: string;
  buildingIdx: number;
  buffer?: "input" | "output";
};

export type RegionAddress = {
  regionId: string;
  buffer?: "ore";
};
type InventoryAddress = {
  inventory: true;
};
export function isMainBusAddress(s: StateAddress): s is MainBusAddress {
  return (s as MainBusAddress).laneId !== undefined;
}
export function isBeltLineAddress(s: StateAddress): s is BeltLineAddress {
  return (s as BeltLineAddress).beltLineId !== undefined;
}
export function isBeltConnectionAddress(
  s: StateAddress
): s is BeltConnectionAddress {
  return (s as BeltConnectionAddress).connectionIdx !== undefined;
}
export function isBuildingAddress(s: StateAddress): s is BuildingAddress {
  const sb = s as BuildingAddress;
  return sb.buildingIdx !== undefined;
}
export function isRegionAddress(s: StateAddress): s is RegionAddress {
  const sr = s as RegionAddress;
  return sr.regionId != undefined;
}
export function isInventoryAddress(s: StateAddress): s is InventoryAddress {
  return (s as InventoryAddress).inventory;
}
export function isGlobalAddress(s: StateAddress): s is GlobalAddress {
  return (s as string) === "global";
}
export function isInserterAddress(
  address: StateAddress
): address is InserterAddress {
  return (address as InserterAddress).location !== undefined;
}
