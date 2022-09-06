import { Map } from "immutable";
import { TestEntityList } from "../test_entity_defs";
import { TestRecipeBook } from "../test_recipe_defs";
import { TestResearchBook } from "../test_research_defs";
import { Entity, Recipe, Research } from "../types";

export function MaybeGetEntity(name: string): Entity | undefined {
  const e = Entities.get(name);
  if (!e) return Entities.first();
  return e;
}

export function GetEntity(name: string): Entity {
  const e = Entities.get(name);
  if (!e) return Entities.first(); //throw new Error("Cannot find entity for " + name);
  return e;
}

export function MaybeGetRecipe(name = ""): Recipe | undefined {
  const r = Recipes.get(name);
  return r;
}

export function GetRecipe(name: string): Recipe {
  const r = Recipes.get(name);
  if (!r) return Recipes.first(); //throw new Error("Cannot find recipe for " + name);
  return r;
}

export function GetResearch(name: string): Research {
  const r = ResearchMap.get(name);
  if (!r) throw new Error("Cannot find research for " + name);
  return r;
}

interface LoadedData {
  EntityMap: Record<string, Entity>;
  RecipeMap: Record<string, Recipe>;
  ResearchMap: Record<string, Research>;
}

export async function LoadEntitySet(setName: string) {
  const url = `${process.env.PUBLIC_URL}/data/${setName}-out.json`;
  const dataset: LoadedData = await fetch(url).then((res) => res.json());

  Entities = Map(dataset.EntityMap);
  Recipes = Map(dataset.RecipeMap);
  ResearchMap = Map(dataset.ResearchMap);
}

export let Entities: Map<string, Entity> = Map(TestEntityList);
export let Recipes: Map<string, Recipe> = Map(TestRecipeBook);
export let ResearchMap: Map<string, Research> = Map(TestResearchBook);
