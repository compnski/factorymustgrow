import { Entity, Recipe, ProducingEntity } from "./types";
import { Action, CurrentMaxProducerCount } from "./logic";

const rateToTime = (rate: number): string => `${rate}/m`;

const CurrentProducerRate = (p: ProducingEntity): number =>
  (1 / p.Recipe.DurationSeconds) * p.ProducerCount;

const ProducerTypeIconMap: { [key: string]: string } = {
  Assembler: "assembling-machine-1",
  Smelter: "stone-furnace",
  Miner: "electric-mining-drill",
  ChemFactory: "",
  Refinery: "",
  Pumpjack: "",
};

const ProducerIcon = (p: ProducingEntity): string =>
  ProducerTypeIconMap[p.Recipe.ProducerType];

type RecipeProps = {
  recipe: Recipe;
};

const RecipeDisplay = ({ recipe }: RecipeProps) => (
  <div className="recipe">
    <span>Recipe: </span>
    {recipe.Input.map((x, i) => (
      <span key={i}>
        <span>{x.Count}</span>
        <div className={`icon ${x.Entity.Icon}`} />
      </span>
    ))}
    <span>=</span>
    {recipe.Output.map((x, i) => (
      <span key={i}>
        <span>{x.Count}</span>
        <div className={`icon ${x.Entity.Icon}`} />
      </span>
    ))}
  </div>
);

export type CardProps = {
  producer?: ProducingEntity;
  dispatch(a: Action): void;
  globalEntityCount: (e: Entity) => number;
  entityStorageCapacity: (e: Entity) => number;
};

export const Card = ({
  producer,
  dispatch,
  globalEntityCount,
  entityStorageCapacity,
}: CardProps) => {
  if (!producer) return <div className="NoProducer" />;
  return (
    <div className="Producer">
      <div className="title">
        <span>{producer.Recipe.Name} </span>
      </div>
      <div className="infoRow">
        <div
          onClick={() => {
            dispatch({ producerName: producer.Recipe.Name, type: "Produce" });
          }}
          className={producer.Recipe.Icon + " icon clickable"}
        />
        <div className="rate">{rateToTime(CurrentProducerRate(producer))}</div>
        <div className="plusMinus">
          <span
            onClick={() =>
              dispatch({
                producerName: producer.Recipe.Name,
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
                producerName: producer.Recipe.Name,
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
                producerName: producer.Recipe.Name,
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
                producerName: producer.Recipe.Name,
                type: "RemoveProducerCapacity",
              })
            }
            className="clickable"
          >
            -
          </span>
        </div>
        <div className="filler" />
        <div className="icon space-science-pack clickable" />
      </div>
      <div className="infoRow">
        <span className="count">
          {globalEntityCount(producer.Recipe.Output[0].Entity)}/
          {entityStorageCapacity(producer.Recipe.Output[0].Entity)}
        </span>
        {producer.Recipe.Input.length > 0 ? (
          <RecipeDisplay recipe={producer.Recipe} />
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
