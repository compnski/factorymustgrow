import { settings } from "../settings";
import { BeltConnectionAddress } from "../state/address";
import { Belt, BeltConnection, BeltHandlerFunc, NewMainBus } from "../types";
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
  mainBus: NewMainBus;
  buildingIdx: number;
  segmentHeight: number;
  beltConnections?: { laneId?: number; isGhost?: boolean }[];
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
        .sort((a, b) => b.upperSlotIdx - a.upperSlotIdx)
    );
  });

  function beltSegment(laneIdx: number): Belt | false {
    const blist = beltsByLane.get(laneIdx);
    if (!blist) return false;
    for (const b of blist) {
      if (buildingIdx >= b.upperSlotIdx && buildingIdx <= b.lowerSlotIdx)
        return b;
      if (buildingIdx > b.lowerSlotIdx) return false;
    }
    return false;
  }

  function beltDirection(buildingIdx: number, belt: Belt): string {
    if (belt.beltDirection == "DOWN")
      return buildingIdx < belt.lowerSlotIdx
        ? "down"
        : belt.endDirection.toLowerCase();
    else
      return buildingIdx != belt.upperSlotIdx
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
          onMouseDown={(e) =>
            beltHandler(e, "down", laneId, buildingIdx, belt.upperSlotIdx)
          }
          onMouseUp={(e) =>
            beltHandler(e, "up", laneId, buildingIdx, belt.upperSlotIdx)
          }
          //onMouseLeave={(e) => beltHandler(e,"leave", laneId, buildingIdx,belt.startingSlotIdx)}
          onMouseEnter={(e) =>
            beltHandler(e, "enter", laneId, buildingIdx, belt.upperSlotIdx)
          }
          onDoubleClick={(e) => [
            console.log(e),
            busLaneClicked(laneId, "copper-ore"),
          ]}
          onContextMenu={(e) => beltHandler(e, "cancel", -1, -1)}
          className={`bus-lane ${flipped ? "flipped" : ""} ${
            belt.isGhost ? "ghost" : ""
          }`}
          key={`${belt.upperSlotIdx}-${laneId}`}
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
          onContextMenu={(e) => beltHandler(e, "cancel", -1, -1)}
        />
      );
    }
  }

  return (
    <div className="new main-bus-segment">
      <div className="belt-connections">
        {beltConnections.map((b, idx) => {
          if (!b.laneId) return undefined;
          const style = {
            top: idx * 30,
            width: 25 + (b.laneId - 1) * 35,
          };
          return (
            <div
              key={`${idx}-${b.laneId}`}
              style={style}
              className={`belt-connection ${b.isGhost ? "ghost" : ""}`}
              onDoubleClick={() => beltConnectionClicked(idx)}
            />
          );
        })}
      </div>
      {lanes.flat()}
    </div>
  );
}
