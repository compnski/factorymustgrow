import { useReducer, SyntheticEvent } from "react";
import { Recipes } from "./gen/entities";
import { Recipe } from "./types";

export const useUIState = () =>
  useReducer(uiStateReducer, { dialogs: {} } as UIState);

export type UIState = {
  dialogs: {
    recipeSelectorOpen: boolean;
    researchSelectorOpen: boolean;
    debugInventorySelectorOpen: boolean;
    regionSelectorOpen: boolean;
  };
  exploreGameOpen: boolean;
  dialogCallback?: (a: any) => void;
  filterFunc?: (r: Recipe) => boolean;
};

const closedDialogs = {
  recipeSelectorOpen: false,
  researchSelectorOpen: false,
  debugInventorySelectorOpen: false,
  regionSelectorOpen: false,
};

export type UIAction = {
  type:
    | "CloseDialog"
    | "ShowRecipeSelector"
    | "ShowResearchSelector"
    | "OpenExploreGame"
    | "CloseExploreGame"
    | "ShowDebugInventorySelector"
    | "ShowRegionSelector";
  evt?: SyntheticEvent;
  callback?: (a: any) => void;
  filterFunc?: (r: Recipe) => boolean;
};

export function uiStateReducer(state: UIState, action: UIAction): UIState {
  console.log(action);
  const filterFunc = action.filterFunc;
  action.evt?.preventDefault();
  switch (action.type) {
    case "ShowRecipeSelector":
      action.evt?.stopPropagation();
      return {
        ...state,
        dialogCallback: action.callback,
        filterFunc,
        dialogs: { ...closedDialogs, recipeSelectorOpen: true },
      };

    case "ShowResearchSelector":
      action.evt?.stopPropagation();
      return {
        ...state,
        dialogCallback: action.callback,
        filterFunc,
        dialogs: { ...closedDialogs, researchSelectorOpen: true },
      };

    case "ShowDebugInventorySelector":
      action.evt?.stopPropagation();
      return {
        ...state,
        dialogCallback: action.callback,
        filterFunc,
        dialogs: { ...closedDialogs, debugInventorySelectorOpen: true },
      };

    case "ShowRegionSelector":
      return {
        ...state,
        dialogCallback: action.callback,
        filterFunc,
        dialogs: { ...closedDialogs, regionSelectorOpen: true },
      };

    case "CloseDialog":
      return {
        ...state,
        dialogCallback: action.callback,
        filterFunc: undefined,
        dialogs: { ...closedDialogs },
      };
    case "OpenExploreGame":
      return { ...state, exploreGameOpen: true };
    case "CloseExploreGame":
      return { ...state, exploreGameOpen: false };
    default:
      return { ...state };
  }
}
