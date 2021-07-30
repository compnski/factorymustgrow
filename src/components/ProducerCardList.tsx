import { ProducerCard } from "./ProducerCard";
import { FactoryGameState, GameDispatch } from "../factoryGame";
import { EntityStack, MainBus, Producer } from "../types";
import { SyntheticEvent, useState } from "react";

export const ProducerCardList = ({
  buildings,
  mainBus,
  regionalOre,
}: {
  buildings: Producer[];
  mainBus: MainBus;
  regionalOre: Map<string, EntityStack>;
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
        regionalOre={regionalOre}
        handleDrag={handleDrag(idx)}
        handleDrop={handleDrop(idx)}
      />
    );
  });

  return <div className="producerCardList">{cards}</div>;
};
