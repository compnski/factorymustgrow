//import { Map } from "immutable";
import { useReducer } from "react";

export const useExploreState = () =>
  useReducer(exploreStateReducer, initialExploreState);
export type ExploreAction = {
  type: "PlaceTurret" | "SpawnBug";
  position: { x: number; y: number };
};

type EntityDef = {
  x: number;
  y: number;
  rotation: number;
};

export type ExploreDispatch = (action: ExploreAction) => void;

export type ExploreState = {
  bugs: EntityDef[];
  turrets: EntityDef[];
};

const initialExploreState: ExploreState = {
  bugs: [],
  turrets: [],
};

export function exploreStateReducer(
  state: ExploreState,
  action: ExploreAction
): ExploreState {
  const type = action.type;
  switch (type) {
    case "PlaceTurret":
      if (canPlaceTurretAt(state, action.position.x, action.position.y)) {
        const turrets = [
          ...state.turrets,
          { x: action.position.x, y: action.position.y, rotation: 0 },
        ];

        return { ...state, turrets };
      }
      break;
    case "SpawnBug":
      const bugs = [
        ...state.bugs,
        { x: action.position.x, y: action.position.y, rotation: 0 },
      ];
      return { ...state, bugs };
    default:
  }
  return state;
}

const canPlaceTurretAt = function (
  state: ExploreState,
  x: number,
  y: number
): boolean {
  return true;
};
