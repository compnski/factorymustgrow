import { Map } from "immutable";
import { SyntheticEvent } from "react";
import { AddBuildingOverEmptyOrAtEnd } from "../GameDispatch";
import { ReactComponent as HelpOverlay } from "../helpTemplate.svg";
import { Inventory } from "../inventory";
import { ReadonlyMainBus } from "../mainbus";
import { NewExtractorForRecipe, NewFactoryForRecipe } from "../production";
import { GetRegionInfo } from "../region";
import { EntityStack, NewRegionFromInfo, Region } from "../types";
import { ReadonlyResearchState } from "../useGameState";
import { BuildingCardList } from "./BuildingCardList";
import "./HelpCard.scss";

export type HelpCardProps = {
  onConfirm: (evt: SyntheticEvent, recipe: string) => void;
};

function buildHelpRegion(): Region {
  // TODO: Fix help region, all readonly?

  const regionInfo = GetRegionInfo("HelpRegion"),
    helpRegion = NewRegionFromInfo(regionInfo),
    miner = NewExtractorForRecipe(
      { subkind: "burner-mining-drill" },
      "iron-ore"
    ),
    smelter = NewFactoryForRecipe({ subkind: "stone-furnace" }, "iron-plate"),
    assembler = NewFactoryForRecipe(
      { subkind: "assembling-machine-1" },
      "iron-gear-wheel"
    ),
    assembler2 = NewFactoryForRecipe(
      { subkind: "assembling-machine-1" },
      "transport-belt"
    );

  miner.outputBuffers = miner.outputBuffers.AddItems("iron-ore", 10);
  smelter.outputBuffers = smelter.outputBuffers.AddItems("iron-plate", 10);
  assembler.outputBuffers = assembler.outputBuffers.AddItems(
    "iron-gear-wheel",
    10
  );

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
const researchState: ReadonlyResearchState = {
  Progress: Map<string, Readonly<EntityStack>>(),
  CurrentResearchId: "logistic-science-pack",
};
const region = buildHelpRegion();
const helpRegion = {
  ...region,
  Ore: region.Ore,
  Bus: new ReadonlyMainBus(region.Bus),
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
            mainBus={new ReadonlyMainBus(helpRegion.Bus)}
            region={helpRegion}
            regionalOre={helpRegion.Ore}
            inventory={inventory}
            researchState={researchState}
          />
          <HelpOverlay />
        </div>
      </div>
    </div>
  );
};
