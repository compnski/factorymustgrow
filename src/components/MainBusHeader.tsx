import { MainBus } from "../types";

import { GameState } from "../factoryGame";
import { RecipeSelector } from "./RecipeSelector";
import { SyntheticEvent, useState } from "react";
import { MainBusSegment } from "./MainBusSegment";
import { MainBusConst } from "./uiConstants";
import { availableRecipes } from "../research";

export const MainBusHeader = (props: { mainBus: MainBus }) => {
  const [showItemSelector, setShowItemSelector] = useState(false);

  const addLane = (evt: SyntheticEvent) => {
    setShowItemSelector(true);
    evt.stopPropagation();
  };
  const addMainBusLane = (evt: SyntheticEvent, entity: string) => {
    props.mainBus.AddLane(entity);
    setShowItemSelector(false);
  };
  const lanes = [];
  var idx = 0;
  for (var [laneId, lane] of props.mainBus.lanes.entries()) {
    const laneX =
      MainBusConst.laneOffset +
      idx * (MainBusConst.laneWidth + MainBusConst.interLaneWidth);
    lanes.push(
      <text key={laneId} className="belt-count" x={laneX} y={20}>
        {lane.Count}
      </text>
    );
    idx++;
  }

  const busLaneClicked = (laneId: number) => {
    props.mainBus.RemoveLane(laneId);
  };

  return (
    <div className="mainBusHeader" onClick={() => setShowItemSelector(false)}>
      <div onClick={addLane} className="clickable addLaneButton">
        Add Lane
      </div>
      {showItemSelector
        ? RecipeSelector({
            recipes: availableRecipes(GameState.Research),
            onClick: addMainBusLane,
          })
        : null}
      <div style={{ width: 400, height: 100 }}>
        <svg width={400} height={30}>
          {lanes}
        </svg>
        <MainBusSegment
          segmentHeight={70}
          mainBus={props.mainBus}
          busLaneClicked={busLaneClicked}
        />
      </div>
    </div>
  );
};
