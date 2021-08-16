import { SyntheticEvent } from "react";
import { GameAction } from "../factoryGame";
import { GameState } from "../useGameState";
import { useIconSelector } from "../IconSelectorProvider";
import { UIAction } from "../uiState";
import { ButtonPanel } from "./ButtonPanel";
import {
  showDebugAddItemSelector,
  showPlaceBuildingSelector,
  showResearchSelector,
} from "./selectors";

export type FactoryButtonPanelProps = {
  uiDispatch(e: UIAction): void;
  gameDispatch(e: GameAction): void;
};

export function FactoryButtonPanel({
  uiDispatch,
  gameDispatch,
}: FactoryButtonPanelProps) {
  const selectRecipe = useIconSelector();
  const factoryButtons = [
    {
      clickHandler: () =>
        showPlaceBuildingSelector(selectRecipe, GameState.Inventory),
      title: "Place Building",
    },

    {
      clickHandler: () => showResearchSelector(selectRecipe),
      title: "Choose Research",
    },

    {
      clickHandler: (evt: SyntheticEvent) =>
        uiDispatch({
          type: "ShowRegionSelector",
          evt,
        }),
      title: "Claim Region",
    },

    {
      clickHandler: () => {
        gameDispatch({
          type: "CompleteResearch",
        });
        uiDispatch({ type: "ShowResearchSelector" });
      },

      title: "Complete Research (DEBUG)",
    },

    {
      clickHandler: () => showDebugAddItemSelector(selectRecipe),
      title: "Add To Inventory (DEBUG)",
    },
  ];

  return (
    <div className="factory-button-panel">
      <ButtonPanel buttons={factoryButtons} />
    </div>
  );
}
