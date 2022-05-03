import { AvailableResearchList } from "./availableResearch";
import { NextEmptySlot } from "./building";
import { GameDispatch } from "./GameDispatch";
import { GameWindow } from "./globals";
import { GameStateReducer } from "./stateVm";
import { Region } from "./types";
import { FactoryGameState } from "./useGameState";

export type MacroName = "redsci" | "allresearch";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Macro(
  name: MacroName,
  reducer: GameStateReducer,
  gameState: FactoryGameState,
  regionId: string
): any {
  switch (name) {
    case "allresearch":
      return doAllResearch(reducer);

    case "redsci":
      return buildRedSci(reducer, gameState, regionId);
  }
}

function doAllResearch(reducer: GameStateReducer) {
  AvailableResearchList.forEach((r) => {
    throw new Error("NYI");
    //if (r)
  });
}

function buildRedSci(
  reducer: GameStateReducer,
  gameState: FactoryGameState,
  regionId: string
) {
  const currentRegion = gameState.Regions.get(regionId);
  if (!currentRegion) throw new Error("No region");
  addProducers(reducer, gameState, currentRegion, [
    { kind: "electric-mining-drill", recipe: "iron-ore", connect: { below } },
    { kind: "stone-furnace", recipe: "iron-plate", connect: { below } },
    {
      kind: "assembling-machine-1",
      recipe: "iron-gear-wheel",
      connect: { below },
    },
    { kind: "assembling-machine-1", recipe: "automation-science-pack" },
    { kind: "stone-furnace", recipe: "copper-plate", connect: { above } },
    { kind: "electric-mining-drill", recipe: "copper-ore", connect: { above } },
  ]);
  return null;
}

let regionId = "region0";
export function setMacroRegionId(r: string) {
  regionId = r;
}

function addProducers(
  reducer: GameStateReducer,
  gameState: FactoryGameState,
  currentRegion: Region,
  producerList: {
    kind: string;
    recipe: string;
    connect?: {
      above?: boolean;
      below?: boolean;
      belt?: string[];
    };
  }[]
) {
  const upperToggles: number[] = [],
    lowerToggles: number[] = [];
  producerList.forEach(({ recipe, kind, connect = {} }) => {
    const buildingIdx = NextEmptySlot(currentRegion.BuildingSlots) || 0;
    GameDispatch(reducer, gameState, {
      type: "TransferToInventory",
      entity: kind,
      otherStackKind: "Void",
      count: 1,
    });
    GameDispatch(reducer, gameState, {
      type: "TransferToInventory",
      entity: "inserter",
      otherStackKind: "Void",
      count: 1,
    });

    GameDispatch(reducer, gameState, {
      type: "PlaceBuilding",
      regionId,
      entity: kind,
      buildingIdx,
    });

    const nextBuildingIdx = NextEmptySlot(currentRegion.BuildingSlots) || 0;

    if (buildingIdx === nextBuildingIdx) {
      throw new Error(`Failed to add producer ${kind} for ${recipe}`);
    }
    if (buildingIdx > 0)
      GameDispatch(reducer, gameState, {
        type: "IncreaseInserterCount",
        buildingIdx: buildingIdx - 1,
        regionId,
        location: "BUILDING",
      });

    GameDispatch(reducer, gameState, {
      type: "ChangeRecipe",
      regionId,
      buildingIdx: buildingIdx,
      recipeId: recipe,
    });
    if (connect.above) upperToggles.push(buildingIdx);
    if (connect.below) lowerToggles.push(buildingIdx);
  });

  lowerToggles.forEach((buildingIdx) => {
    GameDispatch(reducer, gameState, {
      type: "ToggleInserterDirection",
      regionId,
      buildingIdx: buildingIdx,
      location: "BUILDING",
    });
  });

  upperToggles.forEach((buildingIdx) => {
    GameDispatch(reducer, gameState, {
      type: "ToggleInserterDirection",
      regionId,
      buildingIdx: buildingIdx - 1,
      location: "BUILDING",
    });
  });
}
const above = true,
  below = true;

(window as unknown as GameWindow).Macro = Macro;
