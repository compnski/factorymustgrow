import { SyntheticEvent } from "react";
import { FactoryGameState, GameDispatch } from "../factoryGame";
import { UIAction, UIState } from "../uiState";
import { ProducerCardList } from "./ProducerCardList";
import { RecipeSelector } from "./RecipeSelector";
import { InfoHeader } from "./InfoHeader";
import { MainBusHeader } from "./MainBusHeader";
import "./FactoryGame.scss";
import { entityIconLookupByKind } from "../utils";
import { availableRecipes, availableResearch } from "../research";
import { FactoryButtonPanel } from "./FactoryButtonPanel";
import { InventoryDisplay } from "./InventoryDisplay";
import { availableItems } from "../research";
import { RegionSelector } from "./RegionSelector";
import { RegionTabBar } from "./RegionTabBar";

type FactoryGameProps = {
  gameState: FactoryGameState;
  uiState: UIState;
  uiDispatch: (a: UIAction) => void;
};

export const FactoryGame = ({
  gameState,
  uiState,
  uiDispatch,
}: FactoryGameProps) => {
  try {
    const regionIds = [...gameState.Regions.keys()];
    const regionSelector = uiState.dialogs.regionSelectorOpen && (
      <RegionSelector
        regionIds={regionIds}
        currentRegionId={gameState.CurrentRegionId}
        inventory={gameState.Inventory}
        gameDispatch={GameDispatch}
      />
    );

    const currentRegion = gameState.Regions.get(gameState.CurrentRegionId)!;

    return (
      <div className="factory-game">
        {/* {recipeSelector ||
              researchSelector ||
              debugInventorySelector ||*/}
        {regionSelector}
        <InfoHeader
          uiDispatch={uiDispatch}
          currentRegion={currentRegion}
          researchState={gameState.Research}
        />
        <div className="scoller">
          <RegionTabBar
            currentRegionId={gameState.CurrentRegionId}
            regionIds={regionIds}
            gameDispatch={GameDispatch}
          />
          <MainBusHeader
            mainBus={currentRegion.Bus}
            researchState={gameState.Research}
          />
          <ProducerCardList
            mainBus={currentRegion.Bus}
            buildings={currentRegion.Buildings}
            regionalOre={currentRegion.Ore}
            uiDispatch={uiDispatch}
          />
        </div>
        <InventoryDisplay inventory={gameState.Inventory} />
        <FactoryButtonPanel
          gameDispatch={GameDispatch}
          uiDispatch={uiDispatch}
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
