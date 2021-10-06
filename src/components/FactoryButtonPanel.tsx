import { SyntheticEvent } from "react";
import { GameDispatch } from "../factoryGame";
import { GameAction } from "../GameAction";
import { GameState } from "../useGameState";
import { useIconSelector } from "../IconSelectorProvider";
import { UIAction } from "../uiState";
import { ButtonPanel } from "./ButtonPanel";
import {
  showMoveItemToFromInventorySelector,
  showPlaceBuildingSelector,
  showResearchSelector,
} from "./selectors";
import {
  GeneralDialogConfig,
  useGeneralDialog,
} from "../GeneralDialogProvider";
import { Inventory } from "../inventory";
import { PlaceBeltLinePanel } from "./PlaceBeltLinePanel";
import { Region } from "../types";

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
      clickHandler: () =>
        showMoveItemToFromInventorySelector(
          iconSelector,
          "TransferToInventory"
        ),
      title: "Add To Inventory (DEBUG)",
    },

    {
      clickHandler: () =>
        showPlaceBeltLineSelector(
          generalDialog,
          GameState.Inventory,
          GameState.Regions
        ),
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
  inventory: Inventory,
  regions: Map<string, Region>
) {
  const result = await showDialog({
    title: "Place Belt Line",
    component: (onConfirm) => (
      <PlaceBeltLinePanel
        title="Place Belt Line"
        inventory={inventory}
        regions={regions}
        onConfirm={onConfirm}
      />
    ),
  });
  if (result) {
    const [targetRegion, beltType] = result;
    GameDispatch({
      type: "PlaceBeltLine",
      targetRegion,
      entity: beltType,
      beltLength: 100,
    });
  }
}
