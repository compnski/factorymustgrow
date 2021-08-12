import { ProducerCard } from "./ProducerCard";
import { GameDispatch } from "../factoryGame";
import { EntityStack, MainBus, Producer } from "../types";
import { SyntheticEvent, useState } from "react";
import { UIAction } from "../uiState";

export const ProducerCardList = ({
  buildings,
  mainBus,
  regionalOre,
  uiDispatch,
}: {
  buildings: Producer[];
  mainBus: MainBus;
  regionalOre: Map<string, EntityStack>;
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
      <ProducerCard
        key={idx}
        buildingIdx={idx}
        producer={ep}
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
