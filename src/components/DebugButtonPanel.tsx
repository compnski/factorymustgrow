import { GameAction } from "../GameAction";
import { ButtonPanel } from "./ButtonPanel";
import { showMoveItemToFromInventorySelector } from "./selectors";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { useState } from "react";

export type DebugButtonPanelProps = {
  gameDispatch(e: GameAction): void;
};

export function DebugButtonPanel({ gameDispatch }: DebugButtonPanelProps) {
  const generalDialog = useGeneralDialog(),
    autoOpenDebug = window.location.hash.includes("debug"),
    [isOpen, setOpen] = useState<boolean>(autoOpenDebug),
    factoryButtons = [
      {
        clickHandler: () => {
          gameDispatch({
            type: "CompleteResearch",
          });
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
