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
  const recipeSelector = uiState.dialogs.recipeSelectorOpen ? (
    <RecipeSelector
      title="Select Recipe"
      recipes={availableRecipes(gameState.Research)}
      onClick={(evt: SyntheticEvent, r: string) => {
        uiDispatch({ type: "CloseDialog", evt });
        GameDispatch({ type: "NewProducer", producerName: r });
      }}
    />
  ) : null;

  const researchSelector = uiState.dialogs.researchSelectorOpen ? (
    <RecipeSelector
      title="Select Research"
      recipes={availableResearch(gameState.Research)}
      onClick={(evt: SyntheticEvent, r: string) => {
        uiDispatch({ type: "CloseDialog", evt });
        GameDispatch({ type: "ChangeResearch", producerName: r });
      }}
      entityIconLookup={entityIconLookupByKind("Lab")}
    />
  ) : null;

  const debugInventorySelector = uiState.dialogs.debugInventorySelectorOpen ? (
    <RecipeSelector
      title="Select Item"
      recipes={availableItems(gameState.Research)}
      onClick={(evt: SyntheticEvent, r: string) => {
        uiDispatch({ type: "CloseDialog", evt });
        GameDispatch({
          type: "TransferToInventory",
          otherStackKind: "Void",
          entity: r,
        });
      }}
    />
  ) : null;

  return (
    <div className="factoryGame">
      {recipeSelector || researchSelector || debugInventorySelector}
      <InfoHeader
        uiDispatch={uiDispatch}
        currentRegion={gameState.CurrentRegion}
        researchState={gameState.Research}
      />
      <MainBusHeader
        mainBus={gameState.CurrentRegion.Bus}
        researchState={gameState.Research}
      />
      <div className="scoller">
        <ProducerCardList
          mainBus={gameState.CurrentRegion.Bus}
          buildings={gameState.CurrentRegion.Buildings}
          regionalOre={gameState.CurrentRegion.Ore}
        />
      </div>
      <InventoryDisplay inventory={gameState.Inventory} />
      <FactoryButtonPanel gameDispatch={GameDispatch} uiDispatch={uiDispatch} />
    </div>
  );
};
