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
};
const initialInventorySize = 8;
export const initialFactoryGameState = () => ({
  Research: {
    Progress: new Map([["start", NewEntityStack("start", 0, 0)]]),
    CurrentResearchId: "",
  },
  CurrentRegionId: "start",
  Inventory: new Inventory(initialInventorySize, [
    NewEntityStack(GetEntity("burner-mining-drill"), 5),
    NewEntityStack(GetEntity("assembling-machine-1"), 5),
    NewEntityStack(GetEntity("stone-furnace"), 5),
    NewEntityStack(GetEntity("lab"), 5),
  ]),
  Regions: new Map([["start", NewRegionFromInfo(GetRegionInfo("start"))]]),
});

export function ResetGameState() {
  GameState = initialFactoryGameState();
}

export var GameState = loadStateFromLocalStorage(initialFactoryGameState());