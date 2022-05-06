import { GameAction } from "./GameAction";
import { MacroName } from "./macro_def";
import { StateVMAction } from "./stateVm";
import { FactoryGameState } from "./useGameState";

declare global {
  interface Window {
    GameState: () => FactoryGameState;
    uxDispatch: (a: GameAction) => void;
    Macro: (name: MacroName) => void;
    vmDispatch: (...a: StateVMAction[]) => void;
  }
}
