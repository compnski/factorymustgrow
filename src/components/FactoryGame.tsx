import { useState } from "react";
import { TicksPerSecond } from "../constants";
import { UpdateGameState } from "../factoryGame";
import { GameDispatch } from "../GameDispatch";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { saveStateToLocalStorage } from "../localstorage";
import { setMacroRegionId } from "../macro_def";
import { useInterval } from "../reactUtils";
import { ReactComponent as RocketShip } from "../rocket-launch.svg";
import {
  GameState,
  GetReadonlyRegion,
  ReadonlyItemBuffer,
  ReadonlyResearchState,
  useGameState,
} from "../useGameState";
import { BuildingCardList } from "./BuildingCardList";
import { DebugButtonPanel } from "./DebugButtonPanel";
import "./FactoryGame.scss";
import { InfoHeader } from "./InfoHeader";
import { InventoryDisplay } from "./InventoryDisplay";
import { MainBusHeader } from "./MainBusHeader";
import { RegionTabBar } from "./RegionTabBar";
import { showHelpCard } from "./selectors";

export const FactoryGame = () => {
  const [gameState, setGameState] = useGameState();
  const [currentRegionId, setCurrentRegionId] = useState<string>(
    gameState.Regions.keys().next().value || ""
  );
  setMacroRegionId(currentRegionId);
  const generalDialog = useGeneralDialog();

  useInterval(async () => {
    // Your custom logic here
    const tick = new Date().getTime();
    await UpdateGameState(tick, generalDialog);
    saveStateToLocalStorage(GameState);
  }, 1000 / TicksPerSecond);

  useInterval(() => {
    setGameState({ ...GameState });
  }, 32);

  try {
    const regionIds = [...gameState.Regions.keys()];
    const currentRegion = GetReadonlyRegion(currentRegionId);
    const inventory = gameState.Inventory as ReadonlyItemBuffer;
    const researchState = gameState.Research as ReadonlyResearchState;
    const showHelp = () => {
      void showHelpCard(generalDialog);
    };
    const isRocketLaunching = gameState.RocketLaunchingAt > 0;

    return (
      <div className="factory-game">
        <RocketShip
          className={`rocket-ship ${(isRocketLaunching && "animate") || ""}`}
        />
        <div className="top-bar">
          <RegionTabBar
            currentRegionId={currentRegionId}
            regionIds={regionIds}
            gameDispatch={GameDispatch}
            inventory={gameState.Inventory}
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
          />
          <MainBusHeader
            mainBus={currentRegion.Bus}
            researchState={researchState}
            regionId={currentRegion.Id}
          />
        </div>
        <div className="scroller">
          <BuildingCardList
            mainBus={currentRegion.Bus}
            region={currentRegion}
            regionalOre={currentRegion.Ore}
            inventory={inventory}
            researchState={researchState}
          />
        </div>
        <InventoryDisplay inventory={inventory} />
        <DebugButtonPanel
          researchState={researchState}
          gameDispatch={GameDispatch}
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
