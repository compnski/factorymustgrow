import "./Explore.scss";
import { ExploreBoard, GhostInfo } from "./components/ExploreBoard";
import { StartCard } from "./components/StartCard";
import { EndCard } from "./components/EndCard";
import {
  ExploreAction,
  useExploreState,
  ExploreDispatch,
  AdvanceGameState,
  updateExploreState,
} from "./exploreState";
import { SyntheticEvent, useState } from "react";
import { useInterval } from "../reactUtils";

export type ResourceKind =
  | "copper-ore"
  | "iron-ore"
  | "coal"
  | "stone"
  | "space";
export type BattleItemKind = "turret" | "bullet" | "repair-pack" | "grenade";
export type ExploreGameProps = {
  // regional resources -- used for doodads
  // initial inventory
  // game end callback

  resources: { kind: ResourceKind; count: number }[];
  inventory: { kind: BattleItemKind; count: number }[];
  gameEndCallback: (
    success: boolean,
    remainingInventory: { kind: BattleItemKind; count: number }[]
  ) => void;
};

const getEventPosition = (evt: SyntheticEvent): { x: number; y: number } => {
  const targetClientRect = (evt.target as HTMLElement)
    ?.closest(".exploreBoard")
    ?.getBoundingClientRect() || { x: 0, y: 0 };
  const x = Math.floor((evt as any).clientX - targetClientRect.x);
  const y = Math.floor((evt as any).clientY - targetClientRect.y);
  return { x, y };
};

var lastX: number = 0,
  lastY: number = 0;

const canvasMouseMove = (evt: SyntheticEvent) => {
  const pos = getEventPosition(evt);
  lastX = pos.x;
  lastY = pos.y;
};

const canvasMouseUp = (
  dispatch: ExploreDispatch,
  ghostState: GhostInfo | null,
  setGhostState: (i: GhostInfo | null) => void
): ((evt: any) => void) => {
  return () => {
    if (ghostState)
      switch (ghostState.kind) {
        case "Turret":
          dispatch({
            type: "PlaceTurret",
            position: ghostState,
          });
          break;
        case "Bug":
          dispatch({
            type: "SpawnBug",
            position: ghostState,
          });
          break;
        case "Spawner":
          dispatch({
            type: "SpawnSpawner",
            position: ghostState,
          });
      }
    setGhostState(null);
  };
};

const canvasMouseDown = (
  dispatch: ExploreDispatch,
  ghostState: GhostInfo | null,
  setGhostState: (i: GhostInfo | null) => void
): ((evt: any) => void) => {
  return (evt: SyntheticEvent) => {
    const pos = getEventPosition(evt);
    lastX = pos.x;
    lastY = pos.y;
    setGhostState({
      ...pos,
      kind:
        (evt.nativeEvent as MouseEvent).button === 1
          ? "Spawner"
          : (evt.nativeEvent as MouseEvent).button === 2
          ? "Bug"
          : "Turret",
    });
    evt.preventDefault();
    evt.stopPropagation();
  };
};

export const ExploreGame = ({
  resources,
  inventory,
  gameEndCallback,
}: ExploreGameProps) => {
  const [state, updateRenderState] = useExploreState();
  const [ghostState, setGhostState] = useState<GhostInfo | null>(null);
  const [gamePhase, setGamePhase] = useState<"START" | "RUN" | "END">("START");

  useInterval(updateRenderState, 16);
  useInterval(() => {
    if (gamePhase !== "RUN") return;
    const tick = new Date().getTime();
    if (ghostState) {
      setGhostState({ ...ghostState, x: lastX, y: lastY });
    }
    if (!AdvanceGameState(tick, { x: lastX, y: lastY })) {
      setGamePhase("END");
    }
  }, 32);

  const startCardClicked = (skipFight: boolean) => {
    console.log("start", skipFight);
    if (skipFight) {
      gameEndCallback(true, []);
      return;
    }
    setGamePhase("RUN");
    updateExploreState({ type: "Reset" });
    console.log("run");
  };

  const endCardClicked = () => {
    gameEndCallback(true, inventory);
  };

  const startCard =
    gamePhase === "START" ? (
      <StartCard
        resources={resources}
        inventory={inventory}
        onClick={startCardClicked}
      />
    ) : null;

  const endCard =
    gamePhase === "END" ? (
      <EndCard
        resources={resources}
        inventory={inventory}
        onClick={endCardClicked}
      />
    ) : null;

  const dispatch = (action: ExploreAction) => {
    if (gamePhase !== "RUN") return;
    updateExploreState(action);
  };

  return (
    <div className="exploreGame">
      {startCard}
      {endCard}
      <ExploreBoard
        onMouseUp={canvasMouseUp(dispatch, ghostState, setGhostState)}
        onMouseDown={canvasMouseDown(dispatch, ghostState, setGhostState)}
        onMouseMove={canvasMouseMove}
        onMouseLeave={() => setGhostState(null)}
        onContextMenu={(e: SyntheticEvent) => e.preventDefault()}
        className="exploreBoard"
        bugs={state.bugs}
        turrets={state.turrets}
        terrain={state.terrain}
        placementGhostInfo={ghostState}
      />
    </div>
  );
};
