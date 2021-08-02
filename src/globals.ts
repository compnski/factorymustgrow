import { FactoryGameState, GameAction, GameDispatch } from "./factoryGame";

import { UIAction } from "./uiState";
import { MacroName } from "./macro_def";

export type GameWindow = {
  GameState: () => FactoryGameState;
  GameDispatch: (a: GameAction) => void;
  Macro: (name: MacroName) => any;
  uiDispatch: (a: UIAction) => void;
};
