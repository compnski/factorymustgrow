import { SyntheticEvent } from "react";
import { AddBuildingOverEmptyOrAtEnd, NewBuilding } from "../GameDispatch";
import { Extractor, Factory, UpdateBuildingRecipe } from "../production";
import { GetRegionInfo } from "../region";
import { NewEntityStack, NewRegionFromInfo } from "../types";
import { BuildingCardList } from "./BuildingCardList";
import "./HelpCard.scss";

export type HelpCardProps = {
  onConfirm: (evt: SyntheticEvent, recipe: string) => void;
};
export const HelpCard = function HelpCard({}: HelpCardProps) {
  const regionInfo = GetRegionInfo("HelpRegion")!,
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

  const plateLaneId = helpRegion.Bus.AddLane("iron-plate", 10);
  var bc = smelterSlot.BeltConnections[0];
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

  return (
    <div className="modal help-card">
      <div>
        <BuildingCardList
          mainBus={helpRegion.Bus}
          region={helpRegion}
          regionalOre={helpRegion.Ore}
        />
      </div>
    </div>
  );
};
