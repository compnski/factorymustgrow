import { ItemBuffer, NewEntityStack } from "../types";
import { GameDispatch } from "../GameDispatch";
import { ResearchState } from "../useGameState";
import { SyntheticEvent } from "react";
import { MainBusConst } from "./uiConstants";
import { showAddLaneItemSelector } from "./selectors";
import { MainBus } from "../mainbus";
import { useGeneralDialog } from "../GeneralDialogProvider";

const entityIconDoubleClickHandler = (
  evt: {
    clientX: number;
    clientY: number;
    shiftKey: boolean;
    //target: { hasOwnProperty(p: string): boolean };
    nativeEvent: { offsetX: number; offsetY: number };
  },
  laneId: number,
  entity: string,
  lane: ItemBuffer
): void => {
  if (evt.shiftKey) {
    lane.Add(NewEntityStack(entity, 1));
    return;
  }
  const clickY = evt.nativeEvent.offsetY;
  if (clickY < 20) {
    GameDispatch({
      type: "TransferFromInventory",
      entity: entity,
      otherStackKind: "MainBus",
      laneId,
    });
  }

  if (clickY > 30) {
    GameDispatch({
      type: "TransferToInventory",
      entity: entity,
      otherStackKind: "MainBus",
      laneId,
    });
  }
};

export const MainBusHeader = ({
  mainBus,
  researchState,
}: {
  mainBus: MainBus;
  researchState: ResearchState;
}) => {
  const generalDialog = useGeneralDialog();

  async function addLane(evt: SyntheticEvent) {
    showAddLaneItemSelector(generalDialog);
    evt.stopPropagation();
  }
  const lanes = [];
  for (var entry of mainBus.lanes.entries()) {
    const [laneId, lane] = entry,
      entity = lane.Entities()[0][0],
      count = lane.Count(entity);
    lanes.push(
      <div
        onDoubleClick={(evt) =>
          entityIconDoubleClickHandler(evt, laneId, entity, lane)
        }
        key={laneId}
        className="lane-header-item-stack"
      >
        <div className={`icon ${entity}`} />
        <div className="item-stack-count-text">
          <span>{count}</span>
        </div>
      </div>
    );
  }

  const busLaneClicked = (laneId: number) => {
    GameDispatch({
      type: "RemoveLane",
      laneId: laneId,
    });
  };

  return (
    <div className="main-bus-header">
      <div onClick={addLane} className="clickable add-lane-button">
        Add Lane
      </div>
      <div style={{ width: 400, height: 100 }}>
        <div className="lane-header-counts">{lanes}</div>
        <svg width="400">
          {[...mainBus.lanes.entries()].map(([laneId], idx) => {
            const laneX =
              MainBusConst.laneOffset +
              idx * (MainBusConst.laneWidth + MainBusConst.interLaneWidth);
            return (
              <rect
                key={laneId}
                width={MainBusConst.laneWidth}
                height={50}
                x={laneX}
                fill="black"
                onDoubleClick={() => busLaneClicked(laneId)}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};
