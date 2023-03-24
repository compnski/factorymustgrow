import { GameAction } from "./GameAction"
import { MacroName } from "./macro_def"
import { StateVMAction } from "./state/action"
import { FactoryGameState } from "./factoryGameState"

declare global {
  interface Window {
    GameState: () => FactoryGameState
    uxDispatch: (a: GameAction) => void
    Macro: (name: MacroName) => void
    vmDispatch: (...a: StateVMAction[]) => void
  }
}
