import { once } from "../utils";
import { MainBus, Producer } from "../types";

const laneWidth = 5,
  segmentHeight = 86,
  laneOffset = 15,
  interLaneWidth = 10;

const connectionHeight = 5,
  connectionOffset = 20,
  interConnectionHeight = 7;

const Chevron = () => <path d="M0 0 10 0 20 10 10 20 0 20 10 10Z" />;

const chevronOffset = 8,
  interChevronWidth = interLaneWidth + laneWidth;

const getPath = (
  y: number,
  connIdx: number,
  maxX: number,
  reverse: boolean
): string => {
  const pathSteps = [[0, y]];
  for (var i = 0; i < connIdx; i++) {
    pathSteps.push([chevronOffset + i * interChevronWidth, y]);
  }
  pathSteps.push([maxX + laneWidth, y]);

  const p = "M" + (reverse ? pathSteps.reverse() : pathSteps).flat().join(" ");

  once(connIdx, () => console.log(connIdx, p));
  return p;
};

export const MainBusSegment = ({
  mainBus,
  producer,
  buildingIdx,
}: {
  mainBus: MainBus;
  producer: Producer;
  buildingIdx: number;
}) => {
  const lanes = [];
  var idx = 0;
  const laneStartById: { [key: number]: number } = {};
  for (var [id, lane] of mainBus.lanes.entries()) {
    const laneX = laneOffset + idx * (laneWidth + interLaneWidth);
    laneStartById[id] = laneX;
    lanes.push(
      <rect
        key={id}
        width={laneWidth}
        height={segmentHeight}
        x={laneX}
        fill="black"
      >
        <title>{lane.Entity}</title>
      </rect>
    );
    idx++;
  }

  idx = 0;
  const connections: JSX.Element[] = [];
  producer.outputStatus.beltConnections.forEach((beltConn, connIdx) => {
    const y =
      connectionOffset + connIdx * (connectionHeight + interConnectionHeight);

    connections.push(
      <g key={idx}>
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
          d={getPath(
            y,
            connIdx,
            laneStartById[beltConn.beltId],
            beltConn.direction == "FROM_BUS"
          )}
          fill="none"
          stroke="green"
          strokeWidth={9}
          markerMid="url(#chevron)"
          //markerStart="url(#chevron)"
          //markerEnd="url(#chevron)"
        />

        {/* <rect
			width={laneStartById[idx]}
			height={connectionHeight}
			y={y}
			fill="green"
			stroke="black"
			>
			<title>{lane.Entity}</title>
			</rect> */}
      </g>
    );
  });

  return (
    <svg className="mainBusSegment">
      {lanes}
      {connections}
    </svg>
  );
};
