import { useGeneralDialog } from "../GeneralDialogProvider";
import { GameStateFunc } from "../state/FactoryGameState";
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
          onClick={() => {
            void showPlaceBuildingSelector(
              generalDialog,
              GameStateFunc().Inventory,
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
