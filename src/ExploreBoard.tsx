import { Turret } from "./Turret";
import { Bug } from "./Bug";
import { useExploreState, ExploreDispatch } from "./exploreState";
import { SyntheticEvent, useState } from "react";
import { useInterval } from "./reactUtils";
import poissonProcess from "poisson-process";
export type ExploreBoardProps = {};

const getEventPosition = (evt: SyntheticEvent): { x: number; y: number } => {
  const targetClientRect = evt.target
    .closest(".exploreBoard")
    .getBoundingClientRect();
  const x = evt.clientX - targetClientRect.x;
  const y = evt.clientY - targetClientRect.y;
  return { x, y };
};

var lastX: number = 0,
  lastY: number = 0,
  lastTick: number = 0;

const BugSampleRate = 1500;
var nextSpawnAt: number = poissonProcess.sample(BugSampleRate);

export const ExploreBoard = (_: ExploreBoardProps) => {
  const [state, dispatch] = useExploreState();
  const [ghostState, setGhostState] = useState<{ x: number; y: number } | null>(
    null
  );

  const canvasMouseDown = (evt: SyntheticEvent) => {
    const pos = getEventPosition(evt);
    lastX = pos.x;
    lastY = pos.y;
    setGhostState(pos);
  };

  const canvasMouseMove = (evt: SyntheticEvent) => {
    const pos = getEventPosition(evt);
    lastX = pos.x;
    lastY = pos.y;
  };

  const canvasMouseUp = (dispatch: ExploreDispatch): ((evt: any) => void) => {
    return (evt: SyntheticEvent) => {
      if (ghostState)
        dispatch({
          type: "PlaceTurret",
          position: ghostState,
        });
      setGhostState(null);
    };
  };

  useInterval(() => {
    const tick = new Date().getTime();
    const delta = tick - lastTick;
    lastTick = tick;
    if (ghostState) {
      setGhostState({ x: lastX, y: lastY });
    }
  }, 16);

  var idx = 0;
  const ghostTurret = ghostState ? (
    <Turret key="ghost" rotation={0} x={ghostState.x} y={ghostState.y} />
  ) : null;
  return (
    <div
      onMouseUp={canvasMouseUp(dispatch)}
      onMouseDown={canvasMouseDown}
      onMouseMove={canvasMouseMove}
      onMouseLeave={() => setGhostState(null)}
      className="exploreBoard"
    >
      <svg id="exploreCanvas" version="2.0" width="100%" height="100%">
        <rect x="0" y="0" fill="none" width="100%" height="100%" />
        {ghostTurret}
        {state.turrets.map((t) => (
          <Turret key={idx++} rotation={t.rotation} x={t.x} y={t.y} />
        ))}

        {state.bugs.map((t) => (
          <Bug key={idx++} rotation={t.rotation} x={t.x} y={t.y} />
        ))}
      </svg>
    </div>
  );
};
