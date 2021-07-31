import { BeltConnection, MainBus } from "../types";
import { Icon } from "../svgIcons";
import { MainBusConst } from "./constants";

const connectionHeight = 5,
  connectionOffset = 20,
  interConnectionHeight = 7;

const Chevron = () => <path d="M0 0 10 0 20 10 10 20 0 20 10 10Z" />;

const chevronOffset = 8,
  interChevronWidth = MainBusConst.interLaneWidth + MainBusConst.laneWidth;

const getPath = (
  y: number,
  laneIdx: number,
  maxX: number,
  reverse: boolean
): string => {
  const pathSteps = [[0, y]];
  for (var i = 0; i <= laneIdx; i++) {
    pathSteps.push([chevronOffset + i * interChevronWidth, y]);
  }
  pathSteps.push([maxX + MainBusConst.laneWidth, y]);

  const p = "M" + (reverse ? pathSteps.reverse() : pathSteps).flat().join(" ");

  return p;
};

export function MainBusSegment({
  mainBus,
  segmentHeight,
  beltConnections = [],
  busLaneClicked = () => void {},
  beltConnectionClicked = () => void {},
}: {
  mainBus: MainBus;
  segmentHeight: number;
  beltConnections?: BeltConnection[];
  busLaneClicked?: (laneId: number, entity: string) => void;
  beltConnectionClicked?: (laneId: number) => void;
}) {
  const lanes = [];
  var idx = 0;
  const laneIdxByBeltId: { [key: number]: number } = {};

  for (var [id, lane] of mainBus.lanes.entries()) {
    const laneX =
      MainBusConst.laneOffset +
      idx * (MainBusConst.laneWidth + MainBusConst.interLaneWidth);
    laneIdxByBeltId[id] = idx;
    const entity = lane.Entity;
    const laneId = id;

    lanes.push(
      <g key={`lane${id}`}>
        <rect
          width={MainBusConst.laneWidth}
          height={segmentHeight}
          x={laneX}
          fill="black"
          onDoubleClick={() => busLaneClicked(laneId, entity)}
        >
          <title>{lane.Entity}</title>
        </rect>
        {Icon(lane.Entity)}
        <use
          href={`#${lane.Entity}`}
          width="16"
          height="16"
          x={laneX + 4}
          y={0}
        />
      </g>
    );
    idx++;
  }

  const connections: JSX.Element[] = [];
  beltConnections.forEach((beltConn, connIdx) => {
    const y =
      connectionOffset + connIdx * (connectionHeight + interConnectionHeight);

    const laneIdx = laneIdxByBeltId[beltConn.beltId],
      laneX =
        MainBusConst.laneOffset +
        laneIdx * (MainBusConst.laneWidth + MainBusConst.interLaneWidth);

    connections.push(
      <g key={`conn${connIdx}`}>
        <defs>
          <marker
            id="chevron"
            viewBox="0 0 20 20"
            refX="10"
            refY="10"
            markerUnits="userSpaceOnUse"
            markerWidth="8"
            markerHeight="8"
            orient="auto"
            fill="lightgreen"
          >
            <Chevron />
          </marker>
        </defs>
        <path
          onDoubleClick={() => beltConnectionClicked(beltConn.beltId)}
          d={getPath(y, laneIdx, laneX, beltConn.direction === "FROM_BUS")}
          fill="none"
          stroke="green"
          strokeWidth={9}
          markerMid="url(#chevron)"
          //markerStart="url(#chevron)"
          //markerEnd="url(#chevron)"
        />
      </g>
    );
  });

  return (
    <svg className="mainBusSegment">
      {lanes}
      {connections}
    </svg>
  );
}
