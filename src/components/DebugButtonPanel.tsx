import { GameAction } from "../GameAction";
import { ButtonPanel } from "./ButtonPanel";
import { showMoveItemToFromInventorySelector } from "./selectors";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { useState } from "react";
import { availableItems } from "../research";
import { ReadonlyResearchState } from "../useGameState";
import { DebugInventory, DebugResearch } from "../debug";

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

        title: "Complete Current Research",
      },

      {
        clickHandler: () =>
          showMoveItemToFromInventorySelector(
            generalDialog,
            uxDispatch,
            "TransferToInventory",
            availableItems(researchState)
          ),
        title: "Create Stack in Inventory",
      },
      {
        title: "Switch to DebugInventory",
        clickHandler: () => {
          uxDispatch({
            type: "UpdateState",
            action: {
              kind: "SetProperty",
              address: "global",
              property: "Inventory",
              value: new DebugInventory(),
            },
          });
        },
      },
      {
        title: "Complete ALL Research",
        clickHandler: () => {
          uxDispatch({
            type: "UpdateState",
            action: {
              kind: "SetProperty",
              address: "global",
              property: "Research",
              value: DebugResearch,
            },
          });
        },
      },
    ];

  return (
    <details className="debug-button-panel" open={isOpen}>
      <summary onClick={() => setOpen(!isOpen)}>Debug</summary>
      <div className="button-box">
        <ButtonPanel buttons={factoryButtons} />
        <div
          className="reset-button clickable"
          onDoubleClick={() =>
            uxDispatch({
              type: "Reset",
            })
          }
        >
          Double Click to Reset All
        </div>
      </div>
    </details>
  );
}
