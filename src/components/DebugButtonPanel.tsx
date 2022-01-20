import { GameAction } from "../GameAction";
import { UIAction } from "../uiState";
import { ButtonPanel } from "./ButtonPanel";
import { showMoveItemToFromInventorySelector } from "./selectors";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { useState } from "react";

export type DebugButtonPanelProps = {
  uiDispatch(e: UIAction): void;
  gameDispatch(e: GameAction): void;
};

export function DebugButtonPanel({
  uiDispatch,
  gameDispatch,
}: DebugButtonPanelProps) {
  const generalDialog = useGeneralDialog(),
    autoOpenDebug = window.location.hash.includes("debug"),
    [isOpen, setOpen] = useState<boolean>(autoOpenDebug),
    factoryButtons = [
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
    ];

  return (
    <details className="debug-button-panel" open={isOpen}>
      <summary onClick={() => setOpen(!isOpen)}>Debug</summary>
      <ButtonPanel buttons={factoryButtons} />
      <div
        className="reset-button clickable"
        onDoubleClick={() =>
          gameDispatch({
            type: "Reset",
          })
        }
      >
        Double Click to Reset All Data
      </div>
    </details>
  );
}
