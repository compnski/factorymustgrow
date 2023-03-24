import { GameAction } from "../GameAction"
import { GetResearch } from "../gen/entities"
import { useGeneralDialog } from "../GeneralDialogProvider"
import { ReadonlyFixedInventory } from "../inventory"
import { NewEntityStack } from "../types"
import { ReadonlyBuilding, ReadonlyResearchState } from "../factoryGameState"
import { entityIconLookupByKind } from "../utils"
import { BuildingBufferDisplay } from "./BuildingBufferDisplay"
import "./BuildingCard.scss"
import { CounterWithPlusMinusButtons } from "./CounterWithPlusMinusButtons"
import { showResearchSelector } from "./selectors"
import { ProgressBar } from "./ProgressBar"

const ProducerIcon = (p: { subkind: string }): string => p.subkind

export type LabCardProps = {
  building: ReadonlyBuilding
  /* dispatch: (a: GameAction) => void;
   * uiDispatch: (a: UIAction) => void; */
  buildingIdx: number
  regionId: string
  researchState: ReadonlyResearchState
  uxDispatch: (a: GameAction) => void
}

export function LabCard({ building, buildingIdx, regionId, researchState, uxDispatch }: LabCardProps) {
  const generalDialog = useGeneralDialog()
  const title = building.RecipeId
    ? `Researching ${GetResearch(building.RecipeId).Name}`
    : "No Research Selected"
  const currentResearchId = researchState.CurrentResearchId,
    currentResearchProgress = researchState.Progress.get(currentResearchId)?.Count || 0,
    currentResearch = currentResearchId ? GetResearch(currentResearchId) : undefined,
    maxProgress = currentResearch ? currentResearch.ProductionRequiredForCompletion : 1

  const outputBuffers = ReadonlyFixedInventory([
    NewEntityStack(currentResearchId, (currentResearchProgress / maxProgress) * 100),
  ])
  return (
    <div className="main-area lab">
      <div className="top-area">
        <div
          className="title"
          onClick={async () => {
            await showResearchSelector(generalDialog, researchState)
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
            uxDispatch({
              type: "DecreaseBuildingCount",
              buildingIdx,
              regionId,
            })
          }
          plusClickHandler={() =>
            uxDispatch({
              type: "IncreaseBuildingCount",
              buildingIdx,
              regionId,
            })
          }
        />
        <ProgressBar
          progressTrackers={building.progressTrackers || []}
          durationSeconds={currentResearch?.DurationSeconds}
        />
      </div>
      <div className="bottom-area">
        <BuildingBufferDisplay
          inputBuffers={building.inputBuffers}
          outputBuffers={outputBuffers}
          buildingIdx={buildingIdx}
          outputInteractable={false}
          entityIconLookup={entityIconLookupByKind(building.kind)}
          regionId={regionId}
          uxDispatch={uxDispatch}
          infiniteStackSize={true}
        />
      </div>
    </div>
  )
}
