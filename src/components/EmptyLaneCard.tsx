import { useGeneralDialog } from "../GeneralDialogProvider";
import { GameState } from "../useGameState";
import { showPlaceBuildingSelector } from "./selectors";

export function EmptyLaneCard(props: {
  regionId: string;
  buildingIdx: number;
}) {
  const generalDialog = useGeneralDialog();

  return (
    <div className="main-area empty-lane">
      <div className="top-area">
        <div className="title">Empty Lane</div>
      </div>
      <div className="bottom-area">
        <div
          onClick={() => {
            void showPlaceBuildingSelector(
              generalDialog,
              GameState.Inventory,
              props.regionId,
              props.buildingIdx
            );
          }}
          className="building-card-button  clickable"
        >
          Build Something
        </div>
      </div>
    </div>
  );
}
