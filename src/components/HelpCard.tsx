import { Map } from "immutable";
import { SyntheticEvent } from "react";
import { NewBuildingSlot } from "../building";
import { FactoryGameState, ReadonlyResearchState } from "../factoryGameState";
import { ReactComponent as HelpOverlay } from "../helpTemplate.svg";
import { ImmutableMap } from "../immutable";
import { NewInserter } from "../inserter";
import { ReadonlyInventory } from "../inventory";
import { NewExtractorForRecipe, NewFactoryForRecipe } from "../production";
import { GetRegionInfo } from "../region";
import { EntityStack, NewRegionFromInfo } from "../types";
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

  helpRegion.Bus.Belts = [
    {
      laneIdx: 1,
      upperSlotIdx: 1,
      lowerSlotIdx: 3,
      entity: "iron-plate",
      endDirection: "NONE",
      beltDirection: "DOWN",
      internalBeltBuffer: new Array(5),
    },
    {
      laneIdx: 2,
      upperSlotIdx: 0,
      lowerSlotIdx: 3,
      entity: "transport-belt",
      endDirection: "NONE",
      beltDirection: "UP",
      internalBeltBuffer: new Array(5),
    },
  ];

  helpRegion.BuildingSlots = [
    NewBuildingSlot(miner, 3, NewInserter(1, "DOWN")),
    NewBuildingSlot(
      smelter,
      [
        {
          Inserter: NewInserter(1, "TO_BUS"),
          laneId: 1,
        },
        { Inserter: NewInserter(), laneId: undefined },
        { Inserter: NewInserter(), laneId: undefined },
      ],
      NewInserter(1, "DOWN")
    ),
    NewBuildingSlot(assembler, 3, NewInserter(1, "DOWN")),
    NewBuildingSlot(assembler2, [
      {
        Inserter: NewInserter(1, "FROM_BUS"),
        laneId: 1,
      },
      {
        Inserter: NewInserter(1, "TO_BUS"),
        laneId: 2,
      },
      { Inserter: NewInserter(), laneId: undefined },
    ]),
  ];

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
  TruckLines: ImmutableMap(),
  RocketLaunchingAt: 0,
  LastTick: 0,
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
            beltHandler={() => false}
            ghostConnection={undefined}
            beltInserterMouseDown={() => false}
            beltState={helpRegion.Bus.Belts}
          />
          <HelpOverlay />
        </div>
      </div>
    </div>
  );
};
