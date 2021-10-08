import { BuildingCard } from "./BuildingCard";
import { GameDispatch } from "../GameDispatch";
import { ItemBuffer } from "../types";
import { SyntheticEvent, useState } from "react";
import { UIAction } from "../uiState";
import { Building, BuildingSlot } from "../building";
import { MainBus } from "../mainbus";
import { InserterCard } from "./InserterCard";
import { Inserter } from "../inserter";

export const BuildingCardList = ({
  region,
  mainBus,
  regionalOre,
  uiDispatch,
}: {
  region: { BuildingSlots: BuildingSlot[] };
  mainBus: MainBus;
  regionalOre: ItemBuffer;
  uiDispatch: (a: UIAction) => void;
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
    const isLastBuilding = idx === region.BuildingSlots.length - 1,
      allowsDrop = buildingSlot.Building.kind === "Empty" || isLastBuilding;

    return (
      <>
        <BuildingCard
          key={idx}
          buildingIdx={idx}
          building={buildingSlot.Building}
          mainBus={mainBus}
          dispatch={GameDispatch}
          uiDispatch={uiDispatch}
          regionalOre={regionalOre}
          handleDrag={handleDrag(idx)}
          handleDrop={allowsDrop ? handleDrop(idx, isLastBuilding) : undefined}
        />
        {!isLastBuilding && (
          <InserterCard
            variant="wide"
            inserter={buildingSlot.Inserter}
            inserterIdx={idx}
          />
        )}
      </>
    );
  });

  return <div className="producerCardList">{cards}</div>;
};
