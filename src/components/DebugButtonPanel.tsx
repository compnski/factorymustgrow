import { GameAction } from "../GameAction";
import { ButtonPanel } from "./ButtonPanel";
import { showMoveItemToFromInventorySelector } from "./selectors";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { useState } from "react";
import { availableItems } from "../research";
import { ReadonlyResearchState } from "../useGameState";

export type DebugButtonPanelProps = {
  researchState: ReadonlyResearchState;
  uxDispatch: (a: GameAction) => void;
};

export function DebugButtonPanel({
  researchState,
  uxDispatch,
}: DebugButtonPanelProps) {
  const generalDialog = useGeneralDialog(),
    autoOpenDebug = window.location.hash.includes("debug"),
    [isOpen, setOpen] = useState<boolean>(autoOpenDebug),
    factoryButtons = [
      {
        clickHandler: () => {
          uxDispatch({
            type: "CompleteResearch",
          });
        },

        title: "Complete Research (DEBUG)",
      },

      {
        clickHandler: () =>
          showMoveItemToFromInventorySelector(
            generalDialog,
            uxDispatch,
            "TransferToInventory",
            availableItems(researchState)
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
          uxDispatch({
            type: "Reset",
          })
        }
      >
        Double Click to Reset All Data
      </div>
    </details>
  );
}
