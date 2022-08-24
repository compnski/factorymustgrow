import React, { SyntheticEvent, useEffect, useState } from "react";
import { IWithShortcut, withShortcut } from "react-keybind";
import { GameAction } from "./GameAction";

const GeneralDialogContext = React.createContext<{
  openGeneralDialog(c: GeneralDialogConfig): void;
}>({
  openGeneralDialog: (): void => {
    return;
  },
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export type GeneralDialogConfig = {
  actionCallback?: (arg0: {
    returnData: any | false;
    uxDispatch: (a: GameAction) => void;
  }) => void;
  title: string;
  component?: (
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

export const useGeneralDialog = (): ((c: GeneralDialogConfig) => Promise<{
  returnData: any[] | false;
  uxDispatch: (a: GameAction) => void;
}>) => {
  const { openGeneralDialog } = React.useContext(GeneralDialogContext);

  const getConfirmation = ({ title, component }: GeneralDialogConfig) =>
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
