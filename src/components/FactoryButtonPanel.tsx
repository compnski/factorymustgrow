import { SyntheticEvent } from "react";
import { GameAction, GameDispatch } from "../factoryGame";
import { GameState } from "../useGameState";
import { useIconSelector } from "../IconSelectorProvider";
import { UIAction } from "../uiState";
import { ButtonPanel } from "./ButtonPanel";
import {
  showDebugAddItemSelector,
  showPlaceBuildingSelector,
  showResearchSelector,
} from "./selectors";
import {
  GeneralDialogConfig,
  useGeneralDialog,
} from "../GeneralDialogProvider";
import { Inventory } from "../inventory";
import { PlaceBeltLinePanel } from "./PlaceBeltLinePanel";

export type FactoryButtonPanelProps = {
  uiDispatch(e: UIAction): void;
  gameDispatch(e: GameAction): void;
};

export function FactoryButtonPanel({
  uiDispatch,
  gameDispatch,
}: FactoryButtonPanelProps) {
  const iconSelector = useIconSelector();
  const generalDialog = useGeneralDialog();
  const factoryButtons = [
    {
      clickHandler: () =>
        showPlaceBuildingSelector(iconSelector, GameState.Inventory),
      title: "Place Building",
    },

    {
      clickHandler: () => showResearchSelector(iconSelector),
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
      clickHandler: () => showDebugAddItemSelector(iconSelector),
      title: "Add To Inventory (DEBUG)",
    },

    {
      clickHandler: () =>
        showPlaceBeltLineSelector(generalDialog, GameState.Inventory),
      title: "Add Belt Line",
    },
  ];

  return (
    <div className="factory-button-panel">
      <ButtonPanel buttons={factoryButtons} />
    </div>
  );
}

export async function showPlaceBeltLineSelector(
  showDialog: (c: GeneralDialogConfig) => Promise<any[] | false>,
  inventory: Inventory
) {
  const result = await showDialog({
    title: "Place Belt Line",
    component: (onConfirm) => (
      <PlaceBeltLinePanel
        title="Place Belt Line"
        inventory={inventory}
        onConfirm={onConfirm}
      />
    ),
  });
  if (result) {
    const [targetRegion, beltType] = result;
    console.log(result);
    console.log(targetRegion, beltType);
  }
}
