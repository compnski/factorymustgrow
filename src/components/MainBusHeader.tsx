import { SyntheticEvent } from "react";
import { GameDispatch } from "../GameDispatch";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { ReadonlyMainBus } from "../mainbus";
import { availableItems } from "../research";
import { ReadonlyResearchState } from "../useGameState";
import { showUserError } from "../utils";
import { showAddLaneItemSelector } from "./selectors";
import { MainBusConst } from "./uiConstants";

const entityIconDoubleClickHandler = (
  evt: {
    clientX: number;
    clientY: number;
    shiftKey: boolean;
    //target: { hasOwnProperty(p: string): boolean };
    nativeEvent: { offsetX: number; offsetY: number };
  },
  regionId: string,
  laneId: number,
  entity: string
): void => {
  const clickY = evt.nativeEvent.offsetY;
  if (clickY < 20) {
    GameDispatch({
      type: "TransferFromInventory",
      entity: entity,
      regionId,
      otherStackKind: "MainBus",
      laneId,
    });
  }

  if (clickY > 30) {
    GameDispatch({
      type: "TransferToInventory",
      entity: entity,
      regionId,
      otherStackKind: "MainBus",
      laneId,
    });
  }
};

export const MainBusHeader = ({
  mainBus,
  regionId,
  researchState,
}: {
  mainBus: ReadonlyMainBus;
  regionId: string;
  researchState: ReadonlyResearchState;
}) => {
  const generalDialog = useGeneralDialog();

  async function addLane(evt: SyntheticEvent) {
    if (mainBus.CanAddLane()) {
      void showAddLaneItemSelector(
        generalDialog,
        regionId,
        availableItems(researchState)
      );
    } else {
      showUserError("Out of lane capacity");
    }
    evt.stopPropagation();
  }
  const lanes = [];
  for (const entry of mainBus.lanes.entries()) {
    const [laneId, lane] = entry,
      entity = lane.Entities()[0][0],
      count = lane.Count(entity);
    lanes.push(
      <div
        onDoubleClick={(evt) =>
          entityIconDoubleClickHandler(evt, regionId, laneId, entity)
        }
        key={laneId}
        className="lane-header-item-stack"
      >
        <title>${entity}</title>
        <div className={`icon ${entity}`} />
        <div className="item-stack-count-text">
          <span>{count}</span>
        </div>
      </div>
    );
  }

  lanes.push(
    <div key="add-new" className="add-new" onClick={addLane} title="Add Lane">
      <span className="material-icons">add_circle_outline</span>
      {lanes.length === 0 && <div>Add Lane</div>}
    </div>
  );

  const busLaneClicked = (laneId: number) => {
    GameDispatch({
      type: "RemoveLane",
      laneId: laneId,
      regionId,
    });
  };

  return (
    <div className="main-bus-header">
      {/* <div onClick={addLane} className="clickable add-lane-button">
              Add Lane
              </div> */}
      <div className="bus-area">
        <div className="lane-header-counts">{lanes}</div>
        <svg width="400">
          <filter id="dropshadowSide" filterUnits="userSpaceOnUse">
            <feOffset result="offOut" in="SourceAlpha" dx="2" dy="1" />
            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>

          {[...mainBus.lanes.entries()].map(([laneId, lane], idx) => {
            const laneX =
                MainBusConst.laneOffset +
                idx * (MainBusConst.laneWidth + MainBusConst.interLaneWidth),
              segmentHeight = 66,
              entity = lane.Entities()[0][0];

            return (
              <polyline
                key={laneId}
                x={laneId}
                fill="#3F4952"
                stroke="#222"
                onDoubleClick={() => busLaneClicked(laneId)}
                filter="url(#dropshadowSide)"
                points={`${laneX},0 ${laneX},${segmentHeight + 2} ${
                  laneX + MainBusConst.laneWidth
                },${segmentHeight + 2} ${laneX + MainBusConst.laneWidth},0`}
              >
                {" "}
                <title>${entity}</title>
              </polyline>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
