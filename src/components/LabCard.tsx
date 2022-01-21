import { GameDispatch } from "../GameDispatch";
import { Producer } from "../types";
import "./BuildingCard.scss";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import { entityIconLookupByKind } from "../utils";
import { showResearchSelector } from "./selectors";
import { getEntityIconDoubleClickHandler } from "./events";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { Lab } from "../research";
import { CounterWithPlusMinusButtons } from "./CounterWithPlusMinusButtons";

const ProducerIcon = (p: Producer): string => p.subkind;

export type LabCardProps = {
  building: Lab;
  /* dispatch: (a: GameAction) => void;
   * uiDispatch: (a: UIAction) => void; */
  buildingIdx: number;
};

export function LabCard({ building, buildingIdx }: LabCardProps) {
  const generalDialog = useGeneralDialog();
  const title = building.RecipeId
    ? `Researching ${building.RecipeId}`
    : "No Research Selected";
  return (
    <div className="main-area lab">
      <div className="top-area">
        <div
          className="title"
          onClick={async () => {
            await showResearchSelector(generalDialog);
          }}
          title="Select Research"
        >
          {title /* TODO Fix name */}
          <span className="material-icons edit-icon">edit</span>
        </div>
        <span className={`icon ${ProducerIcon(building)}`} />
        <CounterWithPlusMinusButtons
          count={building.BuildingCount}
          minusClickHandler={() =>
            GameDispatch({
              type: "DecreaseBuildingCount",
              buildingIdx,
            })
          }
          plusClickHandler={() =>
            GameDispatch({
              type: "IncreaseBuildingCount",
              buildingIdx,
            })
          }
        />
      </div>

      <div className="bottom-area">
        <BuildingBufferDisplay
          inputBuffers={building.inputBuffers}
          outputBuffers={building.outputBuffers}
          doubleClickHandler={(evt, buffer, entity) => {
            if (buffer !== building.outputBuffers)
              getEntityIconDoubleClickHandler(buildingIdx)(evt, buffer, entity);
          }}
          entityIconLookup={entityIconLookupByKind(building.kind)}
        />
      </div>
    </div>
  );
}
