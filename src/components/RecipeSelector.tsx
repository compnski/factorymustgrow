import { SyntheticEvent } from "react";

export type RecipeSelectorProps = {
  onConfirm: (evt: SyntheticEvent, recipe: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recipes: { map(f: (r: string) => any): any };
  title: string;
  entityIconLookup?: (entity: string) => string;
};

export const RecipeSelector = ({
  recipes,
  onConfirm,
  title,
  entityIconLookup = (entity: string): string => entity,
}: RecipeSelectorProps) => {
  const recipeIcons = recipes.map((r: string): JSX.Element => {
    return (
      <div
        key={r}
        title={r}
        className={`clickable icon ${entityIconLookup(r)}`}
        onClick={(evt) => onConfirm(evt, r)}
      />
    );
  });
  return (
    (
      <div className="recipe-selector modal">
        <span
          className="material-icons close-icon clickable"
          onClick={(evt) => onConfirm(evt, "")}
        >
          close
        </span>
        <span className="title">{title}</span>
        <div className="recipe-list">{recipeIcons}</div>
      </div>
    ) || <> </>
  );
};
