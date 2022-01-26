import "./BuildingCard.scss";

import { GameAction } from "../GameAction";
import { GameDispatch } from "../GameDispatch";
import { ItemBuffer, Producer } from "../types";
import { SyntheticEvent, useState } from "react";
import { MainBusSegment } from "./MainBusSegment";
import { BuildingHasInput, BuildingHasOutput } from "../utils";
import { UIAction } from "../uiState";
import { ProducerCard } from "./ProducerCard";
import {
  Building,
  BuildingSlot,
  InserterIdForBelt,
  InserterIdForBuilding,
} from "../building";
import { BeltLineCard } from "./BeltLineCard";
import { MainBus } from "../mainbus";
import { StorageCard } from "./StorageCard";
import { EmptyLaneCard } from "./EmptyLaneCard";
import { LabCard } from "./LabCard";
import { CounterWithPlusMinusButtons } from "./CounterWithPlusMinusButtons";
import { InserterCard } from "./InserterCard";
import { NewInserter } from "../inserter";
import { RocketSiloCard } from "./RocketSiloCard";

export type BuildingCardProps = {
  building: Building;
  buildingSlot: BuildingSlot;
  dispatch: (a: GameAction) => void;
  buildingIdx: number;
  mainBus: MainBus;
  regionalOre: ItemBuffer;
  handleDrag: (evt: SyntheticEvent) => void;
  handleDrop: undefined | ((evt: SyntheticEvent) => void);
  moveUp: (evt: SyntheticEvent) => void;
  moveDown: (evt: SyntheticEvent) => void;
};

export const BuildingCard = ({
  building,
  buildingSlot,
  buildingIdx,
  dispatch,
  mainBus,
  regionalOre,
  handleDrag,
  handleDrop,
  moveUp,
  moveDown,
}: BuildingCardProps) => {
  // TOOD: Change to use Events
  const busLaneClicked = (laneId: number, entity: string) => {
    if (BuildingHasOutput(building, entity)) {
      GameDispatch({
        type: "AddMainBusConnection",
        buildingIdx: buildingIdx,
        laneId,
        direction: "TO_BUS",
      });
    } else if (BuildingHasInput(building, entity)) {
      GameDispatch({
        type: "AddMainBusConnection",
        buildingIdx: buildingIdx,
        laneId,
        direction: "FROM_BUS",
      });
    }
  };

  const beltConnectionClicked = (connectionIdx: number) => {
    if (!building.outputStatus) return;
    GameDispatch({
      type: "RemoveMainBusConnection",
      buildingIdx: buildingIdx,
      connectionIdx,
    });
    /* const connectIdx = building.outputStatus.beltConnections.findIndex(
     *   (v) => v.beltId === laneId
     * );
     * building.outputStatus.beltConnections.splice(connectIdx, 1); */
  };
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e: SyntheticEvent) => {
    //console.log("drag over");
    e.preventDefault();
    e.stopPropagation();
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
    ) : building.kind === "Chest" ? (
      <StorageCard storage={building} buildingIdx={buildingIdx} />
    ) : building.kind === "Empty" ? (
      <EmptyLaneCard buildingIdx={buildingIdx} />
    ) : building.kind === "Lab" ? (
      <LabCard building={building} buildingIdx={buildingIdx} />
    ) : building.subkind === "rocket-silo" ? (
      <RocketSiloCard building={building} buildingIdx={buildingIdx} />
    ) : (
      <ProducerCard
        producer={building as Producer}
        buildingIdx={buildingIdx}
        regionalOre={regionalOre}
      />
    );

  const beltInserters = buildingSlot.BeltConnections.map((beltConn, idx) => (
    <InserterCard
      key={idx}
      variant="small"
      inserter={beltConn.Inserter}
      inserterId={InserterIdForBelt(buildingIdx, idx)}
    />
  ));
  return (
    <div
      className={`producer-card kind-${building.kind}`}
      draggable={building.kind !== "Empty" && dragging}
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
        <span onDoubleClick={removeBuilding} className="material-icons">
          close
        </span>
      </div>

      {card}
      <div className="output-area">{beltInserters}</div>
      <MainBusSegment
        mainBus={mainBus}
        busLaneClicked={busLaneClicked}
        beltConnectionClicked={beltConnectionClicked}
        segmentHeight={136}
        beltConnections={buildingSlot.BeltConnections}
      />
    </div>
  );
};
