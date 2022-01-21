import { BuildingCard } from "./BuildingCard";
import { GameDispatch } from "../GameDispatch";
import { ItemBuffer } from "../types";
import { SyntheticEvent, useState } from "react";
import { UIAction } from "../uiState";
import { Building, BuildingSlot, InserterIdForBuilding } from "../building";
import { MainBus } from "../mainbus";
import { InserterCard } from "./InserterCard";
import { Inserter } from "../inserter";

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

  const cards = region.BuildingSlots.map((buildingSlot, idx) => {
    const isFirstBuilding = idx === 0,
      isLastBuilding = idx === region.BuildingSlots.length - 1,
      allowsDrop = buildingSlot.Building.kind === "Empty" || isLastBuilding;

    return (
      <>
        {isFirstBuilding && (
          <div className="inserter-card wide">
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
        />
        {!isLastBuilding && (
          <InserterCard
            key={`i-${idx}`}
            variant="wide"
            inserter={buildingSlot.Inserter}
            inserterId={InserterIdForBuilding(idx)}
          />
        )}
      </>
    );
  });

  return <div className="producerCardList">{cards}</div>;
};
