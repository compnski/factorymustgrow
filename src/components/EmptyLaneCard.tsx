import { GameAction } from "../GameAction";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { ImmutableMap } from "../immutable";
import {
  ReadonlyItemBuffer,
  ReadonlyRegion,
  ResearchState,
} from "../factoryGameState";
import {
  showChangeProducerRecipeSelector,
  showPlaceBuildingSelector,
} from "./selectors";
import { ProducerTypeFromEntity } from "../production";

export function EmptyLaneCard(props: {
  regionId: string;
  buildingIdx: number;
  inventory: ReadonlyItemBuffer;
  regions: ImmutableMap<string, ReadonlyRegion>;
  researchState: ResearchState;
}) {
  const generalDialog = useGeneralDialog();

  return (
    <div className="main-area empty-lane">
      <div className="top-area">
        <div className="title">Empty Lane</div>
      </div>
      <div className="bottom-area">
        <div
          onClick={async () => {
            const item = await showPlaceBuildingSelector(
              generalDialog,
              props.inventory,
              props.regionId,
              props.buildingIdx,
              props.regions
            );
            if (!item) return;
            const producerType = ProducerTypeFromEntity(item);
            if (shouldShowRecipeSelector(producerType))
              void showChangeProducerRecipeSelector(
                producerType,
                props.regionId,
                props.buildingIdx,
                generalDialog,
                props.researchState
              );
            // if resaerch and not current research id, show select research
          }}
          className="building-card-button  clickable"
        >
          Build Something
        </div>
      </div>
    </div>
  );
}

function shouldShowRecipeSelector(producerType: string): boolean {
  return (
    producerType == "Assembler" ||
    producerType == "Miner" ||
    producerType == "ChemPlant" ||
    producerType == "Refinery" ||
    producerType == "Smelter"
  );
}
