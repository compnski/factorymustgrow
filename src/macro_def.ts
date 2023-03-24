import { findFirstEmptyLane } from "./building"
import { DebugInventory, DebugResearch } from "./debug"
import { GameDispatch } from "./GameDispatch"
import { DispatchFunc } from "./stateVm"
import { FactoryGameState, ReadonlyRegion } from "./factoryGameState"

export type MacroName = "redsci" | "allresearch" | "allitems"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Macro(
  reducer: DispatchFunc,
  gameState: FactoryGameState,
  regionId: string
): (name: MacroName) => void {
  return (name: MacroName) => {
    switch (name) {
      case "allresearch":
        return doAllResearch(reducer)
      case "allitems":
        return giveAllItems(reducer)
      case "redsci":
        return buildRedSci(reducer, gameState, regionId)
    }
  }
}

function doAllResearch(reducer: DispatchFunc) {
  reducer({
    kind: "SetProperty",
    address: "global",
    property: "Research",
    value: DebugResearch,
  })
}
function giveAllItems(reducer: DispatchFunc) {
  reducer({
    kind: "SetProperty",
    address: "global",
    property: "Inventory",
    value: new DebugInventory(),
  })
}

function buildRedSci(reducer: DispatchFunc, gameState: FactoryGameState, regionId: string) {
  const currentRegion = gameState.Regions.get(regionId)
  if (!currentRegion) throw new Error("No region")
  addProducers(reducer, gameState, currentRegion, [
    { kind: "electric-mining-drill", recipe: "iron-ore", connect: { below } },
    { kind: "stone-furnace", recipe: "iron-plate", connect: { below } },
    {
      kind: "assembling-machine-1",
      recipe: "iron-gear-wheel",
      connect: { below },
    },
    { kind: "assembling-machine-1", recipe: "automation-science-pack" },
    { kind: "stone-furnace", recipe: "copper-plate", connect: { above } },
    { kind: "electric-mining-drill", recipe: "copper-ore", connect: { above } },
  ])
  return null
}

let regionId = "region0"
export function setMacroRegionId(r: string) {
  regionId = r
}

function addProducers(
  dispatch: DispatchFunc,
  gameState: FactoryGameState,
  currentRegion: ReadonlyRegion,
  producerList: {
    kind: string
    recipe: string
    connect?: {
      above?: boolean
      below?: boolean
      belt?: string[]
    }
  }[]
) {
  const upperToggles: number[] = [],
    lowerToggles: number[] = []
  let buildingIdx = findFirstEmptyLane(currentRegion.BuildingSlots)
  producerList.forEach(({ recipe, kind, connect = {} }) => {
    GameDispatch(dispatch, gameState, {
      type: "TransferToInventory",
      entity: kind,
      otherStackKind: "Void",
      count: 1,
    })
    GameDispatch(dispatch, gameState, {
      type: "TransferToInventory",
      entity: "inserter",
      otherStackKind: "Void",
      count: 1,
    })

    GameDispatch(dispatch, gameState, {
      type: "PlaceBuilding",
      regionId,
      entity: kind,
      buildingIdx,
    })

    // let nextBuildingIdx =
    //   findFirstEmptyLane(currentRegion.BuildingSlots, nextBuildingIdx) || 0;

    // if (buildingIdx === nextBuildingIdx) {
    //   throw new Error(`Failed to add producer ${kind} for ${recipe}`);
    // }

    if (buildingIdx > 0)
      GameDispatch(dispatch, gameState, {
        type: "IncreaseInserterCount",
        buildingIdx: buildingIdx - 1,
        regionId,
        location: "BUILDING",
      })

    GameDispatch(dispatch, gameState, {
      type: "ChangeRecipe",
      regionId,
      buildingIdx: buildingIdx,
      recipeId: recipe,
    })
    if (connect.above) upperToggles.push(buildingIdx)
    if (connect.below) lowerToggles.push(buildingIdx)
    buildingIdx++
  })

  lowerToggles.forEach((buildingIdx) => {
    GameDispatch(dispatch, gameState, {
      type: "ToggleInserterDirection",
      regionId,
      buildingIdx: buildingIdx,
      location: "BUILDING",
    })
  })

  upperToggles.forEach((buildingIdx) => {
    GameDispatch(dispatch, gameState, {
      type: "ToggleInserterDirection",
      regionId,
      buildingIdx: buildingIdx - 1,
      location: "BUILDING",
    })
  })
}
const above = true,
  below = true
