import { SyntheticEvent, useState } from "react";
import { InserterIdForBuilding } from "../building";
import { GameAction } from "../GameAction";
import { ImmutableMap } from "../immutable";
import { ReadonlyMainBus } from "../mainbus";
import { Region } from "../types";
import {
  ReadonlyBuildingSlot,
  ReadonlyItemBuffer,
  ReadonlyResearchState,
} from "../useGameState";
import { showUserError } from "../utils";
import { BuildingCard } from "./BuildingCard";
import { InserterCard } from "./InserterCard";

export const BuildingCardList = ({
  region,
  mainBus,
  regionalOre,
  inventory,
  researchState,
  uxDispatch,
  regions,
}: {
  region: { Id: string; BuildingSlots: ReadonlyBuildingSlot[] };
  mainBus: ReadonlyMainBus;
  regionalOre: ReadonlyItemBuffer;
  inventory: ReadonlyItemBuffer;
  researchState: ReadonlyResearchState;
  uxDispatch: (a: GameAction) => void;
  regions: ImmutableMap<string, Region>;
}) => {
  const regionId = region.Id;
  const [dragIdx, setDragIdx] = useState(-1);

  const handleDrag = (buildingIdx: number) => () => {
    console.log("drag start");
    setDragIdx(buildingIdx);
    //e.preventDefault();
    //e.stopPropagation();
  };

  const handleDrop =
    (dropIdx: number, isDropOnLastBuilding: boolean) => (e: SyntheticEvent) => {
      console.log(dragIdx, dropIdx);
      uxDispatch({
        type: "ReorderBuildings",
        regionId,
        buildingIdx: dragIdx,
        dropBuildingIdx: dropIdx,
        isDropOnLastBuilding,
      });
      e.preventDefault();
      //e.stopPropagation();
    };

  const moveUp = (buildingIdx: number) => {
    for (let i = buildingIdx; i >= 0; i--) {
      if (region.BuildingSlots[i].Building.kind === "Empty") {
        uxDispatch({
          type: "ReorderBuildings",
          regionId,
          buildingIdx: buildingIdx,
          dropBuildingIdx: i,
          isDropOnLastBuilding: false,
        });
        return;
      }
    }
    showUserError("No empty slot found");
    return;
  };

  const moveDown = (buildingIdx: number) => {
    for (let i = buildingIdx; i < region.BuildingSlots.length; i++) {
      if (region.BuildingSlots[i].Building.kind === "Empty") {
        uxDispatch({
          type: "ReorderBuildings",
          regionId,
          buildingIdx: buildingIdx,
          dropBuildingIdx: i,
          isDropOnLastBuilding: false,
        });
        return;
      }
    }
    showUserError("No empty slot found");
    return;
  };

  const cards = region.BuildingSlots.map((buildingSlot, idx) => {
    const isFirstBuilding = idx === 0,
      isLastBuilding = idx === region.BuildingSlots.length - 1,
      allowsDrop = buildingSlot.Building.kind === "Empty" || isLastBuilding;

    return (
      <div key={idx}>
        {isFirstBuilding && (
          <div key="i-top" className="inserter-card wide">
            <div className="inserter-rectangle" />
          </div>
        )}
        <BuildingCard
          key={`b-${idx}`}
          regionId={regionId}
          buildingIdx={idx}
          buildingSlot={buildingSlot}
          building={buildingSlot.Building}
          mainBus={mainBus}
          uxDispatch={uxDispatch}
          regionalOre={regionalOre}
          inventory={inventory}
          handleDrag={handleDrag(idx)}
          handleDrop={allowsDrop ? handleDrop(idx, isLastBuilding) : undefined}
          moveUp={() => moveUp(idx)}
          moveDown={() => moveDown(idx)}
          researchState={researchState}
          regions={regions}
        />
        {!isLastBuilding && (
          <InserterCard
            key={`i-${idx}`}
            variant="wide"
            inserter={buildingSlot.Inserter}
            inserterId={InserterIdForBuilding(regionId, idx)}
            uxDispatch={uxDispatch}
          />
        )}
      </div>
    );
  });

  return <div className="producerCardList">{cards}</div>;
};
