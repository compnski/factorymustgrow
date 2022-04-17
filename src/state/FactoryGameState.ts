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
  Region,
} from "../types";
import { ReadOnlyRegion } from "./region";

export const CurrentGameStateVersion = "0.1.6";

export const useGameState = () => useState<FactoryGameState>(GameState);

export type ResearchState = {
  CurrentResearchId: string;
  Progress: Map<string, EntityStack>;
};

export type FactoryGameState = {
  RocketLaunchingAt: number;
  CurrentRegionId: string;
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
    Progress: new Map(
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
  Regions: new Map([["region0", NewRegionFromInfo(GetRegionInfo("region0"))]]),
  BeltLines: new Map(),
});

export function ResetGameState() {
  GameState = initialFactoryGameState();
}

type ReadonlyGameState = Readonly<FactoryGameState> & {
  Regions: ReadonlyMap<string, ReadOnlyRegion>;
  BeltLines: ReadonlyMap<number, Readonly<BeltLine>>;
};

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

export const GameStateFunc = (): ReadonlyGameState => GameState;
export const GameStateMutableFunc = () => GameState;

let GameState = loadStateFromLocalStorage(initialFactoryGameState());

(window as unknown as GameWindow).GameState = () => GameState;
