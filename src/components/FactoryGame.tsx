import { Fragment, useState } from "react";
import { TicksPerSecond } from "../constants";
import { UpdateGameState } from "../factoryGame";
import { ReadonlyResearchState } from "../factoryGameState";
import { GameAction } from "../GameAction";
import { GameDispatch } from "../GameDispatch";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { saveStateToLocalStorage } from "../localstorage";
import { Macro, setMacroRegionId } from "../macro_def";
import { useInterval } from "../reactUtils";
import { ReactComponent as RocketShip } from "../rocket-launch.svg";
import { settings } from "../settings";
import { getDispatchFunc } from "../stateVm";
import { BuildingCardList } from "./BuildingCardList";
import { CommentsForm } from "./CommentsForm";
import { DebugButtonPanel } from "./DebugButtonPanel";
import "./FactoryGame.scss";
import { InfoHeader } from "./InfoHeader";
import { InventoryDisplay } from "./InventoryDisplay";
import {
  MainBusController,
  MainBusControllerChildProps,
} from "./MainBusController";
import { RegionTabBar } from "./RegionTabBar";
import { showHelpCard, showSaveCard, showSettingCard } from "./selectors";

export const FactoryGame = (props: ReturnType<typeof getDispatchFunc>) => {
  const { gameState, dispatch, executeActions } = props;
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
      { dispatch, executeActions },
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

    const showSaves = () => {
      void showSaveCard(generalDialog);
    };

    const showSettings = () => {
      void showSettingCard(generalDialog);
    };

    const isRocketLaunching = gameState.RocketLaunchingAt > 0;

    const uxDispatch = (action: GameAction) => {
      GameDispatch(dispatch, gameState, action);
      executeActions(gameState);
    };

    window.uxDispatch = uxDispatch;
    window.Macro = Macro(dispatch, gameState, currentRegionId);
    window.GameState = () => gameState;
    window.vmDispatch = dispatch;

    //console.log(currentRegion);
    if (!currentRegion) throw new Error("Bad region " + currentRegionId);
    return (
      <div className="factory-game">
        {isRocketLaunching && <RocketShip className={`rocket-ship animate`} />}
        <div className="top-bar">
          <RegionTabBar
            currentRegionId={currentRegionId}
            regionIds={regionIds}
            inventory={inventory}
            setCurrentRegionId={setCurrentRegionId}
          />
          <div
            onClick={showSaves}
            className={`help-icon ${settings.cloudSaveEnabled ? "" : "hidden"}`}
          >
            <span className="material-icons">save_as</span>
          </div>
          <div onClick={showSettings} className="help-icon">
            <span className="material-icons">settings</span>
          </div>
          <div onClick={showHelp} className="help-icon">
            <span className="material-icons">help_outline</span>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <InfoHeader
            currentRegion={currentRegion}
            researchState={researchState}
          />
        </div>
        <div className="scroller">
          <MainBusController
            region={currentRegion}
            uxDispatch={uxDispatch}
            gameState={gameState}
          >
            {({
              beltHandler,
              beltState,
              ghostConnection,
              beltInserterMouseDown,
            }: MainBusControllerChildProps) => (
              <Fragment>
                <BuildingCardList
                  region={currentRegion}
                  uxDispatch={uxDispatch}
                  gameState={gameState}
                  beltHandler={beltHandler}
                  beltState={beltState}
                  ghostConnection={ghostConnection}
                  beltInserterMouseDown={beltInserterMouseDown}
                />
              </Fragment>
            )}
          </MainBusController>
        </div>
        <div className="bg-gray-300 ">
          <InventoryDisplay inventory={inventory} />
        </div>
        <DebugButtonPanel
          researchState={researchState}
          uxDispatch={uxDispatch}
        />
        <CommentsForm gameState={gameState} />
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
