import { GameAction } from "./GameAction";
import { FactoryGameState } from "./useGameState";

import { UIAction } from "./uiState";
import { MacroName } from "./macro_def";
import { GameStateReducer } from "./stateVm";

export type GameWindow = {
  GameState: () => FactoryGameState;
  GameDispatch: (
    reducer: GameStateReducer,
    gameState: FactoryGameState,
    a: GameAction
  ) => void;
  Macro: (
    name: MacroName,
    reducer: GameStateReducer,
    gameState: FactoryGameState,
    regionId: string
  ) => void;
  uiDispatch: (a: UIAction) => void;
};
