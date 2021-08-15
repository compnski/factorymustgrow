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

export type BuildingCardProps = {
  producer: Producer;
  dispatch: (a: GameAction) => void;
  uiDispatch: (a: UIAction) => void;
  buildingIdx: number;
  mainBus: MainBus;
  regionalOre: Map<string, EntityStack>;
};

const BuildingTypeIconMap: { [key: string]: string } = {
  Factory: "assembling-machine-1",
  Smelter: "stone-furnace",
  Extractor: "electric-mining-drill",
  ChemFactory: "",
  Refinery: "",
  Pumpjack: "",
  Lab: "lab",
};

const ProducerIcon = (p: Producer): string => BuildingTypeIconMap[p.kind];

export const BuildingCard = ({
  producer,
  buildingIdx,
  dispatch,
  uiDispatch,
  mainBus,
  regionalOre,
}: BuildingCardProps) => {
  var recipeInput = producer.inputBuffers;

  if (producer.kind === "Extractor" && producer.inputBuffers) {
    recipeInput = new Map();
    for (var [entity] of producer.inputBuffers) {
      const ore = regionalOre.get(entity);
      if (ore) recipeInput.set(entity, ore);
    }
  }

  const busLaneClicked = (laneId: number, entity: string) => {
    if (
      producer.outputStatus.beltConnections.filter((v) => v.beltId === laneId)
        .length > 0
    )
      return;

    if (
      ProducerHasOutput(producer.kind) &&
      producer.outputBuffers.has(entity)
    ) {
      producer.outputStatus.beltConnections.push({
        direction: "TO_BUS",
        beltId: laneId,
      });
    }
    if (ProducerHasInput(producer.kind) && producer.inputBuffers)
      if (producer.inputBuffers.has(entity)) {
        producer.outputStatus.beltConnections.push({
          direction: "FROM_BUS",
          beltId: laneId,
        });
      }
  };
  const beltConnectionClicked = (laneId: number) => {
    const connectIdx = producer.outputStatus.beltConnections.findIndex(
      (v) => v.beltId === laneId
    );
    producer.outputStatus.beltConnections.splice(connectIdx, 1);
  };

  const entityIconDoubleClickHandler = (
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
  const selectRecipe = useIconSelector();
  return (
    <div className="producer-card" id={`b-${buildingIdx}`}>
      <div className="main-area">
        <div className="top-area">
          <div className="title">{producer.RecipeId /* TODO Fix name */}</div>
          <div className="producer-count-area">
            <span className={`icon ${ProducerIcon(producer)}`} />
            <div
              className="plus-minus"
              onClick={() =>
                dispatch({
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
                dispatch({
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
            doubleClickHandler={entityIconDoubleClickHandler}
            entityIconLookup={entityIconLookupByKind(producer.kind)}
          />
        </div>
      </div>
      <div className="output-area">
        <div
          className="output-arrow up"
          onClick={() =>
            dispatch({
              type: "ToggleUpperOutputState",
              buildingIdx,
            })
          }
        >
          {producer.outputStatus.above === "OUT" ? "^" : "-"}
        </div>
        <div className="output-arrow right">&gt;</div>
        <div
          className="output-arrow down"
          onClick={() =>
            dispatch({
              type: "ToggleLowerOutputState",
              buildingIdx,
            })
          }
        >
          {producer.outputStatus.below === "OUT" ? "v" : "-"}
        </div>
      </div>
      <MainBusSegment
        mainBus={mainBus}
        busLaneClicked={busLaneClicked}
        beltConnectionClicked={beltConnectionClicked}
        segmentHeight={100}
        beltConnections={producer.outputStatus.beltConnections}
      />
    </div>
  );
};
