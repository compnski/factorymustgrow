import { SyntheticEvent } from "react";
import { GameAction, GameDispatch, GameState } from "../factoryGame";
import { IconSelectorConfig, useIconSelector } from "../IconSelectorProvider";
import {
  availableItems,
  availableRecipes,
  availableResearch,
} from "../research";
import { UIAction } from "../uiState";
import { ButtonPanel } from "./ButtonPanel";
import {
  showAddProducerSelector,
  showDebugAddItemSelector,
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
  // ...
  const selectRecipe = useIconSelector();
  const factoryButtons = [
    {
      clickHandler: () =>
        gameDispatch({
          type: "NewLab",
        }),
      title: "Add Lab",
    },
    {
      clickHandler: () => showResearchSelector(selectRecipe),
      /* uiDispatch({
       *     type: "ShowResearchSelector",
       *     evt,
       * }), */
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
    {
      clickHandler: () => showAddProducerSelector(selectRecipe),
      title: "Add Producer",
    },
  ];

  return (
    <div className="factory-button-panel">
      <ButtonPanel buttons={factoryButtons} />
    </div>
  );
}
