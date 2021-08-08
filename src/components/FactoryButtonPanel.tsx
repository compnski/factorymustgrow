import { GameAction } from "../factoryGame";
import { UIAction } from "../uiState";

export type FactoryButtonPanelProps = {
  uiDispatch(e: UIAction): void;
  gameDispatch(e: GameAction): void;
};

export function FactoryButtonPanel({
  uiDispatch,
  gameDispatch,
}: FactoryButtonPanelProps) {
  return (
    <div className="factory-button-panel">
      <div
        className="add-producer clickable"
        onClick={(evt) =>
          uiDispatch({
            type: "ShowRecipeSelector",
            evt,
          })
        }
      >
        Add Producer
      </div>
      <div
        className="add-producer clickable"
        onClick={() =>
          gameDispatch({
            type: "NewLab",
          })
        }
      >
        Add Lab
      </div>
      <div
        className="add-producer clickable"
        onClick={(evt) =>
          uiDispatch({
            type: "ShowResearchSelector",
            evt,
          })
        }
      >
        Choose Research
      </div>

      <div
        className="add-producer clickable"
        onClick={() => {
          gameDispatch({
            type: "CompleteResearch",
          });
          uiDispatch({ type: "ShowResearchSelector" });
        }}
      >
        Complete Research (DEBUG)
      </div>

      <div
        className="add-producer clickable"
        onClick={() =>
          uiDispatch({
            type: "ShowDebugInventorySelector",
          })
        }
      >
        Add To Inventory (DEBUG)
      </div>
    </div>
  );
}

/*
 *       <div
 *         className="clickable explore-button"
 *         onClick={() =>
 *           uiDispatch({
 *             type: "OpenExploreGame",
 *           })
 *         }
 * >
 * Explore!
 * </div> */
