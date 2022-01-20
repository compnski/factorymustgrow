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
    pathSteps.push([chevronOffset + i * interChevronWidth, y]);
  }
  pathSteps.push([maxX + MainBusConst.laneWidth, y]);

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
        <rect
          width={MainBusConst.laneWidth}
          height={segmentHeight}
          x={laneX}
          fill="#111"
          onDoubleClick={() => busLaneClicked(laneId, entity)}
          filter="url(#dropshadowSide)"
        >
          <title>{entity}</title>
        </rect>
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
          d={getPath(y, laneIdx, laneX, beltConn.direction === "FROM_BUS")}
          fill="none"
          stroke="#333"
          strokeWidth={connectionHeight}
          markerMid="url(#chevron)"
          filter="url(#dropshadowBelow)"
          //markerStart="url(#chevron)"
          //markerEnd="url(#chevron)"
        />
      </g>
    );
  });

  return (
    <svg className="mainBusSegment">
      <defs>
        <filter id="blurMe" filterUnits="userSpaceOnUse">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
        </filter>

        <filter id="dropshadowBelow" filterUnits="userSpaceOnUse">
          <feOffset result="offOut" in="SourceAlpha" dx="-5" dy="5" />
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
        <filter id="dropshadowSide" filterUnits="userSpaceOnUse">
          <feOffset result="offOut" in="SourceAlpha" dx="2" dy="5" />
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
      </defs>
      {lanes}
      {connections}
    </svg>
  );
}
