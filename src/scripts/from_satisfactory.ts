import { readFileSync, writeFileSync } from "fs"
import { Entity, EntityStack, Recipe, Research, SatisfactoryBuildingType } from "../types"
import { notEmpty } from "../utils"

interface SatisfactoryItem {
  slug: string
  className: string
  name: string
  sinkPoints: number | null
  description: string
  stackSize: number
  energyValue: number
  liquid: boolean
}

export function convertToEntity(filename: string) {
  const contents = readFileSync(filename)
  const data = JSON.parse(contents.toString("utf-8")) as Record<string, SatisfactoryItem>

  const RowLength = 10
  return Object.values(data).map((item: SatisfactoryItem, idx: number) => {
    const Col = (idx % RowLength) + 1,
      Row = Math.ceil(idx / RowLength)
    const r: Entity = {
      Id: item.className,
      Name: item.name,
      Category: toCategory(item),
      Icon: toIcon(item),
      StackSize: item.stackSize,
      Row,
      Col,
    }
    return [item.className, r]
  })
}

interface SatisfactoryRecipe {
  slug: string
  name: string
  className: string
  alternate: boolean
  time: number
  ingredients: {
    item: string
    amount: number
  }[]
  forBuilding: boolean
  inMachine: boolean
  inHand: boolean
  inWorkshop: boolean
  products: {
    item: string
    amount: number
  }[]
  producedIn: [string] | []
}

export function convertToRecipe(filename: string) {
  const contents = readFileSync(filename)
  const data = JSON.parse(contents.toString("utf-8")) as Record<string, SatisfactoryRecipe>
  return Object.values(data).map((recipe: SatisfactoryRecipe, idx: number) => {
    const r: Recipe = {
      Icon: toIcon(recipe),
      Id: recipe.className,
      ProducerType: producerType(recipe),
      DurationSeconds: recipe.time,
      Input: toEntityStack(recipe.ingredients),
      Output: toEntityStack(recipe.products),
      ProductionPerTick: 1 / recipe.time,
    }
    return [r.Id, r]
  })
}

interface SatisfactoryResearch {
  className: string
  name: string
  slug: string
  tier: number
  cost: {
    item: string
    amount: number
  }[]
  unlock: {
    inventorySlots: number
    recipes: string[]
    scannerResources: string[]
    giveItems: string[]
  }
  requiredSchematics: string[]
  type: "EST_MAM" | "EST_Alternate" | "EST_HardDrive" | "EST_Milestone" | "EST_ResourceSink" | "EST_Tutorial"
  time: number
  alternate: boolean
  mam: boolean
}

export function convertToResearch(filename: string) {
  const contents = readFileSync(filename)
  const data = JSON.parse(contents.toString("utf-8")) as Record<string, SatisfactoryResearch>
  return Object.values(data)
    .map((recipe: SatisfactoryResearch) => {
      const r: Research = {
        Id: recipe.className,
        Name: recipe.name,
        Icon: toIcon(recipe),
        Input: toEntityStack(recipe.cost),
        // How many units of research must be produced (at Input cost) to learn this research
        ProductionRequiredForCompletion: 1,
        ProductionPerTick: 1 / (recipe.time || 1),
        DurationSeconds: recipe.time || 1,
        Row: recipe.tier,
        Prereqs: new Set<string>(),
        Unlocks: recipe.unlock.recipes,
        Effects: [],
      }
      if (r.Unlocks.length == 0) {
        if (recipe.type != "EST_ResourceSink") console.log("Useless recipe ", recipe.name, recipe.className)
        return null
      }
      return [r.Id, r]
    })
    .filter(notEmpty)
}

function toCategory(item: SatisfactoryItem): string {
  return "Item"
}

function toIcon(item: { slug: string }): string {
  return `${item.slug}`
}

function producerType(recipe: SatisfactoryRecipe): SatisfactoryBuildingType {
  if (recipe.producedIn.length)
    switch (recipe.producedIn[0]) {
      case "Desc_AssemblerMk1_C":
        return "Assembler"
      case "Desc_Blender_C":
        return "Blender"
      case "Desc_ConstructorMk1_C":
        return "Constructor"
      case "Desc_FoundryMk1_C":
        return "Foundry"
      case "Desc_HadronCollider_C":
        return "HadronCollider"
      case "Desc_ManufacturerMk1_C":
        return "Manufacturer"
      case "Desc_OilRefinery_C":
        return "OilRefinery"
      case "Desc_Packager_C":
        return "Packager"
      case "Desc_SmelterMk1_C":
        return "Smelter"
    }
  switch (recipe.ingredients.length) {
    case 1:
      return "Constructor"
    case 2:
      return "Assembler"
    case 3:
    case 4:
      return "Manufacturer"
    default:
      console.warn(
        "Skipping ",
        recipe.name,
        "Too many ingredients for: " + JSON.stringify(recipe, undefined, 4)
      )
      return "Empty"
  }
}

function toEntityStack(ingredients: { item: string; amount: number }[]): EntityStack[] {
  return ingredients.map(({ item, amount }) => ({
    Count: amount,
    Entity: item,
  }))
}

const items = convertToEntity("satisfactory-items-in.json")
const recipes = convertToRecipe("satisfactory-recipes-in.json")
const research = convertToResearch("satisfactory-research-in.json")

writeFileSync(
  "satisfactory-out.json",
  JSON.stringify(
    {
      EntityMap: Object.fromEntries(items),
      RecipeMap: Object.fromEntries(recipes),
      ResearchMap: Object.fromEntries(research),
    },
    undefined,
    2
  )
)
