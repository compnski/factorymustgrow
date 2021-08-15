import { GameAction, GameDispatch } from "../factoryGame";
import {
  EntityStack,
  FillEntityStack,
  MainBus,
  Producer,
  Recipe,
} from "../types";
import "./ProducerCard.scss";
import { SyntheticEvent, useState } from "react";
import { MainBusSegment } from "./MainBusSegment";
import { ProducerBufferDisplay } from "./ProducerBufferDisplay";
import {
  entityIconLookupByKind,
  ProducerHasInput,
  ProducerHasOutput,
} from "../utils";
import { UIAction } from "../uiState";
import { showChangeProducerRecipeSelector } from "./selectors";
import { useIconSelector } from "../IconSelectorProvider";

export type ProducerCardProps = {
  producer: Producer;
  dispatch: (a: GameAction) => void;
  uiDispatch: (a: UIAction) => void;
  buildingIdx: number;
  mainBus: MainBus;
  regionalOre: Map<string, EntityStack>;
  handleDrag: (evt: SyntheticEvent) => void;
  handleDrop: (evt: SyntheticEvent) => void;
};

const ProducerTypeIconMap: { [key: string]: string } = {
  Factory: "assembling-machine-1",
  Smelter: "stone-furnace",
  Extractor: "electric-mining-drill",
  ChemFactory: "",
  Refinery: "",
  Pumpjack: "",
  Lab: "lab",
};

const ProducerIcon = (p: Producer): string => ProducerTypeIconMap[p.kind];

export const ProducerCard = ({
  producer,
  buildingIdx,
  dispatch,
  uiDispatch,
  handleDrag,
  handleDrop,
  mainBus,
  regionalOre,
}: ProducerCardProps) => {
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e: SyntheticEvent) => {
    //console.log("drag over");
    e.preventDefault();
    e.stopPropagation();
  };

  const moveUp = () => {
    GameDispatch({
      type: "ReorderBuildings",
      buildingIdx: buildingIdx,
      dropBuildingIdx: buildingIdx - 1,
    });
  };

  const moveDown = () => {
    GameDispatch({
      type: "ReorderBuildings",
      buildingIdx: buildingIdx,
      dropBuildingIdx: buildingIdx + 1,
    });
  };

  const removeBuilding = () => {
    GameDispatch({
      type: "RemoveBuilding",
      buildingIdx: buildingIdx,
    });
  };

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

    // Labs should only input from bus
    //
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
    <div
      className="producerCard"
      draggable={dragging}
      id={`b-${buildingIdx}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragStart={handleDrag}
    >
      <div
        className="dragArea"
        onMouseDown={() => setDragging(true)}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchStart={() => setDragging(true)}
        onTouchEnd={() => setDragging(false)}
      >
        <span onClick={moveUp} className="material-icons arrow">
          arrow_upward
        </span>
        <span className="material-icons">reorder</span>
        <span onClick={moveDown} className="material-icons arrow">
          arrow_downward
        </span>
        <span onDoubleClick={removeBuilding} className="material-icons arrow">
          close
        </span>
      </div>
      <div className="mainArea">
        <div className="topArea">
          <div className="title">{producer.RecipeId /* TODO Fix name */}</div>
          <div className="producerCountArea">
            <span className={`icon ${ProducerIcon(producer)}`} />
            <div
              className="plusMinus"
              onClick={() =>
                dispatch({
                  type: "DecreaseProducerCount",
                  buildingIdx,
                })
              }
            >
              -
            </div>
            <div className="producerCount">{producer.ProducerCount}</div>
            <div
              className="plusMinus"
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
        <div className="bottomArea">
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
          <ProducerBufferDisplay
            inputBuffers={recipeInput}
            outputBuffers={producer.outputBuffers}
            doubleClickHandler={entityIconDoubleClickHandler}
            entityIconLookup={entityIconLookupByKind(producer.kind)}
          />
        </div>
      </div>
      <div className="outputArea">
        <div
          className="outputArrow up"
          onClick={() =>
            dispatch({
              type: "ToggleUpperOutputState",
              buildingIdx,
            })
          }
        >
          {producer.outputStatus.above === "OUT" ? "^" : "-"}
        </div>
        <div className="outputArrow right">&gt;</div>
        <div
          className="outputArrow down"
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

function producerTypeFromBuildingKind(kind: string, subkind: string): string {
  switch (kind) {
    case "Factory":
      return "Assembler";
    case "Extractor":
      switch (subkind) {
        case "electric-mining-drill":
          return "Miner";
      }
  }
  return "";
}

/* if (r && r.ProducerType === "RocketSilo") Buildings.push(NewFactory(r));
   if (r && r.ProducerType === "Assembler") Buildings.push(NewFactory(r));
   if (r && r.ProducerType === "Smelter") Buildings.push(NewFactory(r));
   if (r && r.ProducerType === "Miner") Buildings.push(NewExtractor(r));
   if (r && r.ProducerType === "ChemPlant") Buildings.push(NewFactory(r));
   if (r && r.ProducerType === "Refinery") Buildings.push(NewFactory(r));
   if (r && r.ProducerType === "Pumpjack") Buildings.push(NewExtractor(r));
   if (r && r.ProducerType === "WaterPump") */
