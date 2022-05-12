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
  uxDispatch: (a: GameAction) => void;
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
              props.uxDispatch,
              props.inventory,
              props.regionId,
              props.buildingIdx,
              props.regions
            );
            const producerType = ProducerTypeFromEntity(item);
            if (producerType == "Assembler" || producerType == "Miner")
              void showChangeProducerRecipeSelector(
                producerType,
                props.regionId,
                props.buildingIdx,
                generalDialog,
                props.uxDispatch,
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
