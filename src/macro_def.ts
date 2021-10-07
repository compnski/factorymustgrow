import { GameDispatch } from "./GameDispatch";
import { GameState } from "./useGameState";
import { GameWindow } from "./globals";

export type MacroName = "redsci";

export function Macro(name: MacroName): any {
  switch (name) {
    case "redsci":
      return buildRedSci();
  }
}

function buildRedSci() {
  addProducers([
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

function addProducers(
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
  const currentRegion = GameState.Regions.get(GameState.CurrentRegionId)!;

  const upperToggles: number[] = [],
    lowerToggles: number[] = [];
  producerList.forEach(({ recipe, kind, connect = {} }) => {
    const buildingIdx = currentRegion.Buildings.length;
    GameDispatch({
      type: "TransferToInventory",
      entity: kind,
      otherStackKind: "Void",
      count: 1,
    });
    GameDispatch({
      type: "TransferToInventory",
      entity: "inserter",
      otherStackKind: "Void",
      count: 1,
    });

    GameDispatch({ type: "PlaceBuilding", entity: kind });

    const nextBuildingIdx = currentRegion.Buildings.length;

    if (buildingIdx === nextBuildingIdx) {
      throw new Error(`Failed to add producer ${kind} for ${recipe}`);
    }
    if (buildingIdx > 0)
      GameDispatch({
        type: "IncreaseInserterCount",
        inserterIdx: buildingIdx - 1,
      });

    GameDispatch({
      type: "ChangeRecipe",
      buildingIdx: buildingIdx,
      recipeId: recipe,
    });
    if (connect.above) upperToggles.push(buildingIdx);
    if (connect.below) lowerToggles.push(buildingIdx);
  });

  lowerToggles.forEach((buildingIdx) => {
    GameDispatch({
      type: "ToggleLowerOutputState",
      buildingIdx: buildingIdx,
    });
    GameDispatch({
      type: "ToggleInserterDirection",
      inserterIdx: buildingIdx,
    });
  });

  upperToggles.forEach((buildingIdx) => {
    GameDispatch({
      type: "ToggleUpperOutputState",
      buildingIdx: buildingIdx,
    });
    GameDispatch({
      type: "ToggleInserterDirection",
      inserterIdx: buildingIdx - 1,
    });
  });
}
const above = true,
  below = true;

(window as unknown as GameWindow).Macro = Macro;
