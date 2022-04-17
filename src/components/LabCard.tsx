import { GameDispatch } from "../GameDispatch";
import { GetResearch } from "../gen/research";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { ReadonlyBuilding, ReadonlyResearchState } from "../useGameState";
import { entityIconLookupByKind } from "../utils";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import "./BuildingCard.scss";
import { CounterWithPlusMinusButtons } from "./CounterWithPlusMinusButtons";
import { showResearchSelector } from "./selectors";

const ProducerIcon = (p: { subkind: string }): string => p.subkind;

export type LabCardProps = {
  building: ReadonlyBuilding;
  /* dispatch: (a: GameAction) => void;
   * uiDispatch: (a: UIAction) => void; */
  buildingIdx: number;
  regionId: string;
  researchState: ReadonlyResearchState;
};

export function LabCard({
  building,
  buildingIdx,
  regionId,
  researchState,
}: LabCardProps) {
  const generalDialog = useGeneralDialog();
  const title = building.RecipeId
    ? `Researching ${GetResearch(building.RecipeId).Name}`
    : "No Research Selected";
  return (
    <div className="main-area lab">
      <div className="top-area">
        <div
          className="title"
          onClick={async () => {
            await showResearchSelector(generalDialog, researchState);
          }}
          title="Select Research"
        >
          <span className="title-text">{title /* TODO Fix name */}</span>
          <span className="material-icons edit-icon">edit</span>
        </div>
        <span className={`icon ${ProducerIcon(building)}`} />
        <CounterWithPlusMinusButtons
          count={building.BuildingCount}
          minusClickHandler={() =>
            GameDispatch({
              type: "DecreaseBuildingCount",
              buildingIdx,
              regionId,
            })
          }
          plusClickHandler={() =>
            GameDispatch({
              type: "IncreaseBuildingCount",
              buildingIdx,
              regionId,
            })
          }
        />
      </div>

      <div className="bottom-area">
        <BuildingBufferDisplay
          inputBuffers={building.inputBuffers}
          outputBuffers={building.outputBuffers}
          buildingIdx={buildingIdx}
          outputInteractable={false}
          entityIconLookup={entityIconLookupByKind(building.kind)}
          regionId={regionId}
        />
      </div>
    </div>
  );
}
