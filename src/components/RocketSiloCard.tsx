import { GameAction } from "../GameAction";
import { ReadonlyBuilding } from "../useGameState";
import { entityIconLookupByKind } from "../utils";
import { BuildingBufferDisplay } from "./BuildingBufferDisplay";
import "./BuildingCard.scss";

const ProducerIcon = (p: { subkind: string }): string => p.subkind;

export type RocketSiloCardProps = {
  building: ReadonlyBuilding;
  regionId: string;
  buildingIdx: number;
  uxDispatch: (a: GameAction) => void;
};

export function RocketSiloCard({
  regionId,
  building,
  buildingIdx,
  uxDispatch,
}: RocketSiloCardProps) {
  const readyToLaunch = building.outputBuffers.Count("rocket-part") >= 100;
  // TODO: 'Launch in Progress' text while launching
  const buildingTitle = readyToLaunch
    ? "Rocket ready to Launch"
    : "Producing Rocket Parts";
  const launchTitle = readyToLaunch ? "🚀 Launch! 🚀" : "Launch!";
  return (
    <div className="main-area">
      <div className="top-area">
        <div className="title" title="Change Recipe">
          <span className="title-text">{buildingTitle}</span>
          <span className="material-icons edit-icon">edit</span>
        </div>

        <span className={`icon ${ProducerIcon(building)}`} />
      </div>
      <div className="bottom-area">
        <div
          onClick={async () => {
            uxDispatch({ type: "LaunchRocket", buildingIdx, regionId });
          }}
          className={`building-card-button clickable ${
            (!readyToLaunch && "disabled") || ""
          }`}
        >
          {launchTitle}
        </div>

        <BuildingBufferDisplay
          inputBuffers={building.inputBuffers}
          outputBuffers={building.outputBuffers}
          buildingIdx={buildingIdx}
          outputInteractable={false}
          entityIconLookup={entityIconLookupByKind(building.kind)}
          regionId={regionId}
          uxDispatch={uxDispatch}
        />
        <div className="spacer" />
      </div>
    </div>
  );
}
