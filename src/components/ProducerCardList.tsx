import { ProducerCard } from "./ProducerCard";
import { FactoryGameState, GameDispatch } from "../factoryGame";
import { Producer } from "../types";
import { SyntheticEvent, useState } from "react";

export const ProducerCardList = ({ buildings }: { buildings: Producer[] }) => {
  const [dragIdx, setDragIdx] = useState(-1);

  const handleDragOver = (e: SyntheticEvent) => {
    //console.log("drag over");
    //e.preventDefault();
    //e.stopPropagation();
  };

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
        dispatch={GameDispatch}
        handleDrag={handleDrag(idx)}
        handleDrop={handleDrop(idx)}
      />
    );
  });

  return <div className="producerCardList">{cards}</div>;
};
