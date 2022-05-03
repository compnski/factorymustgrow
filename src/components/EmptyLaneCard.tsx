import { GameAction } from "../GameAction";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { ImmutableMap } from "../immutable";
import { Region } from "../types";
import { ReadonlyItemBuffer } from "../useGameState";
import { showPlaceBuildingSelector } from "./selectors";

export function EmptyLaneCard(props: {
  regionId: string;
  buildingIdx: number;
  inventory: ReadonlyItemBuffer;
  uxDispatch: (a: GameAction) => void;
  regions: ImmutableMap<string, Region>;
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
              props.uxDispatch,
              props.inventory,
              props.regionId,
              props.buildingIdx,
              props.regions
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
