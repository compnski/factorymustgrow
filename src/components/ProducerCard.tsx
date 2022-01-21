import { GameDispatch } from "../GameDispatch";
import { ItemBuffer, NewEntityStack, Producer } from "../types";
import "./BuildingCard.scss";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import { entityIconLookupByKind } from "../utils";
import { showChangeProducerRecipeSelector } from "./selectors";
import { getEntityIconDoubleClickHandler } from "./events";
import { Inventory } from "../inventory";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { CounterWithPlusMinusButtons } from "./CounterWithPlusMinusButtons";

const ProducerIcon = (p: Producer): string => p.subkind;

export type ProducerCardProps = {
  producer: Producer;
  /* dispatch: (a: GameAction) => void;
   * uiDispatch: (a: UIAction) => void; */
  buildingIdx: number;
  //  mainBus: MainBus;
  regionalOre: ItemBuffer;
};

function formatRecipeName(s: string): string {
  if (!s.length) return s;
  const title = s
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());
  return "Producing " + title.join(" ");
}

export function ProducerCard({
  producer,
  buildingIdx,
  regionalOre,
}: ProducerCardProps) {
  const generalDialog = useGeneralDialog();

  var recipeInput = producer.inputBuffers;

  if (producer.kind === "Extractor" && producer.inputBuffers) {
    recipeInput = new Inventory(Infinity);
    for (var [entity] of producer.inputBuffers.Entities()) {
      const ore = regionalOre.Count(entity);
      if (ore) recipeInput.Add(NewEntityStack(entity, ore));
    }
  }

  return (
    <div className="main-area">
      <div className="top-area">
        <div
          onClick={async () => {
            await showChangeProducerRecipeSelector(
              producer.ProducerType,
              buildingIdx,
              generalDialog
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
          inputBuffers={recipeInput}
          outputBuffers={producer.outputBuffers}
          buildingIdx={buildingIdx}
          entityIconLookup={entityIconLookupByKind(producer.kind)}
        />
        <div className="spacer" />
      </div>
    </div>
  );
}
