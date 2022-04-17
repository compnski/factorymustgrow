import { ResearchState } from "../state/FactoryGameState";
import { Region } from "../types";
import { entityIconLookupByKind } from "../utils";
import { RemainingRegionBuildingCapacity } from "../region";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { showResearchSelector } from "./selectors";
import { GetEntity } from "../gen/entities";

export type InfoHeaderProps = {
  currentRegion: Region;
  researchState: ResearchState;
};

export const InfoHeader = ({
  currentRegion,
  researchState,
}: InfoHeaderProps) => {
  const oreInfo = currentRegion.Ore;
  const infoCards = oreInfo.Entities().map(([Entity, Count]) => (
    <div key={Entity} className="top-info" title={GetEntity(Entity).Name}>
      <div className={`icon ${Entity}`} />
      <div className="ore-text">{Math.floor(Count)}</div>
    </div>
  ));
  const generalDialog = useGeneralDialog();
  const remainingSpace = RemainingRegionBuildingCapacity(currentRegion),
    currentResarch = researchState.CurrentResearchId,
    researchIcon = entityIconLookupByKind("Lab")(currentResarch),
    researchProgress = researchState.Progress.get(currentResarch),
    researchProgressPercent =
      ((researchProgress?.Count || 0) / (researchProgress?.MaxCount || 1)) *
      100;
  return (
    <div className="info-header">
      <div className="top-info" title="Empty Lanes">
        <div className={`icon landfill`} />
        <div className="ore-text">{Math.floor(remainingSpace)}</div>
      </div>
      {infoCards}
      <div
        className="top-info science-info"
        onClick={async () => await showResearchSelector(generalDialog)}
        title="Select Research"
      >
        <div className={`icon ${researchIcon}`} />
        <div className="ore-text">{Math.floor(researchProgressPercent)}%</div>
      </div>
    </div>
  );
};
