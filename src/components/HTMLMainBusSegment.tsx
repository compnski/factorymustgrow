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
    startingSlotIdx: 4,
    length: 3,
    beltDirection: "DOWN",
    endDirection: "RIGHT",
    entity: "copper-plate",
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
  const laneIdxByBeltId: { [key: number]: number } = {};
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

  function shouldRenderSegment(laneIdx: number) {
    const blist = beltsByLane.get(laneIdx);
    if (!blist) return false;
    for (const b of blist) {
      if (
        buildingIdx > b.startingSlotIdx &&
        buildingIdx < b.startingSlotIdx + b.length
      )
        return true;
      if (buildingIdx > b.startingSlotIdx + b.length) return false;
    }
    return false;
  }

  //for (const [_laneId, lane] of mainBus.lanes.entries()) {
  for (let laneId = 1; laneId <= maxLaneId; laneId++) {
    //const stack = lane.Entities();
    const entity = "copper"; //stack.length && stack[0].length ? stack[0][0] : "";
    const md = laneId % 4;
    const dir =
      md == 2 ? "left" : md == 1 ? "down" : md == 0 ? "right" : "stop";
    const flipped = true;
    let inside = <></>;
    if (shouldRenderSegment(laneId)) {
      const top = (
          <div className={`bus-piece top ${dir}`}>
            <span className="belt" />
          </div>
        ),
        bottom = (
          <div className={`bus-piece bottom ${dir}`}>
            <span className="belt" />
          </div>
        );
      inside = (
        <>
          <span
            className={`icon ${entityIconLookup(entity)} ${
              settings.animatedEnabled ? "animate" : ""
            }`}
          />
          {flipped ? [bottom, top] : [top, bottom]}
        </>
      );
    }
    if (entity)
      lanes.push(
        <div className={`bus-lane ${flipped ? "flipped" : ""}`} key={laneId}>
          {inside}
        </div>
      );
  }
  return <div className="new main-bus-segment">{lanes.flat()}</div>;
}
