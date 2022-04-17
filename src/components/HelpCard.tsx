import { SyntheticEvent } from "react";
import { AddBuildingOverEmptyOrAtEnd, NewBuilding } from "../GameDispatch";
import { Extractor, Factory, UpdateBuildingRecipe } from "../production";
import { GetRegionInfo } from "../region";
import { NewEntityStack, NewRegionFromInfo, Region } from "../types";
import { BuildingCardList } from "./BuildingCardList";
import { ReactComponent as HelpOverlay } from "../helpTemplate.svg";

import "./HelpCard.scss";
import { GameState, ReadonlyRegion } from "../useGameState";
import { ReadonlyMainBus } from "../mainbus";
import { Inventory } from "../inventory";

export type HelpCardProps = {
  onConfirm: (evt: SyntheticEvent, recipe: string) => void;
};

function buildHelpRegion(): Region {
  const regionInfo = GetRegionInfo("HelpRegion"),
    helpRegion = NewRegionFromInfo(regionInfo),
    miner = NewBuilding("burner-mining-drill") as Extractor,
    smelter = NewBuilding("stone-furnace") as Factory,
    assembler = NewBuilding("assembling-machine-1") as Factory,
    assembler2 = NewBuilding("assembling-machine-1") as Factory;

  UpdateBuildingRecipe(miner, "iron-ore");
  UpdateBuildingRecipe(smelter, "iron-plate");
  UpdateBuildingRecipe(assembler, "iron-gear-wheel");
  UpdateBuildingRecipe(assembler2, "transport-belt");

  miner.outputBuffers.Add(NewEntityStack("iron-ore", 10));
  smelter.outputBuffers.Add(NewEntityStack("iron-plate", 10));
  assembler.outputBuffers.Add(NewEntityStack("iron-gear-wheel", 10));

  const minerSlot = AddBuildingOverEmptyOrAtEnd(helpRegion, miner, 0),
    smelterSlot = AddBuildingOverEmptyOrAtEnd(helpRegion, smelter, 1),
    assemblerSlot = AddBuildingOverEmptyOrAtEnd(helpRegion, assembler, 2),
    assemblerSlot2 = AddBuildingOverEmptyOrAtEnd(helpRegion, assembler2, 3);

  [minerSlot, smelterSlot, assemblerSlot].forEach((s) => {
    s.Inserter.direction = "DOWN";
    s.Inserter.BuildingCount = 1;
  });

  const plateLaneId = helpRegion.Bus.AddLane("iron-plate", 10);
  let bc = smelterSlot.BeltConnections[0];
  bc.direction = "TO_BUS";
  bc.Inserter.direction = "TO_BUS";
  bc.Inserter.BuildingCount = 1;
  bc.laneId = plateLaneId;

  const beltLaneId = helpRegion.Bus.AddLane("transport-belt", 10);

  bc = assemblerSlot2.BeltConnections[0];
  bc.direction = "FROM_BUS";
  bc.Inserter.direction = "FROM_BUS";
  bc.Inserter.BuildingCount = 1;
  bc.laneId = plateLaneId;

  bc = assemblerSlot2.BeltConnections[1];
  bc.direction = "TO_BUS";
  bc.Inserter.direction = "TO_BUS";
  bc.Inserter.BuildingCount = 1;
  bc.laneId = beltLaneId;

  return helpRegion;
}

const inventory = new Inventory();

const helpRegion = buildHelpRegion() as ReadonlyRegion;

export const HelpCard = function HelpCard({ onConfirm }: HelpCardProps) {
  return (
    <div className="modal help-card">
      <div className="inner-frame">
        <span
          className="material-icons close-icon clickable"
          onClick={(evt) => onConfirm(evt, "")}
        >
          close
        </span>
        <div className="help-text">
          <div>Goal: Launch a rocket!</div>
          <div style={{ fontSize: 16 }}>
            Build a lab to research technologies and expand what your factory
            can produce.
          </div>
        </div>
        <div className="inner-content">
          <BuildingCardList
            mainBus={new ReadonlyMainBus(helpRegion.Bus)}
            region={helpRegion}
            regionalOre={helpRegion.Ore}
            inventory={inventory}
            researchState={GameState.Research}
          />
          <HelpOverlay />
        </div>
      </div>
    </div>
  );
};
