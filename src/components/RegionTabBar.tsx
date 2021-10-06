import { SyntheticEvent } from "react";
import { GameDispatch } from "../GameDispatch";
import { GameAction } from "../GameAction";
import { GameState } from "../useGameState";

// TODO Dispatch event to region change
//
type RegionTabBarProps = {
  regionIds: string[];
  currentRegionId: string;
  gameDispatch(a: GameAction): void;
};
export function RegionTabBar({
  regionIds,
  currentRegionId,
  gameDispatch,
}: RegionTabBarProps) {
  function clickHandler(evt: SyntheticEvent) {
    const regionId = (evt.target as HTMLElement).attributes.getNamedItem(
      "data-region-id"
    )?.value;
    if (regionId) {
      gameDispatch({ type: "ChangeRegion", regionId });
    }
  }

  /* regionIds.sort((a, b) => {
   *   if (a === "start") return -1;
   *   if (b === "start") return 1;
   *   return a.localeCompare(b);
   * }); */
  const tabs = regionIds.map((r) => {
    const active = r === currentRegionId && "active";
    return (
      <div key={r} data-region-id={r} className={`region-tab ${active}`}>
        {r}
      </div>
    );
  });

  return (
    <div onClick={clickHandler} className="region-tab-bar">
      {tabs}
    </div>
  );
}
