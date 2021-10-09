import { useState } from "react";
import { InserterId } from "../building";
import { GameDispatch } from "../GameDispatch";
import { Inserter } from "../inserter";
import { CounterWithPlusMinusButtons } from "./CounterWithPlusMinusButtons";
import "./InserterCard.scss";

export type InserterCardProps = {
  inserterId: InserterId;
  inserter: Inserter;
  variant?: "wide" | "small";
};

export function InserterCard(props: InserterCardProps) {
  const directionClass =
    props.inserter.direction === "UP"
      ? "up"
      : props.inserter.direction === "DOWN"
      ? "down"
      : props.inserter.direction === "TO_BUS"
      ? "left"
      : props.inserter.direction === "FROM_BUS"
      ? "right"
      : "off";
  return (
    <div className={`inserter-card ${props.variant || ""}`}>
      <div
        onClick={() => {
          //
          GameDispatch({
            type: "ToggleInserterDirection",
            ...props.inserterId,
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
              ...props.inserterId,
            })
          }
          plusClickHandler={() =>
            GameDispatch({
              type: "IncreaseInserterCount",
              ...props.inserterId,
            })
          }
        />
      </div>
    </div>
  );
}
