import { GameDispatch } from "../GameDispatch";
import { Producer } from "../types";
import "./BuildingCard.scss";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import { entityIconLookupByKind } from "../utils";
import { showResearchSelector } from "./selectors";
import { getEntityIconDoubleClickHandler } from "./events";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { Lab } from "../research";

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
        <div className="title">{title /* TODO Fix name */}</div>
        <div className="producer-count-area">
          <span className={`icon ${ProducerIcon(building)}`} />
          <div
            className="plus-minus"
            onClick={() =>
              GameDispatch({
                type: "DecreaseBuildingCount",
                buildingIdx,
              })
            }
          >
            -
          </div>
          <div className="producer-count">{building.BuildingCount}</div>
          <div
            className="plus-minus"
            onClick={() =>
              GameDispatch({
                type: "IncreaseBuildingCount",
                buildingIdx,
              })
            }
          >
            +
          </div>
        </div>
      </div>

      <div className="bottom-area">
        <div
          onClick={async () => {
            await showResearchSelector(generalDialog);
          }}
          className="choose-research clickable"
        >
          Choose Research
        </div>

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
