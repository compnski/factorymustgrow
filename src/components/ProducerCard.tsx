import { GameAction } from "../GameAction";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { Inventory } from "../inventory";
import { IsItemBuffer, ItemBuffer, NewEntityStack } from "../types";
import {
  ReadonlyBuilding,
  ReadonlyItemBuffer,
  ReadonlyResearchState,
} from "../useGameState";
import { entityIconLookupByKind } from "../utils";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import "./BuildingCard.scss";
import { CounterWithPlusMinusButtons } from "./CounterWithPlusMinusButtons";
import { showChangeProducerRecipeSelector } from "./selectors";

const ProducerIcon = (p: { subkind: string }): string => p.subkind;

export type ProducerCardProps = {
  producer: ReadonlyBuilding;
  regionId: string;
  buildingIdx: number;
  regionalOre: ReadonlyItemBuffer;
  researchState: ReadonlyResearchState;
  uxDispatch: (a: GameAction) => void;
};

function formatRecipeName(s: string | undefined): string {
  if (!s?.length) return s || "";
  const title = s
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());
  return "Producing " + title.join(" ");
}

export function ProducerCard({
  producer,
  buildingIdx,
  regionalOre,
  regionId,
  researchState,
  uxDispatch,
}: ProducerCardProps) {
  const generalDialog = useGeneralDialog();

  let recipeInput: ItemBuffer | ReadonlyItemBuffer = producer.inputBuffers;

  if (producer.kind === "Extractor" && producer.inputBuffers) {
    recipeInput = new Inventory(Infinity);
    // TODO: Clean this up to use some immutable inventory
    for (const [entity] of producer.inputBuffers.Entities()) {
      const ore = regionalOre.Count(entity);
      if (ore && IsItemBuffer(recipeInput))
        recipeInput.Add(NewEntityStack(entity, ore));
    }
  }

  return (
    <div className="main-area">
      <div className="top-area">
        <div
          onClick={async () => {
            await showChangeProducerRecipeSelector(
              producer.ProducerType,
              regionId,
              buildingIdx,
              generalDialog,
              uxDispatch,
              researchState
            );
          }}
          className="title"
          title="Change Recipe"
        >
          <span className="title-text">
            {formatRecipeName(producer.RecipeId) || "No Recipe Selected"}
          </span>
          <span className="material-icons edit-icon">edit</span>
        </div>

        <span className={`icon ${ProducerIcon(producer)}`} />
        <CounterWithPlusMinusButtons
          count={producer.BuildingCount}
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
      </div>
      <div className="bottom-area">
        <BuildingBufferDisplay
          inputBuffers={recipeInput}
          outputBuffers={producer.outputBuffers}
          buildingIdx={buildingIdx}
          entityIconLookup={entityIconLookupByKind(producer.kind)}
          regionId={regionId}
          uxDispatch={uxDispatch}
        />
        <div className="spacer" />
      </div>
    </div>
  );
}
