import { GameAction, GameDispatch } from "../factoryGame";
import { MainBus, Producer, Recipe } from "../types";
import { GetEntity, GetRecipe } from "../gen/entities";
import "./ProducerCard.scss";
import { SyntheticEvent, useState } from "react";
import { MainBusSegment } from "./MainBusSegment";
const RecipeDisplay = ({
  recipe,
  producer,
}: {
  recipe: Recipe;
  producer: Producer;
}) => (
  <div className="recipeDisplay">
    {recipe.Input.map((x, i) => {
      const producerCount = producer.inputBuffers?.get(x.Entity)?.Count || 0;
      return (
        <span key={i}>
          <span>
            {x.Count}/{Math.floor(producerCount)}
          </span>
          <span className={`icon ${GetEntity(x.Entity).Id}`} />
        </span>
      );
    })}
    <span>=&gt;</span>
    <span>
      <span>
        {recipe.Output.Count}/{Math.floor(producer.outputBuffer?.Count || 0)}
      </span>
      <div className={`icon ${GetEntity(recipe.Output.Entity).Id}`} />
    </span>
  </div>
);

export type ProducerCardProps = {
  producer: Producer;
  dispatch: (a: GameAction) => void;
  buildingIdx: number;
  mainBus: MainBus;
  handleDrag: (evt: SyntheticEvent) => void;
  handleDrop: (evt: SyntheticEvent) => void;
};

const ProducerTypeIconMap: { [key: string]: string } = {
  Assembler: "assembling-machine-1",
  Smelter: "stone-furnace",
  Miner: "electric-mining-drill",
  ChemFactory: "",
  Refinery: "",
  Pumpjack: "",
};

const ProducerIcon = (r: Recipe): string => ProducerTypeIconMap[r.ProducerType];

export const ProducerCard = ({
  producer,
  buildingIdx,
  dispatch,
  handleDrag,
  handleDrop,
  mainBus,
}: ProducerCardProps) => {
  const [dragging, setDragging] = useState(false);
  const recipe = GetRecipe(producer.RecipeId);

  const handleDragOver = (e: SyntheticEvent) => {
    //console.log("drag over");
    e.preventDefault();
    e.stopPropagation();
  };

    const moveUp = ()=>{
            GameDispatch ({
                type: "ReorderBuildings",
                buildingIdx: buildingIdx,
                dropBuildingIdx: buildingIdx-1,
            })};


    const moveDown = ()=>{
            GameDispatch ({
                type: "ReorderBuildings",
                buildingIdx: buildingIdx,
                dropBuildingIdx: buildingIdx+1,
            });
    }

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
                    <span                   onClick={moveUp} className="material-icons arrow">arrow_upward</span>
                    <span className="material-icons">reorder</span>
                    <span
                        onClick={moveDown}

                        className="material-icons arrow">arrow_downward</span>
                </div>
                <div className="mainArea">
                    <div className="topArea">
                        <div className="title">{recipe.Name}</div>
                        <div className="producerCountArea">
                            <span className={`icon ${ProducerIcon(recipe)}`} />
                            <div
                                className="plusMinus"
                                onClick={() =>
                                    dispatch({
                                        type: "DecreaseProducerCount",
                                        buildingIdx,
                                        producerName: producer.RecipeId,
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
                                        producerName: producer.RecipeId,
                                    })
                                }
                            >
                                +
                            </div>
                        </div>
                    </div>
                    <div className="bottomArea">
                        <RecipeDisplay producer={producer} recipe={recipe} />
                    </div>
                </div>
                <div className="outputArea">
                    <div
                        className="outputArrow up"
                        onClick={() =>
                            dispatch({
                                type: "ToggleUpperOutputState",
                                buildingIdx,
                                producerName: producer.RecipeId,
                            })
                        }
                    >
                        {producer.outputStatus.above == "OUT" ? "^" : "-"}
                    </div>
                    <div className="outputArrow right">&gt;</div>
                    <div
                        className="outputArrow down"
                        onClick={() =>
                            dispatch({
                                type: "ToggleLowerOutputState",
                                buildingIdx,
                                producerName: producer.RecipeId,
                            })
                        }
                    >
                        {producer.outputStatus.below == "OUT" ? "v" : "-"}
                    </div>
                </div>
                <MainBusSegment
                    mainBus={mainBus}
                    producer={producer}
                    buildingIdx={buildingIdx}
                />
            </div>
        );
};
