import { SyntheticEvent } from "react";
import { GameAction } from "../factoryGame";
import { UIAction } from "../uiState";
import { ButtonPanel } from "./ButtonPanel";

export type PlaceBuildingPanelProps = {
  uiDispatch(e: UIAction): void;
  gameDispatch(e: GameAction): void;
};

export function PlaceBuildingPanel({
  uiDispatch,
  gameDispatch,
}: PlaceBuildingPanelProps) {
  const factoryButtons = [
    {
      clickHandler: () =>
        gameDispatch({
          type: "AddBuilding",
          kind: "Lab",
          subkind: "",
        }),
      title: "Add Lab",
    },
    {
      clickHandler: () =>
        gameDispatch({
          type: "AddBuilding",
          kind: "Extractor",
          subkind: "electric-mining-drill",
        }),
      title: "Add Miner",
    },
    {
      clickHandler: () =>
        gameDispatch({
          type: "AddBuilding",
          kind: "Factory",
          subkind: "assembling-machine-1",
        }),
      title: "Add Factory",
    },
    {
      clickHandler: () =>
        gameDispatch({
          type: "AddBuilding",
          kind: "Factory",
          subkind: "stone-furnace",
        }),
      title: "Add Smelter",
    },
    {
      clickHandler: () =>
        gameDispatch({
          type: "AddBuilding",
          kind: "Chest",
          subkind: "iron-chest",
        }),
      title: "Add Chest",
    },
    {
      clickHandler: () =>
        gameDispatch({
          type: "AddBuilding",
          kind: "BeltLine",
          subkind: "yellow-belt",
        }),
      title: "Add Belt Line",
    },
  ];

  return (
    <div className="place-building-panel">
      <ButtonPanel buttons={factoryButtons} />
    </div>
  );
}
