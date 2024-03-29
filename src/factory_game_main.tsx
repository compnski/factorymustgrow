import { ErrorBoundary } from "react-error-boundary"
import { ShortcutProvider } from "react-keybind"
import "./App.scss"
import { ErrorFallback } from "./components/ErrorFallback"
import { FactoryGame } from "./components/FactoryGame"
import { GameAction } from "./GameAction"
import { GameDispatch } from "./GameDispatch"
import { GeneralDialogProvider } from "./GeneralDialogProvider"
import "./icons.scss"
import "./macro_def"
import { getDispatchFunc } from "./stateVm"
import "./technology.css"

//void LoadEntitySet("satisfactory");
function FactoryGameMain() {
  try {
    const { gameState, dispatch, executeActions } = getDispatchFunc()
    const uxDispatch = (action: GameAction) => {
      GameDispatch(dispatch, gameState, action)
      executeActions(gameState)
    }

    const resetGame = () => {
      console.log("Resetting")
      localStorage.clear()
      window.location.reload()
      //        dispatch({ kind: "Reset" });
    }

    return (
      <ShortcutProvider>
        <GeneralDialogProvider uxDispatch={uxDispatch}>
          <div
            className="App"
            onClick={(evt) => {
              if ((evt.target as Element).classList.contains("clickable")) return
            }}
          >
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={resetGame}>
              <FactoryGame gameState={gameState} dispatch={dispatch} executeActions={executeActions} />
            </ErrorBoundary>
          </div>
        </GeneralDialogProvider>
      </ShortcutProvider>
    )
  } catch (e) {
    return ErrorFallback({
      error: e as Error,
      resetErrorBoundary: () => {
        console.log("Resetting")
        localStorage.clear()
        window.location.reload()
      },
    })
  }
}
export default FactoryGameMain
