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
};

const belts = [
  {
    laneIdx: 1,
    startingSlotIdx: 0,
    length: 3,
    beltDirection: "DOWN",
    endDirection: "RIGHT",
  },
  {
    laneIdx: 2,
    startingSlotIdx: 3,
    length: 3,
    beltDirection: "DOWN",
    endDirection: "RIGHT",
  },
];

export function HTMLMainBusSegment({
  mainBus,
  segmentHeight,
  beltConnections = [],
  busLaneClicked = () => void {},
  beltConnectionClicked = () => void {},
}: {
  mainBus: ReadonlyMainBus;
  segmentHeight: number;
  beltConnections?: BeltConnection[];
  busLaneClicked?: (laneId: number, entity: string) => void;
  beltConnectionClicked?: (connectionIdx: number) => void;
}) {
  const lanes = [];
  const laneIdxByBeltId: { [key: number]: number } = {};
  const entityIconLookup = entityIconLookupByKind("MainBus");
  // belts to map?

  for (const [_laneId, lane] of mainBus.lanes.entries()) {
    const stack = lane.Entities();
    const entity = stack.length && stack[0].length ? stack[0][0] : "";
    const md = _laneId % 4;
    const dir =
      md == 2 ? "left" : md == 1 ? "down" : md == 0 ? "right" : "stop";
    const flipped = true;
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

    if (entity)
      lanes.push(
        <div className={`bus-lane ${flipped ? "flipped" : ""}`} key={_laneId}>
          <span
            className={`icon ${entityIconLookup(entity)} ${
              settings.animatedEnabled ? "animate" : ""
            }`}
          />

          {flipped ? [bottom, top] : [top, bottom]}
        </div>
      );
  }
  return <div className="new main-bus-segment">{lanes.flat()}</div>;
}
