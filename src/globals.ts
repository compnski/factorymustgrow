import { GameDispatch } from "./GameDispatch";
import { GameAction } from "./GameAction";
import { FactoryGameState } from "./state/FactoryGameState";

import { UIAction } from "./uiState";
import { MacroName } from "./macro_def";

export type GameWindow = {
  GameState: () => FactoryGameState;
  GameDispatch: (a: GameAction) => void;
  Macro: (name: MacroName) => any;
  uiDispatch: (a: UIAction) => void;
};
