import { AvailableResearchList } from "./availableResearch";
import { Entities, GetEntity } from "./gen/entities";
import { ImmutableMap } from "./immutable";
import { ReadonlyInventory } from "./inventory";
import { GetRegionInfo } from "./region";
import { availableItems } from "./research";
import { BeltLine } from "./transport";
import { NewEntityStack, NewRegionFromInfo } from "./types";

export class DebugInventory extends ReadonlyInventory {
  constructor() {
    super(0);
  }

  AddItems(entity: string, count: number): DebugInventory {
    return this;
  }

  HasSlotFor(entity: string): boolean {
    return true;
  }

  Count(entity: string): number {
    return Infinity;
  }

  AvailableSpace(entity: string): number {
    return Infinity;
  }

  Entities(): [string, number][] {
    return availableItems(DebugResearch).map((entity) => [
      entity,
      GetEntity(entity).StackSize,
    ]);
  }
}

export const DebugResearch = {
  Progress: ImmutableMap(
    AvailableResearchList.map(({ Id: research }) => [
      research,
      NewEntityStack(research, 0, 0),
    ])
  ),
  CurrentResearchId: "",
};

export function debugFactoryGameState() {
  return {
    RocketLaunchingAt: 0,
    Research: {
      Progress: ImmutableMap(
        AvailableResearchList.map(({ Id: research }) => [
          research,
          NewEntityStack(research, 0, 0),
        ])
      ),
      CurrentResearchId: "",
    },
    Inventory: new DebugInventory(),
    Regions: ImmutableMap([
      ["region0", NewRegionFromInfo(GetRegionInfo("region0"))],
    ]),
    BeltLines: ImmutableMap<string, Readonly<BeltLine>>(),
  };
}
