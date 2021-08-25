import { SyntheticEvent } from "react";
import { Inventory } from "../inventory";
import "./PlaceBeltLinePanel.scss";

export type PlaceBeltLineProps = {
  inventory: Inventory;
  title: string;
  onConfirm: (
    evt: SyntheticEvent,
    targetRegion: string,
    beltType: string
  ) => void;
};

export function PlaceBeltLinePanel(props: PlaceBeltLineProps) {
  const { inventory, onConfirm, title } = props;

  return (
    <div className="place-belt-line modal">
      <span
        className="material-icons close-icon clickable"
        onClick={(evt) => onConfirm(evt, "a", "b")}
      >
        close
      </span>
      <span className="title">{title}</span>
    </div>
  );
}
