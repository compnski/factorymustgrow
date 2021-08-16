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
import { ProducerCard } from "./ProducerCard";
import { Building } from "../building";

export type BuildingCardProps = {
  building: Building;
  dispatch: (a: GameAction) => void;
  uiDispatch: (a: UIAction) => void;
  buildingIdx: number;
  mainBus: MainBus;
  regionalOre: Map<string, EntityStack>;
};

export const BuildingCard = ({
  building,
  buildingIdx,
  dispatch,
  uiDispatch,
  mainBus,
  regionalOre,
}: BuildingCardProps) => {
  const busLaneClicked = (laneId: number, entity: string) => {
    if (
      building.outputStatus.beltConnections.filter((v) => v.beltId === laneId)
        .length > 0
    )
      return;

    if (
      ProducerHasOutput(building.kind) &&
      building.outputBuffers.has(entity)
    ) {
      building.outputStatus.beltConnections.push({
        direction: "TO_BUS",
        beltId: laneId,
      });
    }
    if (ProducerHasInput(building.kind) && building.inputBuffers)
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

  const removeBuilding = () => {
    GameDispatch({
      type: "RemoveBuilding",
      buildingIdx: buildingIdx,
    });
  };

  return (
    <div className="producer-card" id={`b-${buildingIdx}`}>
      <span onDoubleClick={removeBuilding} className="material-icons arrow">
        close
      </span>

      <ProducerCard
        producer={building as Producer}
        buildingIdx={buildingIdx}
        regionalOre={regionalOre}
      />

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
