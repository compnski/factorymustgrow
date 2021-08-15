import { BuildingCard } from "./BuildingCard";
import { GameDispatch } from "../factoryGame";
import { EntityStack, MainBus, Producer } from "../types";
import { UIAction } from "../uiState";

export const BuildingCardList = ({
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
  const cards = buildings.map((ep, idx) => {
    return (
      <BuildingCard
        key={idx}
        buildingIdx={idx}
        producer={ep}
        mainBus={mainBus}
        dispatch={GameDispatch}
        uiDispatch={uiDispatch}
        regionalOre={regionalOre}
      />
    );
  });

  return <div className="producer-card-list">{cards}</div>;
};
