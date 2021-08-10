import { SyntheticEvent } from "react";
import { GameAction } from "../factoryGame";
import { UIAction } from "../uiState";
import { ButtonPanel } from "./ButtonPanel";

export type FactoryButtonPanelProps = {
  uiDispatch(e: UIAction): void;
  gameDispatch(e: GameAction): void;
};

export function FactoryButtonPanel({
  uiDispatch,
  gameDispatch,
}: FactoryButtonPanelProps) {
  const factoryButtons = [
    {
      clickHandler: () =>
        gameDispatch({
          type: "NewLab",
        }),
      title: "Add Lab",
    },
    {
      clickHandler: (evt: SyntheticEvent) =>
        uiDispatch({
          type: "ShowResearchSelector",
          evt,
        }),
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
      clickHandler: () =>
        uiDispatch({
          type: "ShowDebugInventorySelector",
        }),
      title: "Add To Inventory (DEBUG)",
    },
    {
      clickHandler: (evt: SyntheticEvent) =>
        uiDispatch({
          type: "ShowRecipeSelector",
          evt,
        }),
      title: "Add Producer",
    },
  ];

  return (
    <div className="factory-button-panel">
      <ButtonPanel buttons={factoryButtons} />
    </div>
  );
}
