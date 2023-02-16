import { AvailableResearchList } from "./availableResearch";
import { GetEntity } from "./gen/entities";
import { ImmutableMap } from "./immutable";
import { ReadonlyInventory } from "./inventory";
import { GetRegionInfo } from "./region";
import { availableItems } from "./research";
import { TruckLine } from "./transport";
import { NewEntityStack, NewRegionFromInfo } from "./types";

export class DebugInventory extends ReadonlyInventory {
  constructor() {
    super(0);
    this.SerializeName = "DebugInventory" as const;
  }

  AddItems(): DebugInventory {
    return this;
  }

  HasSlotFor(): boolean {
    return true;
  }

  Count(): number {
    return Infinity;
  }

  AvailableSpace(): number {
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
    TruckLines: ImmutableMap<string, Readonly<TruckLine>>(),
  };
}
