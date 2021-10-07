import { BuildingCard } from "./BuildingCard";
import { GameDispatch } from "../GameDispatch";
import { ItemBuffer } from "../types";
import { SyntheticEvent, useState } from "react";
import { UIAction } from "../uiState";
import { Building } from "../building";
import { MainBus } from "../mainbus";
import { InserterCard } from "./InserterCard";
import { Inserter } from "../inserter";

export const BuildingCardList = ({
  region,
  mainBus,
  regionalOre,
  uiDispatch,
}: {
  region: { Buildings: Building[]; Inserters: Inserter[] };
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

  const cards = region.Buildings.map((ep, idx) => {
    const isLastBuilding = idx === region.Buildings.length - 1,
      allowsDrop = ep.kind === "Empty" || isLastBuilding;

    return (
      <>
        <BuildingCard
          key={idx}
          buildingIdx={idx}
          building={ep}
          mainBus={mainBus}
          dispatch={GameDispatch}
          uiDispatch={uiDispatch}
          regionalOre={regionalOre}
          handleDrag={handleDrag(idx)}
          handleDrop={allowsDrop ? handleDrop(idx, isLastBuilding) : undefined}
        />
        {!isLastBuilding && (
          <InserterCard inserter={region.Inserters[idx]} inserterIdx={idx} />
        )}
      </>
    );
  });

  return <div className="producerCardList">{cards}</div>;
};
