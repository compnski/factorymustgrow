import { useReducer, SyntheticEvent } from "react";
export const useUIState = () =>
  useReducer(uiStateReducer, { dialogs: {} } as UIState);

export type UIState = {
  dialogs: {
    recipeSelectorOpen: boolean;
  };
};
export type UIAction = {
  type: "CloseDialog" | "ShowRecipeSelector";
  evt: SyntheticEvent;
};

export function uiStateReducer(state: UIState, action: UIAction): UIState {
  console.log(action);
  action.evt.preventDefault();
  switch (action.type) {
    case "ShowRecipeSelector":
      action.evt.stopPropagation();
      return { ...state, dialogs: { recipeSelectorOpen: true } };
    case "CloseDialog":
      return { ...state, dialogs: { recipeSelectorOpen: false } };
    default:
      return { ...state };
  }
}
