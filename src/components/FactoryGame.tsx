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
import { showPlaceBeltLineSelector } from "./selectors";

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

    return (
      <div className="factory-game">
        <InfoHeader
          uiDispatch={uiDispatch}
          currentRegion={currentRegion}
          researchState={gameState.Research}
        />
        <RegionTabBar
          currentRegionId={gameState.CurrentRegionId}
          regionIds={regionIds}
          gameDispatch={GameDispatch}
          inventory={gameState.Inventory}
        />
        <MainBusHeader
          mainBus={currentRegion.Bus}
          researchState={gameState.Research}
        />
        <div className="scroller">
          <BuildingCardList
            mainBus={currentRegion.Bus}
            region={currentRegion}
            regionalOre={currentRegion.Ore}
            uiDispatch={uiDispatch}
          />
        </div>
        <InventoryDisplay
          inventory={gameState.Inventory}
          doubleClickHandler={inventoryDoubleClickHandler}
        />
        <DebugButtonPanel gameDispatch={GameDispatch} uiDispatch={uiDispatch} />
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
