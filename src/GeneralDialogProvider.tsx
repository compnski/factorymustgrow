import { SyntheticEvent, useState } from "react";
import React from "react";

const GeneralDialogContext = React.createContext<{
  openGeneralDialog(c: GeneralDialogConfig): void;
}>({ openGeneralDialog: (): void => {} });

export type GeneralDialogConfig = {
  actionCallback?: (returnData: any | false) => void;
  title: string;
  component?: (
    onConfirm: (evt: SyntheticEvent, returnData: any) => any
  ) => JSX.Element;
};

export const GeneralDialogProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
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

  const onConfirm = (evt: SyntheticEvent, ...returnData: any) => {
    resetGeneralDialog();
    generalDialogConfig.actionCallback &&
      generalDialogConfig.actionCallback(returnData);
  };

  /* const onDismiss = (evt: SyntheticEvent) => {
   *   resetGeneralDialog();
   *   iconSelectorConfig.actionCallback &&
   *     iconSelectorConfig.actionCallback(evt, false);
   * };
   */
  const dialog =
    generalDialogConfig.component && generalDialogConfig.component(onConfirm);
  return (
    <GeneralDialogContext.Provider value={{ openGeneralDialog }}>
      {dialog}
      {children}
    </GeneralDialogContext.Provider>
  );
};

export const useGeneralDialog = (): ((
  c: GeneralDialogConfig
) => Promise<any[] | false>) => {
  const { openGeneralDialog } = React.useContext(GeneralDialogContext);

  const getConfirmation = ({ title, component }: GeneralDialogConfig) =>
    new Promise<any[] | false>((res) => {
      openGeneralDialog({
        actionCallback: res,
        title,
        component,
      });
    });

  return getConfirmation;
};
