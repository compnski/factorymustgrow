import { GameDispatch } from "../GameDispatch";
import { FactoryGameState } from "../useGameState";
import { UIAction, UIState } from "../uiState";
import { BuildingCardList } from "./BuildingCardList";
import { InfoHeader } from "./InfoHeader";
import { MainBusHeader } from "./MainBusHeader";
import "./FactoryGame.scss";
import { DebugButtonPanel } from "./DebugButtonPanel";
import { InventoryDisplay } from "./InventoryDisplay";
import { RegionTabBar } from "./RegionTabBar";
import { ItemBuffer } from "../types";
import { IsBuilding } from "../production";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { showHelpCard, showPlaceBeltLineSelector } from "./selectors";

type FactoryGameProps = {
  gameState: FactoryGameState;
};

export const FactoryGame = ({ gameState }: FactoryGameProps) => {
  try {
    const generalDialog = useGeneralDialog();

    const regionIds = [...gameState.Regions.keys()];

    const currentRegion = gameState.Regions.get(gameState.CurrentRegionId)!;

    const inventoryDoubleClickHandler = function inventoryDoubleClickHandler(
      evt: { shiftKey: boolean },
      itemBuffer: ItemBuffer,
      entity: string
    ) {
      if (evt.shiftKey) {
        GameDispatch({
          type: "TransferFromInventory",
          entity,
          otherStackKind: "Void",
        });
      } else {
        // Place Item
        if (entity === "transport-belt")
          showPlaceBeltLineSelector(
            generalDialog,
            gameState.Inventory,
            gameState.Regions
          );
        else if (IsBuilding(entity))
          GameDispatch({
            type: "PlaceBuilding",
            entity,
          });
      }
    };

    const showHelp = () => {
      showHelpCard(generalDialog);
    };

    return (
      <div className="factory-game">
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
