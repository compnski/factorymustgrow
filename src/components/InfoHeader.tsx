import { ResearchState } from "../factoryGame";
import { Region } from "../types";
import { UIAction } from "../uiState";
import { entityIconLookupByKind } from "../utils";

export type InfoHeaderProps = {
  gameState: { CurrentRegion: Region; Research: ResearchState };
  uiDispatch(a: UIAction): void;
};

export const InfoHeader = ({ gameState, uiDispatch }: InfoHeaderProps) => {
  const oreInfo = gameState.CurrentRegion.Ore;
  const infoCards = [...oreInfo.values()].map(({ Entity, Count }) => (
    <div key={Entity} className="top-info">
      <div className={`icon ${Entity}`} />
      <div className="ore-text">{Math.floor(Count)}</div>
    </div>
  ));

  const remainingSpace = gameState.CurrentRegion.BuildingCapacity,
    currentResarch = gameState.Research.CurrentResearchId,
    researchIcon = entityIconLookupByKind("Lab")(currentResarch),
    researchProgress = gameState.Research.Progress.get(currentResarch),
    researchProgressPercent =
      ((researchProgress?.Count || 0) / (researchProgress?.MaxCount || 1)) *
      100;
  return (
    <div className="info-card">
      {infoCards}
      <div className="top-info">
        <div className={`icon landfill`} />
        <div className="ore-text">{Math.floor(remainingSpace)}</div>
      </div>
      <div
        className="top-info science-info"
        onDoubleClick={(evt) =>
          uiDispatch({ type: "ShowResearchSelector", evt })
        }
      >
        <div className={`icon ${researchIcon}`} />
        <div className="ore-text">{Math.floor(researchProgressPercent)}%</div>
      </div>
    </div>
  );
};
