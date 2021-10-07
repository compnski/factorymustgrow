import { useState } from "react";
import { GameDispatch } from "../GameDispatch";
import { Inserter } from "../inserter";
import { CounterWithPlusMinusButtons } from "./CounterWithPlusMinusButtons";
import "./InserterCard.scss";

export type InserterCardProps = {
  inserterIdx: number;
  inserter: Inserter;
};

export function InserterCard(props: InserterCardProps) {
  const directionClass =
    props.inserter.direction === "UP"
      ? "up"
      : props.inserter.direction === "DOWN"
      ? "down"
      : "side";
  return (
    <div className="inserter-card">
      <div
        onClick={() => {
          //
          GameDispatch({
            type: "ToggleInserterDirection",
            inserterIdx: props.inserterIdx,
          });
        }}
        className="inserter-diamond"
      >
        <span className={`icon ${props.inserter.subkind} ${directionClass}`} />
      </div>
      <div className="inserter-rectangle">
        <CounterWithPlusMinusButtons
          count={props.inserter.BuildingCount}
          minusClickHandler={() =>
            GameDispatch({
              type: "DecreaseInserterCount",
              inserterIdx: props.inserterIdx,
            })
          }
          plusClickHandler={() =>
            GameDispatch({
              type: "IncreaseInserterCount",
              inserterIdx: props.inserterIdx,
            })
          }
        />
      </div>
    </div>
  );
}
