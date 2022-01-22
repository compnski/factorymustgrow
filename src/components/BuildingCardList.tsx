import { BuildingCard } from "./BuildingCard";
import { GameDispatch } from "../GameDispatch";
import { ItemBuffer } from "../types";
import { SyntheticEvent, useState } from "react";
import { UIAction } from "../uiState";
import { Building, BuildingSlot, InserterIdForBuilding } from "../building";
import { MainBus } from "../mainbus";
import { InserterCard } from "./InserterCard";
import { Inserter } from "../inserter";
import { showUserError } from "../utils";

export const BuildingCardList = ({
  region,
  mainBus,
  regionalOre,
}: {
  region: { BuildingSlots: BuildingSlot[] };
  mainBus: MainBus;
  regionalOre: ItemBuffer;
}) => {
  const [dragIdx, setDragIdx] = useState(-1);

  const handleDrag = (buildingIdx: number) => (e: SyntheticEvent) => {
    console.log("drag start");
    setDragIdx(buildingIdx);
    //e.preventDefault();
    //e.stopPropagation();
  };

  const handleDrop =
    (dropIdx: number, isDropOnLastBuilding: boolean) => (e: SyntheticEvent) => {
      console.log(dragIdx, dropIdx);
      GameDispatch({
        type: "ReorderBuildings",
        buildingIdx: dragIdx,
        dropBuildingIdx: dropIdx,
        isDropOnLastBuilding,
      });
      e.preventDefault();
      //e.stopPropagation();
    };

  const moveUp = (buildingIdx: number) => {
    for (var i = buildingIdx; i >= 0; i--) {
      if (region.BuildingSlots[i].Building.kind === "Empty") {
        GameDispatch({
          type: "ReorderBuildings",
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
    for (var i = buildingIdx; i < region.BuildingSlots.length; i++) {
      if (region.BuildingSlots[i].Building.kind === "Empty") {
        GameDispatch({
          type: "ReorderBuildings",
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
          buildingIdx={idx}
          buildingSlot={buildingSlot}
          building={buildingSlot.Building}
          mainBus={mainBus}
          dispatch={GameDispatch}
          regionalOre={regionalOre}
          handleDrag={handleDrag(idx)}
          handleDrop={allowsDrop ? handleDrop(idx, isLastBuilding) : undefined}
          moveUp={() => moveUp(idx)}
          moveDown={() => moveDown(idx)}
        />
        {!isLastBuilding && (
          <InserterCard
            key={`i-${idx}`}
            variant="wide"
            inserter={buildingSlot.Inserter}
            inserterId={InserterIdForBuilding(idx)}
          />
        )}
      </div>
    );
  });

  return <div className="producerCardList">{cards}</div>;
};
