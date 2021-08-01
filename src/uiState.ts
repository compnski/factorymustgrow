import { useReducer, SyntheticEvent } from "react";
export const useUIState = () =>
  useReducer(uiStateReducer, { dialogs: {} } as UIState);

export type UIState = {
  dialogs: {
    recipeSelectorOpen: boolean;
    researchSelectorOpen: boolean;
  };
  exploreGameOpen: boolean;
};

const closedDialogs = {
  recipeSelectorOpen: false,
  researchSelectorOpen: false,
};

export type UIAction = {
  type:
    | "CloseDialog"
    | "ShowRecipeSelector"
    | "ShowResearchSelector"
    | "OpenExploreGame"
    | "CloseExploreGame";
  evt?: SyntheticEvent;
};

export function uiStateReducer(state: UIState, action: UIAction): UIState {
  console.log(action);
  action.evt?.preventDefault();
  switch (action.type) {
    case "ShowRecipeSelector":
      action.evt?.stopPropagation();
      return {
        ...state,
        dialogs: { ...closedDialogs, recipeSelectorOpen: true },
      };
    case "ShowResearchSelector":
      action.evt?.stopPropagation();
      return {
        ...state,
        dialogs: { ...closedDialogs, researchSelectorOpen: true },
      };

    case "CloseDialog":
      return {
        ...state,
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
