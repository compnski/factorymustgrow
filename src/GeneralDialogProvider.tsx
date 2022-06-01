import { SyntheticEvent, useEffect, useState } from "react";
import React from "react";
import { IWithShortcut, withShortcut } from "react-keybind";
import { FactoryGameState } from "./factoryGameState";
import { DispatchFunc } from "./stateVm";
import { GameAction } from "./GameAction";

const GeneralDialogContext = React.createContext<{
  openGeneralDialog(c: GeneralDialogConfig): void;
}>({
  openGeneralDialog: (): void => {
    return;
  },
});

export type GeneralDialogConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionCallback?: (arg0: {
    returnData: any | false;
    uxDispatch: (a: GameAction) => void;
  }) => void;
  title: string;
  component?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onConfirm: (evt: SyntheticEvent, returnData: any) => any
  ) => JSX.Element;
};

const GeneralDialogProviderWithShortcut = ({
  children,
  shortcut,
  uxDispatch,
}: {
  children: JSX.Element;
  uxDispatch: (a: GameAction) => void;
} & IWithShortcut) => {
  const [generalDialogConfig, setGeneralDialogConfig] =
    useState<GeneralDialogConfig>({
      title: "",
    });

  const openGeneralDialog = ({
    title,
    component,
    actionCallback,
  }: GeneralDialogConfig) => {
    setGeneralDialogConfig({
      title,
      component,
      actionCallback,
    });
  };

  const resetGeneralDialog = () => {
    setGeneralDialogConfig({
      title: "",
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onConfirm = (
    evt: SyntheticEvent | KeyboardEvent | undefined,
    ...returnData: any
  ) => {
    resetGeneralDialog();
    generalDialogConfig.actionCallback &&
      generalDialogConfig.actionCallback({ returnData, uxDispatch });
  };

  const dialog =
    generalDialogConfig.component && generalDialogConfig.component(onConfirm);

  useEffect(() => {
    if (shortcut && shortcut.registerShortcut) {
      shortcut.registerShortcut(
        onConfirm,
        ["escape"],
        "Escape",
        "Cancel Action"
      );
      return () => {
        if (shortcut.unregisterShortcut) shortcut.unregisterShortcut(["esc"]);
      };
    }
  }, []);

  return (
    <GeneralDialogContext.Provider value={{ openGeneralDialog }}>
      {children}
      <div className="dialog">{dialog}</div>
    </GeneralDialogContext.Provider>
  );
};

export const useGeneralDialog = (): ((
  c: GeneralDialogConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<{
  returnData: any[] | false;
  uxDispatch: (a: GameAction) => void;
}>) => {
  const { openGeneralDialog } = React.useContext(GeneralDialogContext);

  const getConfirmation = ({ title, component }: GeneralDialogConfig) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new Promise<{
      returnData: any[] | false;
      uxDispatch: (a: GameAction) => void;
    }>((resolve) => {
      openGeneralDialog({
        actionCallback: resolve,
        title,
        component,
      });
    });

  return getConfirmation;
};

export const GeneralDialogProvider = withShortcut(
  GeneralDialogProviderWithShortcut
);
