import { SyntheticEvent } from "react";

export type RecipeSelectorProps = {
  onClick: (evt: SyntheticEvent, recipe: string) => void;
  recipes: string[];
  title: string;
  entityIconLookup?: (entity: string) => string;
};

export const RecipeSelector = ({
  recipes,
  onClick,
  title,
  entityIconLookup = (entity: string): string => entity,
}: RecipeSelectorProps) => {
  const recipeIcons = recipes.map((r) => {
    return (
      <div
        key={r}
        title={r}
        className={`clickable icon ${entityIconLookup(r)}`}
        onClick={(evt) => onClick(evt, r)}
      />
    );
  });
  return (
    <div className="recipe-selector modal">
      <p>{title}</p>
      <div className="recipeList">{recipeIcons}</div>
    </div>
  );
};
