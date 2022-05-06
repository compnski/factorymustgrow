import { GameAction } from "../GameAction";
import { ImmutableMap } from "../immutable";
import { BeltLine } from "../transport";
import { ReadonlyBuilding } from "../useGameState";
import { entityIconLookupByKind } from "../utils";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import "./BuildingCard.scss";

export type BeltLineCardProps = {
  building: ReadonlyBuilding;
  buildingIdx: number;
  regionId: string;
  uxDispatch: (a: GameAction) => void;
  beltLines: ImmutableMap<string, BeltLine>;
};

function direction(d: "TO_BELT" | "FROM_BELT" | undefined): string {
  switch (d) {
    case "TO_BELT":
      return " to ";
    case "FROM_BELT":
      return " from ";
    case undefined:
      return "UNKNOWN";
  }
}

export function BeltLineCard(props: BeltLineCardProps) {
  const { building, buildingIdx, regionId, uxDispatch, beltLines } = props;

  const inputBuffersForDisplay = building.inputBuffers,
    outputBuffersForDisplay = building.outputBuffers;
  if (!building.beltLineId) throw new Error("BeltLineDepot missing beltLineId");
  const beltLine = beltLines.get(building.beltLineId);
  const name = beltLine ? beltLine.name : "Invalid";

  return (
    <div className="main-area">
      <div className="top-area">
        <div className="title">
          {`Depot ` + direction(building.direction) + name}
        </div>
        <span className={`icon ${building.subkind}`} />
      </div>
      <div className="bottom-area">
        <BuildingBufferDisplay
          inputBuffers={inputBuffersForDisplay}
          outputBuffers={outputBuffersForDisplay}
          buildingIdx={buildingIdx}
          entityIconLookup={entityIconLookupByKind(building.kind)}
          regionId={regionId}
          uxDispatch={uxDispatch}
        />
      </div>
    </div>
  );
}
