import { Map } from "immutable";
import { SyntheticEvent } from "react";
import { NewBuildingSlot } from "../building";
import { FactoryGameState, ReadonlyResearchState } from "../factoryGameState";
import { ReactComponent as HelpOverlay } from "../helpTemplate.svg";
import { ImmutableMap } from "../immutable";
import { ReadonlyInventory } from "../inventory";
import { NewExtractorForRecipe, NewFactoryForRecipe } from "../production";
import { GetRegionInfo } from "../region";
import { EntityStack, NewRegionFromInfo } from "../types";
import { BuildingCardList } from "./BuildingCardList";
import "./HelpCard.scss";

export type SaveCardProps = {
  onConfirm: (evt: SyntheticEvent, recipe: string) => void;
};

export const SaveCard = function HelpCard({ onConfirm }: SaveCardProps) {
  return (
    <div className="modal help-card">
      <div className="inner-frame">
        <span
          className="material-icons close-icon clickable"
          onClick={(evt) => onConfirm(evt, "")}
        >
          close
        </span>
        <div className="help-text">
          <div>Goal: Launch a rocket!</div>
          <div style={{ fontSize: 16 }}>
            Build a lab to research technologies and expand what your factory
            can produce.
          </div>
        </div>
        <div className="inner-content"></div>
      </div>
    </div>
  );
};
