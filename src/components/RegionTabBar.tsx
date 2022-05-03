import { SyntheticEvent } from "react";
import { GameAction } from "../GameAction";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { ReadonlyItemBuffer } from "../useGameState";
import { showClaimRegionSelector } from "./selectors";

// TODO Dispatch event to region change
//
type RegionTabBarProps = {
  regionIds: string[];
  currentRegionId: string;
  inventory: ReadonlyItemBuffer;
  setCurrentRegionId: (regionId: string) => void;
  uxDispatch: (a: GameAction) => void;
};

const regionIdClaimNew = "claim-new";

export function RegionTabBar({
  regionIds,
  currentRegionId,
  inventory,
  setCurrentRegionId,
  uxDispatch,
}: RegionTabBarProps) {
  const generalDialog = useGeneralDialog();

  function clickHandler(evt: SyntheticEvent) {
    const regionId = (evt.target as HTMLElement).attributes.getNamedItem(
      "data-region-id"
    )?.value;
    if (regionId === regionIdClaimNew) {
      void showClaimRegionSelector(
        generalDialog,
        uxDispatch,
        inventory,
        regionIds
      );
    } else if (regionId) {
      setCurrentRegionId(regionId);
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
      <div className="region-tab" data-region-id={regionIdClaimNew}>
        Claim New
      </div>
    </div>
  );
}
