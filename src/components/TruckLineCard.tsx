import { GameAction } from "../GameAction";
import { ImmutableMap } from "../immutable";
import { TruckLine } from "../transport";
import { ReadonlyBuilding } from "../factoryGameState";
import { entityIconLookupByKind } from "../utils";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import "./BuildingCard.scss";

export type TruckLineCardProps = {
  building: ReadonlyBuilding;
  buildingIdx: number;
  regionId: string;
  uxDispatch: (a: GameAction) => void;
  truckLines: ImmutableMap<string, TruckLine>;
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

export function TruckLineCard(props: TruckLineCardProps) {
  const { building, buildingIdx, regionId, uxDispatch, truckLines } = props;

  const inputBuffersForDisplay = building.inputBuffers,
    outputBuffersForDisplay = building.outputBuffers;
  if (!building.truckLineId)
    throw new Error("TruckLineDepot missing truckLineId");
  const truckLine = truckLines.get(building.truckLineId);
  const name = truckLine ? truckLine.name : "Invalid";

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
