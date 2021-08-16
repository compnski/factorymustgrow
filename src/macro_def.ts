import { GameDispatch } from "./factoryGame";
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
    { name: "iron-ore", connect: { below } },
    { name: "iron-plate", connect: { below } },
    { name: "iron-gear-wheel", connect: { below } },
    { name: "automation-science-pack" },
    { name: "copper-plate", connect: { above } },
    { name: "copper-ore", connect: { above } },
  ]);
  return null;
}

function addProducers(
  producerList: {
    name: string;
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
  producerList.forEach(({ name, connect = {} }) => {
    const buildingIdx = currentRegion.Buildings.length;

    GameDispatch({ type: "NewProducer", producerName: name });

    const nextBuildingIdx = currentRegion.Buildings.length;

    if (buildingIdx === nextBuildingIdx) {
      throw new Error(`Failed to add producer ${name}`);
    }

    GameDispatch({
      type: "IncreaseProducerCount",
      buildingIdx: buildingIdx,
    });
    if (connect.above) upperToggles.push(buildingIdx);
    if (connect.below) lowerToggles.push(buildingIdx);
  });

  lowerToggles.forEach((buildingIdx) => {
    GameDispatch({
      type: "ToggleLowerOutputState",
      buildingIdx: buildingIdx,
    });
  });

  upperToggles.forEach((buildingIdx) => {
    GameDispatch({
      type: "ToggleUpperOutputState",
      buildingIdx: buildingIdx,
    });
  });
}
const above = true,
  below = true;

(window as unknown as GameWindow).Macro = Macro;
