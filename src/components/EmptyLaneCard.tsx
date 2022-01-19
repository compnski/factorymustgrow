import { useGeneralDialog } from "../GeneralDialogProvider";
import { GameState } from "../useGameState";
import { showPlaceBuildingSelector } from "./selectors";

export function EmptyLaneCard(props: { buildingIdx: number }) {
  const generalDialog = useGeneralDialog();

  return (
    <div className="main-area empty-lane">
      <div className="top-area">
        <div className="title">Empty Lane</div>
      </div>
      <div className="bottom-area">
        <div
          onClick={async () => {
            showPlaceBuildingSelector(
              generalDialog,
              GameState.Inventory,
              props.buildingIdx
            );
          }}
          className="change-recipe clickable build-something"
        >
          Build Something
        </div>
      </div>
    </div>
  );
}
