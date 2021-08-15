import { EntityStack, FillEntityStack, MainBus } from "../types";

import { GameDispatch, ResearchState } from "../factoryGame";
import { RecipeSelector } from "./RecipeSelector";
import { SyntheticEvent, useState } from "react";
import { MainBusConst } from "./uiConstants";
import { availableItems } from "../research";
import { showAddLaneItemSelector } from "./selectors";
import { useIconSelector } from "../IconSelectorProvider";

const entityIconDoubleClickHandler = (
  evt: {
    clientX: number;
    clientY: number;
    shiftKey: boolean;
    //target: { hasOwnProperty(p: string): boolean };
    nativeEvent: { offsetX: number; offsetY: number };
  },
  laneId: number,
  stack: EntityStack
): void => {
  if (evt.shiftKey) {
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
  const selectRecipe = useIconSelector();

  async function addLane(evt: SyntheticEvent) {
    showAddLaneItemSelector(selectRecipe);
    evt.stopPropagation();
  }
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
        <svg>
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
