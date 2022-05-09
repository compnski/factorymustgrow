import { Map } from "immutable";
import { SyntheticEvent } from "react";
import { NewBuildingSlot } from "../building";
import { ReactComponent as HelpOverlay } from "../helpTemplate.svg";
import { ImmutableMap } from "../immutable";
import { ReadonlyInventory } from "../inventory";
import { ReadonlyMainBus } from "../mainbus";
import { NewExtractorForRecipe, NewFactoryForRecipe } from "../production";
import { GetRegionInfo } from "../region";
import { EntityStack, NewRegionFromInfo } from "../types";
import { FactoryGameState, ReadonlyResearchState } from "../factoryGameState";
import { BuildingCardList } from "./BuildingCardList";
import "./HelpCard.scss";

export type HelpCardProps = {
  onConfirm: (evt: SyntheticEvent, recipe: string) => void;
};

function buildHelpRegion() {
  // TODO: Fix help region, all readonly?

  const regionInfo = GetRegionInfo("HelpRegion"),
    helpRegion = NewRegionFromInfo(regionInfo),
    miner = NewExtractorForRecipe(
      { subkind: "burner-mining-drill" },
      "iron-ore",
      1
    ),
    smelter = NewFactoryForRecipe(
      { subkind: "stone-furnace" },
      "iron-plate",
      1
    ),
    assembler = NewFactoryForRecipe(
      { subkind: "assembling-machine-1" },
      "iron-gear-wheel",
      1
    ),
    assembler2 = NewFactoryForRecipe(
      { subkind: "assembling-machine-1" },
      "transport-belt",
      1
    );

  miner.outputBuffers = miner.outputBuffers.AddItems("iron-ore", 10);
  smelter.outputBuffers = smelter.outputBuffers.AddItems("iron-plate", 10);
  assembler.outputBuffers = assembler.outputBuffers.AddItems(
    "iron-gear-wheel",
    10
  );

  helpRegion.BuildingSlots = [
    NewBuildingSlot(miner),
    NewBuildingSlot(smelter),
    NewBuildingSlot(assembler),
    NewBuildingSlot(assembler2),
  ];

  // TODO: Set up inserters
  // TODO: Set up main bus

  /*
   *     [minerSlot, smelterSlot, assemblerSlot].forEach((s) => {
   *            s.Inserter.direction = "DOWN";
   *            s.Inserter.BuildingCount = 1;
   *     });
   *  */
  /*
   *   const plateLaneId = helpRegion.Bus.AddLane("iron-plate", 10);
   *   let bc = smelterSlot.BeltConnections[0];
   *   bc.direction = "TO_BUS";
   *   bc.Inserter.direction = "TO_BUS";
   *   bc.Inserter.BuildingCount = 1;
   *   bc.laneId = plateLaneId;
   *
   *   const beltLaneId = helpRegion.Bus.AddLane("transport-belt", 10);
   *
   *   bc = assemblerSlot2.BeltConnections[0];
   *   bc.direction = "FROM_BUS";
   *   bc.Inserter.direction = "FROM_BUS";
   *   bc.Inserter.BuildingCount = 1;
   *   bc.laneId = plateLaneId;
   *
   *   bc = assemblerSlot2.BeltConnections[1];
   *   bc.direction = "TO_BUS";
   *   bc.Inserter.direction = "TO_BUS";
   *   bc.Inserter.BuildingCount = 1;
   *   bc.laneId = beltLaneId;
   *  */

  return helpRegion;
}

const researchState: ReadonlyResearchState = {
  Progress: Map<string, Readonly<EntityStack>>(),
  CurrentResearchId: "logistic-science-pack",
};
const region = buildHelpRegion();
const helpRegion = {
  ...region,
  Ore: region.Ore,
  Bus: region.Bus,
};

const helpGameState: FactoryGameState = {
  Research: researchState,
  Regions: ImmutableMap([[helpRegion.Id, helpRegion]]),
  Inventory: new ReadonlyInventory(8),
  BeltLines: ImmutableMap(),
  RocketLaunchingAt: 0,
};

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
            uxDispatch={() => false}
            region={helpRegion}
            gameState={helpGameState}
          />
          <HelpOverlay />
        </div>
      </div>
    </div>
  );
};
