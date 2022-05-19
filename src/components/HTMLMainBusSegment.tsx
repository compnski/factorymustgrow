import { ReadonlyMainBus } from "../mainbus";
import { settings } from "../settings";
import { BeltConnection } from "../types";
import { entityIconLookupByKind } from "../utils";

import "./MainBusSegment.scss";

type Belt = {
  laneIdx: number;
  startingSlotIdx: number; // Upper slot
  length: number;
  beltDirection: "UP" | "DOWN";
  endDirection: "LEFT" | "RIGHT" | "NONE";
  entity: string;
};

const belts: Belt[] = [
  {
    laneIdx: 2,
    startingSlotIdx: 0,
    length: 3,
    beltDirection: "DOWN",
    endDirection: "RIGHT",
    entity: "copper-ore",
  },
  {
    laneIdx: 4,
    startingSlotIdx: 1,
    length: 3,
    beltDirection: "DOWN",
    endDirection: "LEFT",
    entity: "copper-plate",
  },
  {
    laneIdx: 5,
    startingSlotIdx: 1,
    length: 4,
    beltDirection: "UP",
    endDirection: "LEFT",
    entity: "copper-plate",
  },
  {
    laneIdx: 1,
    startingSlotIdx: 2,
    length: 4,
    beltDirection: "UP",
    endDirection: "RIGHT",
    entity: "automation-science-pack",
  },
  {
    laneIdx: 3,
    startingSlotIdx: 5,
    length: 4,
    beltDirection: "UP",
    endDirection: "NONE",
    entity: "iron-plate",
  },
  {
    laneIdx: 6,
    startingSlotIdx: 3,
    length: 4,
    beltDirection: "DOWN",
    endDirection: "NONE",
    entity: "transport-belt",
  },
];

export function HTMLMainBusSegment({
  mainBus,
  buildingIdx,
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
}) {
  const lanes = [];
  const entityIconLookup = entityIconLookupByKind("MainBus");
  // belts to map?

  const beltsByLane = new Map<number, Belt[]>();
  let maxLaneId = 0;
  belts.forEach((belt) => {
    maxLaneId = Math.max(maxLaneId, belt.laneIdx);
    beltsByLane.set(
      belt.laneIdx,
      (beltsByLane.get(belt.laneIdx) || [])
        .concat([belt])
        .sort((a, b) => a.startingSlotIdx - b.startingSlotIdx)
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
          onClick={() => console.log("clicked", laneId, buildingIdx)}
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
          onClick={() => console.log("empty clicked", laneId, buildingIdx)}
        />
      );
    }
  }
  return <div className="new main-bus-segment">{lanes.flat()}</div>;
}
