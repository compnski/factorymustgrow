import { AvailableResearchList } from "./availableResearch";
import { Entities } from "./gen/entities";
import { ImmutableMap } from "./immutable";
import { ReadonlyInventory } from "./inventory";
import { GetRegionInfo } from "./region";
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
    return 50;
  }

  AvailableSpace(entity: string): number {
    return 50;
  }

  Entities(): [string, number][] {
    return [...Entities.entries()].map(([, v]) => [v.Id, v.StackSize]);
  }
}

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
