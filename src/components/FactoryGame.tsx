import { useState } from "react";
import { TicksPerSecond } from "../constants";
import { UpdateGameState } from "../factoryGame";
import { GameAction } from "../GameAction";
import { GameDispatch } from "../GameDispatch";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { saveStateToLocalStorage } from "../localstorage";
import { Macro, setMacroRegionId } from "../macro_def";
import { useInterval } from "../reactUtils";
import { ReactComponent as RocketShip } from "../rocket-launch.svg";
import { StateVMAction } from "../stateVm";
import { ReadonlyResearchState, useGameState } from "../useGameState";
import { BuildingCardList } from "./BuildingCardList";
import { DebugButtonPanel } from "./DebugButtonPanel";
import "./FactoryGame.scss";
import { InfoHeader } from "./InfoHeader";
import { InventoryDisplay } from "./InventoryDisplay";
import { MainBusHeader } from "./MainBusHeader";
import { RegionTabBar } from "./RegionTabBar";
import { showHelpCard } from "./selectors";

export const FactoryGame = () => {
  const [gameState, dispatchGameStateActions] = useGameState();
  const [currentRegionId, setCurrentRegionId] = useState<string>(
    gameState.Regions.keys().next().value || ""
  );
  setMacroRegionId(currentRegionId);
  const generalDialog = useGeneralDialog();

  useInterval(async () => {
    saveStateToLocalStorage(gameState);
    const tick = new Date().getTime();
    await UpdateGameState(
      gameState,
      dispatchGameStateActions,
      tick,
      generalDialog
    );
  }, 1000 / TicksPerSecond);

  try {
    const regionIds = [...gameState.Regions.keys()];
    const currentRegion = gameState.Regions.get(currentRegionId);
    const inventory = gameState.Inventory;
    const researchState = gameState.Research as ReadonlyResearchState;
    const showHelp = () => {
      void showHelpCard(generalDialog);
    };
    const isRocketLaunching = gameState.RocketLaunchingAt > 0;

    const uxDispatch = (action: GameAction) => {
      GameDispatch(dispatchGameStateActions, gameState, action);
    };
    window.uxDispatch = uxDispatch;
    window.Macro = Macro(dispatchGameStateActions, gameState, currentRegionId);
    window.GameState = () => gameState;
    window.vmDispatch = (...a: StateVMAction[]) => dispatchGameStateActions(a);

    //console.log(currentRegion);
    if (!currentRegion) throw new Error("Bad region " + currentRegionId);
    return (
      <div className="factory-game">
        <RocketShip
          className={`rocket-ship ${(isRocketLaunching && "animate") || ""}`}
        />
        <div className="top-bar">
          <RegionTabBar
            currentRegionId={currentRegionId}
            regionIds={regionIds}
            uxDispatch={uxDispatch}
            inventory={inventory}
            setCurrentRegionId={setCurrentRegionId}
          />
          <div onClick={showHelp} className="help-icon">
            <span className="material-icons">help_outline</span>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <InfoHeader
            currentRegion={currentRegion}
            researchState={researchState}
            uxDispatch={uxDispatch}
          />
          <MainBusHeader
            mainBus={currentRegion.Bus}
            researchState={researchState}
            regionId={currentRegion.Id}
            uxDispatch={uxDispatch}
          />
        </div>
        <div className="scroller">
          <BuildingCardList
            region={currentRegion}
            uxDispatch={uxDispatch}
            gameState={gameState}
          />
        </div>
        <InventoryDisplay inventory={inventory} />
        <DebugButtonPanel
          researchState={researchState}
          uxDispatch={uxDispatch}
        />
      </div>
    );
  } catch (e: unknown) {
    console.error(e);
    return (
      <div>
        Failed to load: {(e as Error).message}
        <pre>{(e as Error).stack}</pre>
      </div>
    );
  }
};
