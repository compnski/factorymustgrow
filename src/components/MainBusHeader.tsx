import { EntityStack, FillEntityStack, MainBus } from "../types";

import { GameDispatch, ResearchState } from "../factoryGame";
import { RecipeSelector } from "./RecipeSelector";
import { SyntheticEvent, useState } from "react";
import { MainBusSegment } from "./MainBusSegment";
import { MainBusConst } from "./uiConstants";
import { availableRecipes } from "../research";

const entityIconDoubleClickHandler = (
  evt: {
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    //target: { hasOwnProperty(p: string): boolean };
    nativeEvent: { offsetX: number; offsetY: number };
  },
  laneId: number,
  stack: EntityStack
): void => {
  if (evt.ctrlKey) {
    FillEntityStack(stack, 1);
    return;
  }
  const clickY = evt.nativeEvent.offsetY;
  if (clickY < 20) {
    GameDispatch({
      type: "TransferFromInventory",
      entity: stack.Entity,
      otherStackKind: "MainBus",
      laneId,
    });
  }

  if (clickY > 30) {
    GameDispatch({
      type: "TransferToInventory",
      entity: stack.Entity,
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
  const [showItemSelector, setShowItemSelector] = useState(false);

  const addLane = (evt: SyntheticEvent) => {
    setShowItemSelector(true);
    evt.stopPropagation();
  };
  const addMainBusLane = (evt: SyntheticEvent, entity: string) => {
    mainBus.AddLane(entity);
    setShowItemSelector(false);
  };
  const lanes = [];
  for (var entry of mainBus.lanes.entries()) {
    const [laneId, lane] = entry;
    lanes.push(
      <div
        onDoubleClick={(evt) => entityIconDoubleClickHandler(evt, laneId, lane)}
        key={laneId}
        className="lane-header-item-stack"
      >
        <div className={`icon ${lane.Entity}`} />
        <div className="item-stack-count-text">
          <span>{lane.Count}</span>
        </div>
      </div>
    );
  }

  /* <text key={laneId} className="belt-count" x={laneX} y={20}>
        {lane.Count}
        </text> */

  const busLaneClicked = (laneId: number) => {
    mainBus.RemoveLane(laneId);
  };

  return (
    <div className="mainBusHeader" onClick={() => setShowItemSelector(false)}>
      <div onClick={addLane} className="clickable addLaneButton">
        Add Lane
      </div>
      {showItemSelector
        ? RecipeSelector({
            recipes: availableRecipes(researchState),
            onClick: addMainBusLane,
          })
        : null}
      <div style={{ width: 400, height: 100 }}>
        <div className="lane-header-counts">{lanes}</div>
        <MainBusSegment
          segmentHeight={70}
          mainBus={mainBus}
          busLaneClicked={busLaneClicked}
        />
      </div>
    </div>
  );
};
