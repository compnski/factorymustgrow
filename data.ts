import { Map } from "immutable"
import * as entities from "./entities"
import { Recipe } from "./types"

export const Recipies = [
  entities.IronOreRecipe,
  entities.CopperOreRecipe,
  entities.StoneRecipe,
  entities.StoneFurnaceRecipe,
  entities.IronPlateRecipe,
  entities.CopperPlateRecipe,
  entities.CopperWireRecipe,
  entities.GearRecipe,
  entities.GreenChipRecipe,
  entities.MinerRecipe,
  entities.AssemblerRecipe,
  entities.IronChestRecipe,
]

export const RecipiesByName: Map<string, Recipe> = Map(Recipies.map((r) => [r.Name, r]))

export function GetRecipe(name: string): Recipe {
  const r = RecipiesByName.get(name)
  if (!r) throw `Failed to find recipe ${name}`
  return r
}
