import { BeltConnection } from "../types";
import { Icon } from "../gen/svgIcons";
import { MainBusConst } from "./uiConstants";
import { entityIconLookupByKind } from "../utils";
import { MainBus } from "../mainbus";

const connectionHeight = 25,
  connectionOffset = 15,
  interConnectionHeight = 10;

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
    pathSteps.push([chevronOffset + Math.max(0, i * interChevronWidth - 5), y]);
  }
  pathSteps.push([maxX + MainBusConst.laneWidth + 5, y]);
  // Turn up/down
  //  pathSteps.push([maxX + MainBusConst.laneWidth + 5, y + 20]);
  //  pathSteps.push([maxX + MainBusConst.laneWidth + 5, y + 25]);

  const p = "M" + (reverse ? pathSteps.reverse() : pathSteps).flat().join(" ");

  return p;
};

const getPathEnd = (
  y: number,
  laneIdx: number,
  maxX: number,
  reverse: boolean
): string => {
  const x = maxX + MainBusConst.laneWidth + 7,
    pathSteps = [[x, y - MainBusConst.laneWidth / 2]];
  // Turn up/down
  pathSteps.push([x, y + 10]);
  pathSteps.push([x, y + 20]);

  const p = "M" + (reverse ? pathSteps.reverse() : pathSteps).flat().join(" ");

  return p;
};

const beltAnimationDuration = "4s";

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
  beltConnectionClicked?: (connectionIdx: number) => void;
}) {
  const lanes = [];
  var idx = 0;
  const laneIdxByBeltId: { [key: number]: number } = {};
  const entityIconLookup = entityIconLookupByKind("MainBus");

  for (var [_laneId, lane] of mainBus.lanes.entries()) {
    const laneId = _laneId;
    const laneX =
      MainBusConst.laneOffset +
      idx * (MainBusConst.laneWidth + MainBusConst.interLaneWidth);
    laneIdxByBeltId[laneId] = idx;
    const entity = lane.Entities()[0][0],
      iconName = entityIconLookup(entity);
    lanes.push(
      <g key={`lane${laneId}`}>
        <polyline
          x={laneX}
          fill="#3F4952"
          stroke="#222"
          onDoubleClick={() => busLaneClicked(laneId, entity)}
          filter="url(#dropshadowSide)"
          points={`${laneX},0 ${laneX},${segmentHeight + 2} ${
            laneX + MainBusConst.laneWidth
          },${segmentHeight + 2} ${laneX + MainBusConst.laneWidth},0`}
        >
          <title>{entity}</title>
        </polyline>
        {Icon(iconName)}
        <use href={`#${iconName}`} width="16" height="16" x={laneX + 4} y={0}>
          <animateTransform
            attributeName="transform"
            type="translate"
            from={`0 0`}
            to={`0 ${segmentHeight}`}
            begin="0s"
            dur={beltAnimationDuration}
            repeatCount="indefinite"
          />
        </use>
        <use href={`#${entity}`} width="16" height="16" x={laneX + 4} y={0}>
          <animateTransform
            attributeName="transform"
            type="translate"
            from={`0 ${-segmentHeight}`}
            to={`0 0`}
            begin="0s"
            dur={beltAnimationDuration}
            repeatCount="indefinite"
          />
        </use>
      </g>
    );
    idx++;
  }

  const connections: JSX.Element[] = [];
  beltConnections.forEach((beltConn, connIdx) => {
    if (beltConn.laneId === undefined) return;
    const y =
      connectionOffset + connIdx * (connectionHeight + interConnectionHeight);

    const laneIdx = laneIdxByBeltId[beltConn.laneId],
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
            markerWidth={connectionHeight / 2}
            markerHeight={connectionHeight}
            orient="auto"
            fill="#ffd300"
            filter="blurMe"
          >
            <Chevron />
          </marker>
        </defs>
        <path
          onDoubleClick={() =>
            beltConn.laneId !== undefined && beltConnectionClicked(connIdx)
          }
          d={getPath(y, laneIdx, laneX - 20, beltConn.direction === "FROM_BUS")}
          fill="none"
          stroke="#374048"
          strokeWidth={connectionHeight}
          markerMid="url(#chevron)"
          filter="url(#dropshadowBelow)"
        />
        <path
          onDoubleClick={() =>
            beltConn.laneId !== undefined && beltConnectionClicked(connIdx)
          }
          d={getPathEnd(
            y,
            laneIdx,
            laneX - 20,
            beltConn.direction === "FROM_BUS"
          )}
          fill="none"
          stroke="#374048"
          strokeWidth={connectionHeight}
          markerMid="url(#chevron)"
          filter="url(#dropshadowBelow)"
        />
      </g>
    );
  });

  return (
    <svg className="main-bus-segment">
      <defs>
        <filter id="blurMe" filterUnits="userSpaceOnUse">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
        </filter>

        <filter id="dropshadowBelow" filterUnits="userSpaceOnUse">
          <feOffset result="offOut" in="SourceAlpha" dx="5" dy="5" />
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
      </defs>
      {lanes}
      {connections}
    </svg>
  );
}
