import { MainBus } from "../types";

import { Icon } from "../svgIcons";

export const MainBusHeader = (props: { mainBus: MainBus }) => {
  const uniqueItems = new Set<string>();
  for (var [laneIdx, lane] of props.mainBus.lanes) {
    uniqueItems.add(lane.Entity);
  }
  return (
    <svg className="mainBusHeader">
      {[...uniqueItems].map((e: string): JSX.Element => Icon(e))}

      {[...uniqueItems].map(
        (e: string, idx: number): JSX.Element => (
          <use href={`#${e}`} width="32" height="32" x={32 * idx} />
        )
      )}
    </svg>
  );
};

/* export const MainBusHeader = (props: { mainBus: MainBus }) => {
 *   return (
 *     <svg className="mainBusHeader">
 *       <symbol id="myIcon" viewBox="0 832 64 64" width="50" height="50">
 *         <image width="1024" height="1088" x={0} y={0} href={icons} />
 *       </symbol>
 *       <use xlinkHref="#myIcon" width="32" height="32" />
 *     </svg>
 *   );
 * }; */
