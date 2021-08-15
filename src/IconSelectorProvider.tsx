import { SyntheticEvent, useState } from "react";
import React from "react";
import { RecipeSelector } from "./components/RecipeSelector";
import { entityIconLookupByKind } from "./utils";

const IconSelectorContext = React.createContext<{
  openIconSelector(c: IconSelectorConfig): void;
}>({ openIconSelector: (): void => {} });

export type IconSelectorConfig = {
  actionCallback?: (recipe: string | false) => void;
  recipes: string[];
  title: string;
  entityIconLookup?: (entity: string) => string;
};

export const IconSelectorProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false);
  const [iconSelectorConfig, setIconSelectorConfig] =
    useState<IconSelectorConfig>({
      recipes: [],
      title: "",
    });

  const openIconSelector = ({
    title,
    recipes,
    entityIconLookup,
    actionCallback,
  }: IconSelectorConfig) => {
    setIconSelectorOpen(true);
    setIconSelectorConfig({ title, recipes, entityIconLookup, actionCallback });
  };

  const resetIconSelector = () => {
    setIconSelectorOpen(false);
    setIconSelectorConfig({
      recipes: [],
      title: "",
    });
  };

  const onConfirm = (evt: SyntheticEvent, recipe: string) => {
    resetIconSelector();
    iconSelectorConfig.actionCallback &&
      iconSelectorConfig.actionCallback(recipe);
  };

  /* const onDismiss = (evt: SyntheticEvent) => {
   *   resetIconSelector();
   *   iconSelectorConfig.actionCallback &&
   *     iconSelectorConfig.actionCallback(evt, false);
   * };
   */
  return (
    <IconSelectorContext.Provider value={{ openIconSelector }}>
      <RecipeSelector
        open={iconSelectorOpen}
        title={iconSelectorConfig.title}
        recipes={iconSelectorConfig.recipes}
        entityIconLookup={iconSelectorConfig.entityIconLookup}
        onConfirm={onConfirm}
        //onDismiss={onDismiss}
      />
      {children}
    </IconSelectorContext.Provider>
  );
};

export const useIconSelector = (): ((
  c: IconSelectorConfig
) => Promise<string | false>) => {
  const { openIconSelector } = React.useContext(IconSelectorContext);

  const getConfirmation = ({
    recipes,
    title,
    entityIconLookup,
  }: IconSelectorConfig) =>
    new Promise<string | false>((res) => {
      openIconSelector({
        actionCallback: res,
        recipes,
        title,
        entityIconLookup,
      });
    });

  return getConfirmation;
};
