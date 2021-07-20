import { Turret } from "./Turret";
import { EntityProps } from "./svg";
import { Bug, BugProps } from "./Bug";
import { Spawner } from "./Spawner";
import { Star, Cloud } from "./Icons";
import {
  useExploreState,
  ExploreDispatch,
  AdvanceGameState,
} from "./exploreState";
import {
  SyntheticEvent,
  useState,
  ComponentType,
  FunctionComponent,
} from "react";
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

export const ExploreBoard = (_: ExploreBoardProps) => {
  const [state, dispatch] = useExploreState();
  const [ghostState, setGhostState] = useState<{
    t: FunctionComponent<EntityProps | BugProps>;
    x: number;
    y: number;
  } | null>(null);

  const canvasMouseDown = (evt: SyntheticEvent) => {
    const pos = getEventPosition(evt);
    lastX = pos.x;
    lastY = pos.y;
    setGhostState({
      ...pos,
      t: (evt.nativeEvent as MouseEvent).button === 1 ? Spawner : Turret,
    });
  };

  const canvasMouseMove = (evt: SyntheticEvent) => {
    const pos = getEventPosition(evt);
    lastX = pos.x;
    lastY = pos.y;
  };

  const canvasMouseUp = (dispatch: ExploreDispatch): ((evt: any) => void) => {
    return (evt: SyntheticEvent) => {
      if (ghostState)
        switch (ghostState.t) {
          case Turret:
            dispatch({
              type: "PlaceTurret",
              position: ghostState,
            });
            break;
          case Bug:
            dispatch({
              type: "SpawnBug",
              position: ghostState,
            });
            break;
          case Spawner:
            dispatch({
              type: "SpawnSpawner",
              position: ghostState,
            });
        }
      setGhostState(null);
    };
  };
  /*
   *   const maybeSpawnBiters = (dispatch: ExploreDispatch, delta: number) => {
   *     nextSpawnAt -= delta;
   *     if (nextSpawnAt < 0) {
   *       nextSpawnAt = poissonProcess.sample(BugSampleRate);
   *       const x = Math.floor(Math.random() * 500);
   *       const y = Math.floor(Math.random() * 500);
   *
   *       dispatch({ type: "SpawnBug", position: { x, y } });
   *     }
   *   };
   *  */
  useInterval(() => {
    const tick = new Date().getTime();
    if (lastTick == 0) {
      dispatch({ type: "Reset" });
    }
    const delta = tick - lastTick;
    lastTick = tick;
    if (ghostState) {
      setGhostState({ ...ghostState, x: lastX, y: lastY });
    }
    //maybeSpawnBiters(dispatch, delta);
    // TODO: Entity logic!
    // Entities have some current state
    // List of possible criteria that would transition to a new state
    //e.g. target gone, enemy in range, etc.
    AdvanceGameState(tick, { x: lastX, y: lastY });
  }, 32);

  useInterval(() => {
    dispatch({ type: "Tick" });
  }, 16);

  var placementGhost = null;
  if (ghostState) {
    const GhostType = ghostState.t;
    placementGhost = (
      <g className="placementGhost">
        <GhostType key="ghost" rotation={0} x={ghostState.x} y={ghostState.y} />
      </g>
    );
  }

  const renderedTurrets: any[] = [],
    renderedEffects: any[] = [],
    renderedBugs: any[] = [];
  state.turrets.forEach((t) => {
    const rotationRad = (t.rotation * Math.PI) / 180;
    const deltaX = Math.cos(rotationRad);
    const deltaY = Math.sin(rotationRad);

    if (t.isAttacking && t.currentTarget != null)
      renderedEffects.push(
        <g>
          <Star x={t.x + 32 * deltaX} y={t.y + 32 * deltaY} rotation={0} />
          <Star
            x={t.currentTarget.x - t.currentTarget.hitRadius * deltaX}
            y={t.currentTarget.y - t.currentTarget.hitRadius * deltaY}
            rotation={0}
          />
        </g>
      );

    renderedTurrets.push(
      <Turret
        key={t.id}
        hpPercent={t.currentHP / t.maxHP}
        rotation={t.rotation}
        x={t.x}
        y={t.y}
      />
    );
  });
  state.bugs.forEach((t) => {
    const fill = t.isAttacking ? "red" : "blue";
    const BugElement = t.kind === "Spawner" ? Spawner : Bug;
    const rotationRad = (t.rotation * Math.PI) / 180;
    const deltaX = Math.cos(rotationRad);
    const deltaY = Math.sin(rotationRad);

    if (t.isAttacking && t.currentTarget != null)
      renderedEffects.push(
        <g>
          <Cloud x={t.x + 16 * deltaX} y={t.y + 16 * deltaY} rotation={0} />
          <Cloud
            x={t.currentTarget.x - t.currentTarget.hitRadius * deltaX}
            y={t.currentTarget.y - t.currentTarget.hitRadius * deltaY}
            rotation={0}
          />
        </g>
      );

    renderedBugs.push(
      <BugElement
        key={t.id}
        fill={fill}
        rotation={t.rotation || 0}
        hpPercent={t.currentHP / t.maxHP}
        x={t.x}
        y={t.y}
      />
    );
  });

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
        {placementGhost}
        {renderedTurrets}
        {renderedBugs}
        {renderedEffects}
      </svg>
    </div>
  );
};
