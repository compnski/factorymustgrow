import { Turret } from "./Turret";
import { Bug } from "./Bug";
import {
  useExploreState,
  ExploreDispatch,
  AdvanceGameState,
} from "./exploreState";
import { SyntheticEvent, useState } from "react";
import { useInterval } from "../reactUtils";
import poissonProcess from "poisson-process";
export type ExploreBoardProps = {};

const getEventPosition = (evt: SyntheticEvent): { x: number; y: number } => {
  const targetClientRect = (evt.target as HTMLElement)
    ?.closest(".exploreBoard")
    ?.getBoundingClientRect() || { x: 0, y: 0 };
  const x = Math.floor((evt as any).clientX - targetClientRect.x);
  const y = Math.floor((evt as any).clientY - targetClientRect.y);
  return { x, y };
};

var lastX: number = 0,
  lastY: number = 0,
  lastTick: number = 0;

const BugSampleRate = 2500;
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

  const maybeSpawnBiters = (dispatch: ExploreDispatch, delta: number) => {
    nextSpawnAt -= delta;
    if (nextSpawnAt < 0) {
      nextSpawnAt = poissonProcess.sample(BugSampleRate);
      const x = Math.floor(Math.random() * 500);
      const y = Math.floor(Math.random() * 500);

      dispatch({ type: "SpawnBug", position: { x, y } });
    }
  };

  useInterval(() => {
    const tick = new Date().getTime();
    const delta = tick - lastTick;
    lastTick = tick;
    if (ghostState) {
      setGhostState({ x: lastX, y: lastY });
    }
    maybeSpawnBiters(dispatch, delta);
    // TODO: Entity logic!
    // Entities have some current state
    // List of possible criteria that would transition to a new state
    //e.g. target gone, enemy in range, etc.
    AdvanceGameState(tick);
  }, 32);

  useInterval(() => {
    dispatch({ type: "Tick" });
  }, 16);

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
      <svg id="exploreCanvas" version="2.0" width="600" height="600">
        <rect x="0" y="0" fill="none" width="100%" height="100%" />
        {ghostTurret}
        {[...state.turrets.values()].map((t) => (
          <Turret key={t.id} rotation={t.rotation} x={t.x} y={t.y} />
        ))}

        {[...state.bugs.values()].map((t) => {
          const fill = t.isAttacking ? "red" : "blue";
          return (
            <Bug key={t.id} fill={fill} rotation={t.rotation} x={t.x} y={t.y} />
          );
        })}
      </svg>
    </div>
  );
};
