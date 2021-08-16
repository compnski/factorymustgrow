import { ResearchState } from "../useGameState";
import { Region } from "../types";
import { UIAction } from "../uiState";
import { entityIconLookupByKind } from "../utils";
import { RemainingRegionBuildingCapacity } from "../region";

export type InfoHeaderProps = {
  currentRegion: Region;
  researchState: ResearchState;
  uiDispatch(a: UIAction): void;
};

export const InfoHeader = ({
  currentRegion,
  researchState,
  uiDispatch,
}: InfoHeaderProps) => {
  const oreInfo = currentRegion.Ore;
  const infoCards = [...oreInfo.values()].map(({ Entity, Count }) => (
    <div key={Entity} className="top-info">
      <div className={`icon ${Entity}`} />
      <div className="ore-text">{Math.floor(Count)}</div>
    </div>
  ));

  const remainingSpace = RemainingRegionBuildingCapacity(currentRegion),
    currentResarch = researchState.CurrentResearchId,
    researchIcon =
      entityIconLookupByKind("Lab")(currentResarch) ||
      "sprite-technology-no-science",
    researchProgress = researchState.Progress.get(currentResarch),
    researchProgressPercent =
      ((researchProgress?.Count || 0) / (researchProgress?.MaxCount || 1)) *
      100;
  return (
    <div className="info-card">
      <div className="top-info">
        <div className={`icon landfill`} />
        <div className="ore-text">{Math.floor(remainingSpace)}</div>
      </div>
      {infoCards}
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
