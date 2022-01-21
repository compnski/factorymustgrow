import { useState } from "react";
import {
  NewEntityStack,
  Region,
  EntityStack,
  NewRegionFromInfo,
} from "./types";
import { GetEntity } from "./gen/entities";
import { loadStateFromLocalStorage } from "./localstorage";
import { Inventory } from "./inventory";
import { GetRegionInfo } from "./region";
import { BeltLine } from "./transport";
import { GameWindow } from "./globals";

export const CurrentGameStateVersion = "0.1.3";

export const useGameState = () => useState<FactoryGameState>(GameState);

export type ResearchState = {
  CurrentResearchId: string;
  Progress: Map<string, EntityStack>;
};

export type FactoryGameState = {
  CurrentRegionId: string;
  Research: ResearchState;
  Inventory: Inventory;
  Regions: Map<string, Region>;
  BeltLines: Map<number, BeltLine>;
};
const initialInventorySize = 8;

const startingResearch = ["start", "automation"];

export const initialFactoryGameState = () => ({
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

export var GameState = loadStateFromLocalStorage(initialFactoryGameState());

(window as unknown as GameWindow).GameState = () => GameState;
