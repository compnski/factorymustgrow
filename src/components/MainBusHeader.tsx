import { MainBus } from "../types";

import { Icon } from "../svgIcons";
import { GameState } from "../factoryGame";
import { RecipeSelector } from "./RecipeSelector";
import { SyntheticEvent, useState } from "react";

export const MainBusHeader = (props: { mainBus: MainBus }) => {
  const [showItemSelector, setShowItemSelector] = useState(false);

  const addLane = (evt: SyntheticEvent) => {
    setShowItemSelector(true);
    evt.stopPropagation();
  };
  const addMainBusLane = (evt: SyntheticEvent, entity: string) => {
    props.mainBus.AddLane(entity);
    setShowItemSelector(false);
  };
  return (
    <div className="mainBusHeader" onClick={() => setShowItemSelector(false)}>
      <div onClick={addLane} className="clickable addLaneButton">
        Add Lane
      </div>
      {showItemSelector
        ? RecipeSelector({
            recipes: [...GameState.UnlockedRecipes],
            onClick: addMainBusLane,
          })
        : null}
    </div>
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

/* <svg className="mainBusHeader">
		 *   <text x="12" y="30" onClick={() => console.log("foo")}>
		 *     Add Lane
		 *   </text>
		 *   {[...uniqueItems].map((e: string): JSX.Element => Icon(e))}

		 *   {[...uniqueItems].map(
		 *     (e: string, idx: number): JSX.Element => (
		 *       <use href={`#${e}`} width="16" height="16" x={500 + 32 * idx} />
		 *     )
		 *   )}
		 * </svg>
		   ); */
