import { BuildingCard } from "./BuildingCard";
import { GameDispatch } from "../factoryGame";
import { EntityStack, ItemBuffer } from "../types";
import { SyntheticEvent, useState } from "react";
import { UIAction } from "../uiState";
import { Building } from "../building";
import { MainBus } from "../mainbus";

export const BuildingCardList = ({
  buildings,
  mainBus,
  regionalOre,
  uiDispatch,
}: {
  buildings: Building[];
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

  const handleDrop = (dropIdx: number) => (e: SyntheticEvent) => {
    console.log(dragIdx, dropIdx);
    GameDispatch({
      type: "ReorderBuildings",
      buildingIdx: dragIdx,
      dropBuildingIdx: dropIdx,
    });
    //e.preventDefault();
    //e.stopPropagation();
  };

  const cards = buildings.map((ep, idx) => {
    return (
      <BuildingCard
        key={idx}
        buildingIdx={idx}
        building={ep}
        mainBus={mainBus}
        dispatch={GameDispatch}
        uiDispatch={uiDispatch}
        regionalOre={regionalOre}
        handleDrag={handleDrag(idx)}
        handleDrop={handleDrop(idx)}
      />
    );
  });

  return <div className="producerCardList">{cards}</div>;
};
