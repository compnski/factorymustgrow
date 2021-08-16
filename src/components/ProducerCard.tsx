import { GameAction, GameDispatch } from "../factoryGame";
import {
  EntityStack,
  FillEntityStack,
  MainBus,
  Producer,
  Recipe,
} from "../types";
import "./BuildingCard.scss";
import { SyntheticEvent, useState } from "react";
import { MainBusSegment } from "./MainBusSegment";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import {
  entityIconLookupByKind,
  ProducerHasInput,
  ProducerHasOutput,
} from "../utils";
import { UIAction } from "../uiState";
import { showChangeProducerRecipeSelector } from "./selectors";
import { useIconSelector } from "../IconSelectorProvider";

const BuildingTypeIconMap: { [key: string]: string } = {
  Factory: "assembling-machine-1",
  Smelter: "stone-furnace",
  Extractor: "electric-mining-drill",
  ChemFactory: "",
  Refinery: "",
  Pumpjack: "",
  Lab: "lab",
};

const ProducerIcon = (p: Producer): string => p.subkind;

export type ProducerCardProps = {
  producer: Producer;
  /* dispatch: (a: GameAction) => void;
   * uiDispatch: (a: UIAction) => void; */
  buildingIdx: number;
  //  mainBus: MainBus;
  regionalOre: Map<string, EntityStack>;
};

function getEntityIconDoubleClickHandler(buildingIdx: number) {
  return (
    evt: {
      clientX: number;
      clientY: number;
      shiftKey: boolean;
      //target: { hasOwnProperty(p: string): boolean };
      nativeEvent: { offsetX: number; offsetY: number };
    },
    stack: EntityStack
  ): void => {
    if (evt.shiftKey) {
      FillEntityStack(stack, 1);
      return;
    }
    const clickY = evt.nativeEvent.offsetY;
    if (clickY < 20) {
      GameDispatch({
        type: "TransferFromInventory",
        entity: stack.Entity,
        otherStackKind: "Building",
        buildingIdx: buildingIdx,
      });
    }

    if (clickY > 30) {
      GameDispatch({
        type: "TransferToInventory",
        entity: stack.Entity,
        otherStackKind: "Building",
        buildingIdx: buildingIdx,
      });
    }
  };
}

export function ProducerCard({
  producer,
  buildingIdx,
  regionalOre,
}: ProducerCardProps) {
  const selectRecipe = useIconSelector();

  var recipeInput = producer.inputBuffers;

  if (producer.kind === "Extractor" && producer.inputBuffers) {
    recipeInput = new Map();
    for (var [entity] of producer.inputBuffers) {
      const ore = regionalOre.get(entity);
      if (ore) recipeInput.set(entity, ore);
    }
  }

  return (
    <div className="main-area">
      <div className="top-area">
        <div className="title">{producer.RecipeId /* TODO Fix name */}</div>
        <div className="producer-count-area">
          <span className={`icon ${ProducerIcon(producer)}`} />
          <div
            className="plus-minus"
            onClick={() =>
              GameDispatch({
                type: "DecreaseProducerCount",
                buildingIdx,
              })
            }
          >
            -
          </div>
          <div className="producer-count">{producer.ProducerCount}</div>
          <div
            className="plus-minus"
            onClick={() =>
              GameDispatch({
                type: "IncreaseProducerCount",
                buildingIdx,
              })
            }
          >
            +
          </div>
        </div>
      </div>
      <div className="bottom-area">
        <div
          onClick={async () => {
            const recipe = await showChangeProducerRecipeSelector(
              producer.ProducerType,
              buildingIdx,
              selectRecipe
            );
          }}
          className="change-recipe clickable"
        >
          Change Recipe
        </div>
        <BuildingBufferDisplay
          inputBuffers={recipeInput}
          outputBuffers={producer.outputBuffers}
          doubleClickHandler={getEntityIconDoubleClickHandler(buildingIdx)}
          entityIconLookup={entityIconLookupByKind(producer.kind)}
        />
      </div>
    </div>
  );
}
