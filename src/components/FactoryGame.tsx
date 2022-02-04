import { GameDispatch } from "../GameDispatch";
import { FactoryGameState, GameState, useGameState } from "../useGameState";
import { BuildingCardList } from "./BuildingCardList";
import { InfoHeader } from "./InfoHeader";
import { MainBusHeader } from "./MainBusHeader";
import "./FactoryGame.scss";
import { DebugButtonPanel } from "./DebugButtonPanel";
import { InventoryDisplay } from "./InventoryDisplay";
import { RegionTabBar } from "./RegionTabBar";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { showHelpCard } from "./selectors";

import { ReactComponent as RocketShip } from "../rocket-launch.svg";
import { useInterval } from "../reactUtils";
import { UpdateGameState } from "../factoryGame";
import { saveStateToLocalStorage } from "../localstorage";
import { TicksPerSecond } from "../constants";

type FactoryGameProps = {
  gameState: FactoryGameState;
};

export const FactoryGame = () => {
  const [gameState, setGameState] = useGameState();
  const generalDialog = useGeneralDialog();

  useInterval(() => {
    // Your custom logic here
    const tick = new Date().getTime();
    UpdateGameState(tick, generalDialog);
    saveStateToLocalStorage(GameState);
  }, 1000 / TicksPerSecond);

  useInterval(() => {
    setGameState({ ...GameState });
  }, 32);

  try {
    const regionIds = [...gameState.Regions.keys()];
    const currentRegion = gameState.Regions.get(gameState.CurrentRegionId)!;

    const showHelp = () => {
      showHelpCard(generalDialog);
    };
    const isRocketLaunching = gameState.RocketLaunchingAt > 0;

    return (
      <div className="factory-game">
        <RocketShip
          className={`rocket-ship ${(isRocketLaunching && "animate") || ""}`}
        />
        <div className="top-bar">
          <RegionTabBar
            currentRegionId={gameState.CurrentRegionId}
            regionIds={regionIds}
            gameDispatch={GameDispatch}
            inventory={gameState.Inventory}
          />
          <div onClick={showHelp} className="help-icon">
            <span className="material-icons">help_outline</span>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <InfoHeader
            currentRegion={currentRegion}
            researchState={gameState.Research}
          />
          <MainBusHeader
            mainBus={currentRegion.Bus}
            researchState={gameState.Research}
          />
        </div>
        <div className="scroller">
          <BuildingCardList
            mainBus={currentRegion.Bus}
            region={currentRegion}
            regionalOre={currentRegion.Ore}
          />
        </div>
        <InventoryDisplay inventory={gameState.Inventory} />
        <DebugButtonPanel gameDispatch={GameDispatch} />
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
