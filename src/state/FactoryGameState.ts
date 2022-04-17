import { Map } from "immutable";
import { useState } from "react";
import { GetEntity } from "../gen/entities";
import { GameWindow } from "../globals";
import { Inventory } from "../inventory";
import { loadStateFromLocalStorage } from "../localstorage";
import { GetRegionInfo } from "../region";
import { BeltLine } from "../transport";
import {
  EntityStack,
  NewEntityStack,
  NewRegionFromInfo,
  ReadOnlyItemBuffer,
  Region,
} from "../types";

export const CurrentGameStateVersion = "0.1.6";

export const useGameState = () => useState<FactoryGameState>(GameState);

export type ResearchState = Readonly<{
  CurrentResearchId: string;
  Progress: Map<string, EntityStack>;
}>;

type StateAddress = string;

type StateChangeAction = {
  kind: "TransferItems";
  from: StateAddress;
  to: StateAddress;
};

// Core Actions that affect state:
// Transfer Items
// Change current region (Can we remove this concept?)
// Add new region
// Create / Delete beltlines
// Modify Regions
// - Modify Main Bus
// -- Add / remove lane
// - Modify Buildings
// -- Add / remove / rotate inserters / belt connections
// -- Add / remove buildings (change type/count)
// -- Change building recipe
// -- Update building contents
// --

export type FactoryGameState = Readonly<{
  RocketLaunchingAt: number;
  CurrentRegionId: string;
  Research: ResearchState;
  Inventory: ReadOnlyItemBuffer;
  Regions: Map<string, Region>;
  BeltLines: Map<number, BeltLine>;
}>;

const initialInventorySize = 16;

const startingResearch = ["start", "automation"];

export const initialFactoryGameState = (): FactoryGameState => ({
  RocketLaunchingAt: 0,
  Research: {
    Progress: Map(
      startingResearch.map((research) => [
        research,
        NewEntityStack(research, 0, 0),
      ])
    ),
    CurrentResearchId: "",
  },
  CurrentRegionId: "region0",
  Inventory: new Inventory(initialInventorySize, [
    NewEntityStack(GetEntity("burner-mining-drill"), 5),
    NewEntityStack(GetEntity("assembling-machine-1"), 5),
    NewEntityStack(GetEntity("stone-furnace"), 5),
    NewEntityStack(GetEntity("lab"), 5),
    NewEntityStack(GetEntity("transport-belt"), 100),
    NewEntityStack(GetEntity("inserter"), 50),
    NewEntityStack(GetEntity("iron-chest"), 5),
  ]),
  Regions: Map([["region0", NewRegionFromInfo(GetRegionInfo("region0"))]]),
  BeltLines: Map(),
});

export function ResetGameState() {
  GameState = initialFactoryGameState();
}

export type ReadonlyResearchState = {
  readonly CurrentResearchId: string;
  readonly Progress: ReadonlyMap<string, EntityStack>;
};

// export type FactoryGameState = {
//   RocketLaunchingAt: number;
//   CurrentRegionId: string;
//   Research: ResearchState;
//   Inventory: Inventory;
// };

export const GameStateFunc = (): FactoryGameState => GameState;
export const GameStateMutableFunc = () => GameState;

let GameState = loadStateFromLocalStorage(initialFactoryGameState());

(window as unknown as GameWindow).GameState = () => GameState;
