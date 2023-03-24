import { ErrorBoundary } from "react-error-boundary"
import { ShortcutProvider } from "react-keybind"
import { ErrorFallback } from "./components/ErrorFallback"
import { ItemTable } from "./components/planner/ItemTable"
import "./icons.scss"
import "./macro_def"
import "./Planner.css"
import "./technology.css"

export default function Planner() {
  function reset() {
    //
  }

  try {
    return (
      <ShortcutProvider>
        <div className="planner">
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
            <ItemTable />
          </ErrorBoundary>
        </div>
      </ShortcutProvider>
    )
  } catch (e) {
    return ErrorFallback({
      error: e as Error,
      resetErrorBoundary: reset,
    })
  }
}
