import { SyntheticEvent } from "react";

export type RecipeSelectorProps = {
  onClick: (evt: SyntheticEvent, recipe: string) => void;
  recipes: string[];
};

export const RecipeSelector = ({ recipes, onClick }: RecipeSelectorProps) => {
  const recipeIcons = recipes.map((r) => {
    return (
      <div
        key={r}
        className={`clickable icon ${r}`}
        onClick={(evt) => onClick(evt, r)}
      />
    );
  });
  return (
    <div className="recipeSelector modal">
      <p>Select Recipe</p>
      <div className="recipeList">{recipeIcons}</div>
    </div>
  );
};
