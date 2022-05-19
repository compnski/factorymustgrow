import { SyntheticEvent, useState } from "react";
import { ReadonlyMainBus } from "../mainbus";
import { settings } from "../settings";
import { Belt, BeltConnection, BeltHandlerFunc } from "../types";
import { entityIconLookupByKind } from "../utils";

import "./MainBusSegment.scss";

export function HTMLMainBusSegment({
  mainBus,
  buildingIdx,
  beltState,
  beltHandler,
  segmentHeight,
  beltConnections = [],
  busLaneClicked = () => void {},
  beltConnectionClicked = () => void {},
}: {
  mainBus: ReadonlyMainBus;
  buildingIdx: number;
  segmentHeight: number;
  beltConnections?: BeltConnection[];
  busLaneClicked?: (laneId: number, entity: string) => void;
  beltConnectionClicked?: (connectionIdx: number) => void;
  beltHandler: BeltHandlerFunc;
  beltState: Belt[];
}) {
  const lanes = [];
  const entityIconLookup = entityIconLookupByKind("MainBus");
  // belts to map?

  const beltsByLane = new Map<number, Belt[]>();
  let maxLaneId = 8; // TODO: Read from region
  beltState.forEach((belt) => {
    maxLaneId = Math.max(maxLaneId, belt.laneIdx);
    beltsByLane.set(
      belt.laneIdx,
      (beltsByLane.get(belt.laneIdx) || [])
        .concat([belt])
        .sort((a, b) => b.startingSlotIdx - a.startingSlotIdx)
    );
  });

  function beltSegment(laneIdx: number): Belt | false {
    const blist = beltsByLane.get(laneIdx);
    if (!blist) return false;
    for (const b of blist) {
      if (
        buildingIdx >= b.startingSlotIdx &&
        buildingIdx < b.startingSlotIdx + b.length
      )
        return b;
      if (buildingIdx > b.startingSlotIdx + b.length) return false;
    }
    return false;
  }

  function beltDirection(buildingIdx: number, belt: Belt): string {
    if (belt.beltDirection == "DOWN")
      return buildingIdx < belt.startingSlotIdx + belt.length - 1
        ? "down"
        : belt.endDirection.toLowerCase();
    else
      return buildingIdx != belt.startingSlotIdx
        ? "down"
        : belt.endDirection.toLowerCase();
  }

  //for (const [_laneId, lane] of mainBus.lanes.entries()) {
  for (let laneId = 1; laneId <= maxLaneId; laneId++) {
    //const stack = lane.Entities();

    let inside = <></>;
    const belt = beltSegment(laneId);
    if (belt) {
      const entity = belt.entity;
      const flipped = belt.beltDirection == "UP";

      const dir = beltDirection(buildingIdx, belt);
      const top = (
          <div key="top" className={`bus-piece top ${dir}`}>
            <span className="belt" />
          </div>
        ),
        bottom = (
          <div key="bottom" className={`bus-piece bottom ${dir}`}>
            <span className="belt" />
          </div>
        );
      inside = (
        <span>
          <span
            className={`icon ${entityIconLookup(entity)} ${
              settings.animatedEnabled ? "animate" : ""
            }`}
          />

          {flipped ? [bottom, top] : [top, bottom]}
        </span>
      );

      lanes.push(
        <div
          onMouseDown={(e) => beltHandler(e, "down", laneId, buildingIdx)}
          onMouseUp={(e) => beltHandler(e, "up", laneId, buildingIdx)}
          //onMouseLeave={(e) => beltHandler(e,"leave", laneId, buildingIdx)}
          onMouseEnter={(e) => beltHandler(e, "enter", laneId, buildingIdx)}
          className={`bus-lane ${flipped ? "flipped" : ""}`}
          key={`${belt.startingSlotIdx}-${laneId}`}
        >
          {inside}
        </div>
      );
    } else {
      lanes.push(
        <div
          className={`bus-lane`}
          key={laneId}
          onMouseDown={(e) => beltHandler(e, "down", laneId, buildingIdx)}
          onMouseUp={(e) => beltHandler(e, "up", laneId, buildingIdx)}
          //onMouseLeave={(e) => beltHandler(e,"leave", laneId, buildingIdx)}
          onMouseEnter={(e) => beltHandler(e, "enter", laneId, buildingIdx)}
        />
      );
    }
  }
  return <div className="new main-bus-segment">{lanes.flat()}</div>;
}
