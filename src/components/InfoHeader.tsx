import { Region } from "../types";

export type InfoHeaderProps = { gameState: { Region: Region } };

export const InfoHeader = ({ gameState }: InfoHeaderProps) => {
  const oreInfo = gameState.Region.Ore;
  const infoCards = [...oreInfo.values()].map(({ Entity, Count }) => (
    <div key={Entity} className="topInfo">
      <div className={`icon ${Entity}`} />
      <div className="oreText">{Math.floor(Count)}</div>
    </div>
  ));

  const remainingSpace = gameState.Region.BuildingCapacity;
  return (
    <div className="infoCard">
      {infoCards}
      <div className="topInfo">
        <div className={`icon landfill`} />
        <div className="oreText">{Math.floor(remainingSpace)}</div>
      </div>
    </div>
  );
};
