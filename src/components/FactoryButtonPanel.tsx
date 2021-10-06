import { SyntheticEvent } from "react";
import { GameAction } from "../GameAction";
import { GameState } from "../useGameState";
import { UIAction } from "../uiState";
import { ButtonPanel } from "./ButtonPanel";
import {
  showMoveItemToFromInventorySelector,
  showPlaceBuildingSelector,
  showResearchSelector,
  showPlaceBeltLineSelector,
} from "./selectors";
import { useGeneralDialog } from "../GeneralDialogProvider";

export type FactoryButtonPanelProps = {
  uiDispatch(e: UIAction): void;
  gameDispatch(e: GameAction): void;
};

export function FactoryButtonPanel({
  uiDispatch,
  gameDispatch,
}: FactoryButtonPanelProps) {
  const generalDialog = useGeneralDialog();
  const factoryButtons = [
    /* {
       *   clickHandler: () =>
       *     showPlaceBuildingSelector(generalDialog, GameState.Inventory),
       *   title: "Place Building",
       * },

       * {
       *   clickHandler: () => showResearchSelector(generalDialog),
       *   title: "Choose Research",
       * },
       */
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
          generalDialog,
          "TransferToInventory"
        ),
      title: "Add To Inventory (DEBUG)",
    },

    /* {
     *   clickHandler: () =>
     *     showPlaceBeltLineSelector(
     *       generalDialog,
     *       GameState.Inventory,
     *       GameState.Regions
     *     ),
     *   title: "Add Belt Line",
     * }, */
  ];

  return (
    <div className="factory-button-panel">
      <ButtonPanel buttons={factoryButtons} />
    </div>
  );
}
