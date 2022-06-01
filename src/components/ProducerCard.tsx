import {
  ReadonlyBuilding,
  ReadonlyItemBuffer,
  ReadonlyResearchState,
} from "../factoryGameState";
import { GameAction } from "../GameAction";
import { MaybeGetRecipe } from "../gen/entities";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { ReadonlyInventory } from "../inventory";
import { entityIconLookupByKind } from "../utils";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import "./BuildingCard.scss";
import { CounterWithPlusMinusButtons } from "./CounterWithPlusMinusButtons";
import { ProgressBar } from "./ProgressBar";
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

  let recipeInput: ReadonlyItemBuffer = producer.inputBuffers;
  const recipe = MaybeGetRecipe(producer.RecipeId || "");

  if (producer.kind === "Extractor" && producer.inputBuffers) {
    recipeInput = new ReadonlyInventory(Infinity, undefined);
    // TODO: Clean this up to use some immutable inventory
    // TODO: Fix stack size
    for (const [entity] of producer.inputBuffers.Entities()) {
      const ore = regionalOre.Count(entity);
      if (ore) recipeInput = recipeInput.AddItems(entity, ore);
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
        <ProgressBar
          progressTrackers={producer.progressTrackers || []}
          durationSeconds={recipe?.DurationSeconds}
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
          infiniteStackSize={producer.kind === "Extractor"}
        />
        <div className="spacer" />
      </div>
    </div>
  );
}
