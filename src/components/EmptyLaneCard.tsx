import { useIconSelector } from "../IconSelectorProvider";
import { GameState } from "../useGameState";
import { showPlaceBuildingSelector } from "./selectors";

export function EmptyLaneCard(props: { buildingIdx: number }) {
  const iconSelector = useIconSelector();

  return (
    <div className="main-area">
      <div className="top-area">
        <div className="title">Empty Lane</div>
      </div>
      <div className="bottom-area">
        <div
          onClick={async () => {
            showPlaceBuildingSelector(
              iconSelector,
              GameState.Inventory,
              props.buildingIdx
            );
          }}
          className="change-recipe clickable"
        >
          Build Something
        </div>
      </div>
    </div>
  );
}
