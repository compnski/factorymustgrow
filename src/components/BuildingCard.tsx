import { SyntheticEvent, useState } from "react";
import { InserterIdForBelt } from "../building";
import {
  FactoryGameState,
  ReadonlyBuildingSlot,
  ReadonlyRegion,
} from "../factoryGameState";
import { GameAction } from "../GameAction";
import { Belt, BeltHandlerFunc } from "../types";
import { BuildingHasInput, BuildingHasOutput } from "../utils";
import "./BuildingCard.scss";
import { EmptyLaneCard } from "./EmptyLaneCard";
import { HTMLMainBusSegment } from "./HTMLMainBusSegment";
import { InserterCard } from "./InserterCard";
import { LabCard } from "./LabCard";
import { ProducerCard } from "./ProducerCard";
import { RocketSiloCard } from "./RocketSiloCard";
import { StorageCard } from "./StorageCard";
import { TruckLineCard } from "./TruckLineCard";

export type BuildingCardProps = {
  buildingSlot: ReadonlyBuildingSlot;
  buildingIdx: number;
  uxDispatch: (a: GameAction) => void;
  handleDrag: (evt: SyntheticEvent) => void;
  handleDrop: undefined | ((evt: SyntheticEvent) => void);
  moveUp: (evt: SyntheticEvent) => void;
  moveDown: (evt: SyntheticEvent) => void;
  region: ReadonlyRegion;
  gameState: FactoryGameState;
  beltHandler: BeltHandlerFunc;
  beltState: Belt[];
};

export const BuildingCard = ({
  buildingSlot,
  buildingIdx,
  handleDrag,
  handleDrop,
  moveUp,
  moveDown,
  region: {
    Id: regionId,
    Ore: regionalOre,
    Bus: regionalBus,
    BuildingSlots: buildingSlots,
  },
  uxDispatch,
  gameState,
  beltHandler,
  beltState,
}: BuildingCardProps) => {
  // TOOD: Change to use Events
  const building = buildingSlot.Building;
  const busLaneClicked = (laneId: number, entity: string) => {
    if (BuildingHasOutput(building, entity)) {
      uxDispatch({
        type: "AddMainBusConnection",
        regionId,
        buildingIdx: buildingIdx,
        laneId,
        direction: "TO_BUS",
      });
    } else if (BuildingHasInput(building, entity)) {
      uxDispatch({
        type: "AddMainBusConnection",
        regionId,
        buildingIdx: buildingIdx,
        laneId,
        direction: "FROM_BUS",
      });
    }
  };

  const beltConnectionClicked = (connectionIdx: number) => {
    uxDispatch({
      type: "RemoveMainBusConnection",
      regionId,
      buildingIdx: buildingIdx,
      connectionIdx,
    });
  };
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e: SyntheticEvent) => {
    //console.log("drag over");
    e.preventDefault();
    e.stopPropagation();
  };

  const removeBuilding = () => {
    uxDispatch({
      type: "RemoveBuilding",
      regionId,
      buildingIdx: buildingIdx,
    });
  };
  const card =
    building.kind === "TruckLineDepot" ? (
      <TruckLineCard
        building={building}
        regionId={regionId}
        buildingIdx={buildingIdx}
        uxDispatch={uxDispatch}
        truckLines={gameState.TruckLines}
      />
    ) : building.kind === "Chest" ? (
      <StorageCard
        storage={building}
        regionId={regionId}
        buildingIdx={buildingIdx}
        inventory={gameState.Inventory}
        uxDispatch={uxDispatch}
      />
    ) : building.kind === "Empty" ? (
      <EmptyLaneCard
        regionId={regionId}
        buildingIdx={buildingIdx}
        inventory={gameState.Inventory}
        regions={gameState.Regions}
        researchState={gameState.Research}
      />
    ) : building.kind === "Lab" ? (
      <LabCard
        building={building}
        regionId={regionId}
        buildingIdx={buildingIdx}
        researchState={gameState.Research}
        uxDispatch={uxDispatch}
      />
    ) : building.subkind === "rocket-silo" ? (
      <RocketSiloCard
        building={building}
        regionId={regionId}
        buildingIdx={buildingIdx}
        uxDispatch={uxDispatch}
      />
    ) : (
      <ProducerCard
        producer={building}
        regionId={regionId}
        buildingIdx={buildingIdx}
        regionalOre={regionalOre}
        researchState={gameState.Research}
        uxDispatch={uxDispatch}
      />
    );

  const beltInserters = buildingSlot.BeltConnections.map((beltConn, idx) => (
    <InserterCard
      key={idx}
      variant="small"
      inserter={beltConn.Inserter}
      inserterId={InserterIdForBelt(regionId, buildingIdx, idx)}
      uxDispatch={uxDispatch}
    />
  ));
  const isEmpty = building.kind === "Empty";
  const canGoUp = !isEmpty && buildingIdx > 0;
  const canGoDown = !isEmpty && buildingIdx < buildingSlots.length - 1;
  return (
    <div className="producer-card-container">
      <div
        className={`producer-card kind-${building.kind}`}
        draggable={!isEmpty && dragging}
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
          <span
            onClick={moveUp}
            className={`material-icons arrow ${
              canGoUp ? "cursor-pointer" : "disabled"
            }`}
          >
            arrow_upward
          </span>
          <span
            className={`material-icons ${isEmpty ? "disabled" : "cursor-grab"}`}
          >
            reorder
          </span>
          <span
            onClick={moveDown}
            className={`material-icons arrow  ${
              canGoDown ? "cursor-pointer" : "disabled"
            }`}
          >
            arrow_downward
          </span>
          <span
            onDoubleClick={removeBuilding}
            className={`material-icons ${
              isEmpty ? "disabled" : "cursor-pointer"
            }`}
          >
            close
          </span>
        </div>

        {card}
        <div className="output-area">{beltInserters}</div>
      </div>
      <HTMLMainBusSegment
        mainBus={regionalBus}
        busLaneClicked={busLaneClicked}
        beltConnectionClicked={beltConnectionClicked}
        segmentHeight={136}
        beltConnections={buildingSlot.BeltConnections}
        buildingIdx={buildingIdx}
        beltHandler={beltHandler}
        beltState={beltState}
      />
    </div>
  );
};
