import { Map } from "immutable";
import { FilterToAvailableResearch } from "../availableResearch";
import { TestEntityList } from "../test_entity_defs";
import { TestRecipeBook } from "../test_recipe_defs";
import { TestResearchBook } from "../test_research_defs";
import { Entity, EntityStack, Recipe, Research } from "../types";

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

type JsonResearch = {
  Id: string;
  Name: string;
  Icon: string;
  Input: EntityStack[];
  // How many units of research must be produced (at Input cost) to learn this research
  ProductionRequiredForCompletion: number;
  ProductionPerTick: number;
  DurationSeconds: number;
  Row: number;
  Prereqs: string[];
  Unlocks: string[];
  Effects: string[];
};

interface LoadedData {
  EntityMap: Record<string, Entity>;
  RecipeMap: Record<string, Recipe>;
  ResearchMap: Record<string, JsonResearch>;
}

function toResearch(r: JsonResearch): Research {
  return { ...r, Prereqs: new Set(r.Prereqs) };
}

export async function LoadEntitySet(setName: string) {
  const url = `${process.env.PUBLIC_URL}/data/${setName}-out.json`;
  const dataset: LoadedData = await fetch(url).then((res) => res.json());

  // TODO: Research is missing prereqs
  Entities = Map(dataset.EntityMap);
  Recipes = Map(dataset.RecipeMap);
  ResearchMap = Map(
    Object.entries(dataset.ResearchMap).map(([k, v]) => [k, toResearch(v)])
  );
  AvailableResearchList = [...ResearchMap.values()].filter(
    FilterToAvailableResearch
  );

  return { Entities, Recipes, ResearchMap };
}

export let Entities: Map<string, Entity> = Map(TestEntityList);
export let Recipes: Map<string, Recipe> = Map(TestRecipeBook);
export let ResearchMap: Map<string, Research> = Map(TestResearchBook);
export let AvailableResearchList = [...ResearchMap.values()].filter(
  FilterToAvailableResearch
);

export const LoadedVersion = { test: 1 };
