import { Recipe, ProducingEntity } from "./types";
import { GameAction, CurrentMaxProducerCount } from "./logic";
import { GetEntity, GetRecipe } from "./gen/entities";
import { UIAction } from "./uiState";

const rateToTime = (rate: number): string => `${rate}/m`;

const CurrentProducerRate = (p: ProducingEntity): number =>
  (1 / GetRecipe(p.RecipeName).DurationSeconds) * p.ProducerCount;

const ProducerTypeIconMap: { [key: string]: string } = {
  Assembler: "assembling-machine-1",
  Smelter: "stone-furnace",
  Miner: "electric-mining-drill",
  ChemFactory: "",
  Refinery: "",
  Pumpjack: "",
};

const ProducerIcon = (p: ProducingEntity): string =>
  ProducerTypeIconMap[GetRecipe(p.RecipeName).ProducerType];

type RecipeProps = {
  recipe: Recipe;
};

const RecipeDisplay = ({ recipe }: RecipeProps) => (
  <div className="recipe">
    <span>Recipe: </span>
    {recipe.Input.map((x, i) => (
      <span key={i}>
        <span>{x.Count}</span>
        <div className={`icon ${GetEntity(x.Entity).Id}`} />
      </span>
    ))}
    <span>=</span>
    {recipe.Output.map((x, i) => (
      <span key={i}>
        <span>{x.Count}</span>
        <div className={`icon ${GetEntity(x.Entity).Id}`} />
      </span>
    ))}
  </div>
);

export type CardProps = {
  producer?: ProducingEntity;
  dispatch(a: GameAction | UIAction): void;
  globalEntityCount: (e: string) => number;
  entityStorageCapacity: (e: string) => number;
};

export const Card = ({
  producer,
  dispatch,
  globalEntityCount,
  entityStorageCapacity,
}: CardProps) => {
  if (!producer) return <div className="NoProducer" />;
  const recipe = GetRecipe(producer.RecipeName);
  return (
    <div className="Producer">
      <div className="title">
        <span>{recipe.Name} </span>
      </div>
      <div className="infoRow">
        <div
          onClick={() => {
            dispatch({ producerName: producer.RecipeName, type: "Produce" });
          }}
          className={recipe.Icon + " icon clickable"}
        />
        <div className="rate">{rateToTime(CurrentProducerRate(producer))}</div>
        <div className="plusMinus">
          <span
            onClick={() =>
              dispatch({
                producerName: producer.RecipeName,
                type: "AddProducer",
              })
            }
            className="clickable"
          >
            +
          </span>
          <span
            onClick={() =>
              dispatch({
                producerName: producer.RecipeName,
                type: "RemoveProducer",
              })
            }
            className="clickable"
          >
            -
          </span>
        </div>
        <span className={`icon producerTypeIcon ${ProducerIcon(producer)}`} />
        <div className="producerCount">
          <span className="currentCapacity">{producer.ProducerCount}</span>
          <span>/</span>

          <span className="maxCapacity">
            {CurrentMaxProducerCount(producer)}
          </span>
        </div>
        <div className="plusMinus maxCapacity">
          <span
            onClick={() =>
              dispatch({
                producerName: producer.RecipeName,
                type: "AddProducerCapacity",
              })
            }
            className="clickable"
          >
            +
          </span>
          <span
            onClick={() =>
              dispatch({
                producerName: producer.RecipeName,
                type: "RemoveProducerCapacity",
              })
            }
            className="clickable"
          >
            -
          </span>
        </div>
        <div
          onClick={() =>
            dispatch({
              producerName: producer.RecipeName,
              type: "UpgradeStorage",
            })
          }
          className="icon iron-chest clickable"
        />
        <div className="filler" />
        <div className="icon space-science-pack clickable" />
      </div>
      <div className="infoRow">
        <span className="count">
          {globalEntityCount(recipe.Output[0].Entity)}/
          {entityStorageCapacity(recipe.Output[0].Entity)}
        </span>
        {recipe.Input.length > 0 ? <RecipeDisplay recipe={recipe} /> : <div />}
      </div>
    </div>
  );
};
