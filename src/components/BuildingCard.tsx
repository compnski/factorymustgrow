import { GameAction, GameDispatch } from "../factoryGame";
import { EntityStack, Producer } from "../types";
import "./BuildingCard.scss";
import { SyntheticEvent, useState } from "react";
import { MainBusSegment } from "./MainBusSegment";
import { BuildingHasInput, BuildingHasOutput } from "../utils";
import { UIAction } from "../uiState";
import { ProducerCard } from "./ProducerCard";
import { Building } from "../building";
import { BeltLineCard } from "./BeltLineCard";
import { MainBus } from "../mainbus";

export type BuildingCardProps = {
  building: Building;
  dispatch: (a: GameAction) => void;
  uiDispatch: (a: UIAction) => void;
  buildingIdx: number;
  mainBus: MainBus;
  regionalOre: Map<string, EntityStack>;
  handleDrag: (evt: SyntheticEvent) => void;
  handleDrop: (evt: SyntheticEvent) => void;
};

export const BuildingCard = ({
  building,
  buildingIdx,
  dispatch,
  uiDispatch,
  mainBus,
  regionalOre,
  handleDrag,
  handleDrop,
}: BuildingCardProps) => {
  const busLaneClicked = (laneId: number, entity: string) => {
    if (
      building.outputStatus.beltConnections.filter((v) => v.beltId === laneId)
        .length > 0
    )
      return;

    if (
      BuildingHasOutput(building.kind) &&
      building.outputBuffers.has(entity)
    ) {
      building.outputStatus.beltConnections.push({
        direction: "TO_BUS",
        beltId: laneId,
      });
    }
    if (BuildingHasInput(building.kind) && building.inputBuffers)
      if (building.inputBuffers.has(entity)) {
        building.outputStatus.beltConnections.push({
          direction: "FROM_BUS",
          beltId: laneId,
        });
      }
  };
  const beltConnectionClicked = (laneId: number) => {
    const connectIdx = building.outputStatus.beltConnections.findIndex(
      (v) => v.beltId === laneId
    );
    building.outputStatus.beltConnections.splice(connectIdx, 1);
  };
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

  const card =
    building.kind === "BeltLineDepot" ? (
      <BeltLineCard building={building} buildingIdx={buildingIdx} />
    ) : (
      <ProducerCard
        producer={building as Producer}
        buildingIdx={buildingIdx}
        regionalOre={regionalOre}
      />
    );

  return (
    <div
      className="producer-card"
      draggable={dragging}
      id={`b-${buildingIdx}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragStart={handleDrag}
    >
      <div
        className="drag-area"
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

      {card}

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
          {building.outputStatus.above === "OUT" ? "^" : "-"}
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
          {building.outputStatus.below === "OUT" ? "v" : "-"}
        </div>
      </div>
      <MainBusSegment
        mainBus={mainBus}
        busLaneClicked={busLaneClicked}
        beltConnectionClicked={beltConnectionClicked}
        segmentHeight={100}
        beltConnections={building.outputStatus.beltConnections}
      />
    </div>
  );
};
