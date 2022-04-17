import { SyntheticEvent, useState } from "react";
import { InserterIdForBelt } from "../building";
import { GameAction } from "../GameAction";
import { GameDispatch } from "../GameDispatch";
import { ReadonlyMainBus } from "../mainbus";
import {
  ReadonlyBuilding,
  ReadonlyBuildingSlot,
  ReadonlyItemBuffer,
  ReadonlyResearchState,
} from "../useGameState";
import { BuildingHasInput, BuildingHasOutput } from "../utils";
import { BeltLineCard } from "./BeltLineCard";
import "./BuildingCard.scss";
import { EmptyLaneCard } from "./EmptyLaneCard";
import { InserterCard } from "./InserterCard";
import { LabCard } from "./LabCard";
import { MainBusSegment } from "./MainBusSegment";
import { ProducerCard } from "./ProducerCard";
import { RocketSiloCard } from "./RocketSiloCard";
import { StorageCard } from "./StorageCard";

export type BuildingCardProps = {
  building: ReadonlyBuilding;
  buildingSlot: ReadonlyBuildingSlot;
  dispatch: (a: GameAction) => void;
  buildingIdx: number;
  mainBus: ReadonlyMainBus;
  regionalOre: ReadonlyItemBuffer;
  handleDrag: (evt: SyntheticEvent) => void;
  handleDrop: undefined | ((evt: SyntheticEvent) => void);
  moveUp: (evt: SyntheticEvent) => void;
  moveDown: (evt: SyntheticEvent) => void;
  regionId: string;
  inventory: ReadonlyItemBuffer;
  researchState: ReadonlyResearchState;
};

export const BuildingCard = ({
  building,
  buildingSlot,
  buildingIdx,
  mainBus,
  regionalOre,
  handleDrag,
  handleDrop,
  moveUp,
  moveDown,
  regionId,
  inventory,
  researchState,
}: BuildingCardProps) => {
  // TOOD: Change to use Events
  const busLaneClicked = (laneId: number, entity: string) => {
    if (BuildingHasOutput(building, entity)) {
      GameDispatch({
        type: "AddMainBusConnection",
        regionId,
        buildingIdx: buildingIdx,
        laneId,
        direction: "TO_BUS",
      });
    } else if (BuildingHasInput(building, entity)) {
      GameDispatch({
        type: "AddMainBusConnection",
        regionId,
        buildingIdx: buildingIdx,
        laneId,
        direction: "FROM_BUS",
      });
    }
  };

  const beltConnectionClicked = (connectionIdx: number) => {
    GameDispatch({
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
    GameDispatch({
      type: "RemoveBuilding",
      regionId,
      buildingIdx: buildingIdx,
    });
  };

  const card =
    building.kind === "BeltLineDepot" ? (
      <BeltLineCard
        building={building}
        regionId={regionId}
        buildingIdx={buildingIdx}
      />
    ) : building.kind === "Chest" ? (
      <StorageCard
        storage={building}
        regionId={regionId}
        buildingIdx={buildingIdx}
        inventory={inventory}
      />
    ) : building.kind === "Empty" ? (
      <EmptyLaneCard
        regionId={regionId}
        buildingIdx={buildingIdx}
        inventory={inventory}
      />
    ) : building.kind === "Lab" ? (
      <LabCard
        building={building}
        regionId={regionId}
        buildingIdx={buildingIdx}
        researchState={researchState}
      />
    ) : building.subkind === "rocket-silo" ? (
      <RocketSiloCard
        building={building}
        regionId={regionId}
        buildingIdx={buildingIdx}
      />
    ) : (
      <ProducerCard
        producer={building}
        regionId={regionId}
        buildingIdx={buildingIdx}
        regionalOre={regionalOre}
        researchState={researchState}
      />
    );

  const beltInserters = buildingSlot.BeltConnections.map((beltConn, idx) => (
    <InserterCard
      key={idx}
      variant="small"
      inserter={beltConn.Inserter}
      inserterId={InserterIdForBelt(regionId, buildingIdx, idx)}
    />
  ));
  return (
    <div className="producer-card-container">
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
      </div>
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
