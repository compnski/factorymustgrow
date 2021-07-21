import { useReducer, SyntheticEvent } from "react";
export const useUIState = () =>
  useReducer(uiStateReducer, { dialogs: {} } as UIState);

export type UIState = {
  dialogs: {
    recipeSelectorOpen: boolean;
  };
  exploreGameOpen: boolean;
};
export type UIAction = {
  type:
    | "CloseDialog"
    | "ShowRecipeSelector"
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
      return { ...state, dialogs: { recipeSelectorOpen: true } };
    case "CloseDialog":
      return { ...state, dialogs: { recipeSelectorOpen: false } };
    case "OpenExploreGame":
      return { ...state, exploreGameOpen: true };
    case "CloseExploreGame":
      return { ...state, exploreGameOpen: false };
    default:
      return { ...state };
  }
}
