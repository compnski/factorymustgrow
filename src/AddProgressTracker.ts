// Factory

import { Building } from "./building";
import { productionRunsForInput } from "./productionUtils";
import { BuildingAddress, StateAddress, StateVMAction } from "./stateVm";
import { EntityStack } from "./types";
import { ReadonlyItemBuffer } from "./useGameState";

export function AddProgressTrackers(
  dispatch: (a: StateVMAction) => void,
  address: BuildingAddress,
  producer: {
    progressTrackers: Readonly<number[]>;
    BuildingCount: number;
  },
  currentTick: number,
  count: number
): number {
  const trackersToAdd = Math.min(
    count,
    producer.BuildingCount - producer.progressTrackers.length
  );

  if (trackersToAdd)
    dispatch({
      kind: "AddProgressTrackers",
      count: trackersToAdd,
      address,
      currentTick,
    });

  return trackersToAdd;
}

export function RemoveProgressTracker(
  dispatch: (a: StateVMAction) => void,
  address: BuildingAddress,
  producer: {
    progressTrackers: Readonly<number[]>;
  }
): number {
  if (producer.progressTrackers.length === 0) return 0;

  dispatch({
    kind: "AddProgressTrackers",
    count: -1,
    address,
    currentTick: 0,
  });
  return 1;
}

export function TickProgressTracker(
  dispatch: (a: StateVMAction) => void,
  address: BuildingAddress,
  producer: { progressTrackers: Readonly<number[]> },
  currentTick: number,
  progressLength: number,
  maxRemoved: number
): number {
  let toRemoveCount = 0;
  for (
    let idx = 0;
    idx < Math.min(producer.progressTrackers.length, maxRemoved);
    idx++
  ) {
    const startedAt = producer.progressTrackers[idx];
    if (currentTick >= startedAt + progressLength) {
      toRemoveCount++;
    } else {
      break;
    }
  }

  if (toRemoveCount)
    dispatch({
      kind: "AddProgressTrackers",
      count: -toRemoveCount,
      address,
      currentTick,
    });

  return toRemoveCount;
}

interface ProgressTrackers {
  progressTrackers: number[];
  kind: string;
}
export function HasProgressTrackers(b: { kind: string }): b is ProgressTrackers;
export function HasProgressTrackers(b: {
  progressTrackers?: number[];
  kind: string;
}): b is ProgressTrackers {
  return b.progressTrackers !== undefined;
}

type trackerProps = {
  dispatch: (a: StateVMAction) => void;
  currentTick: number;
  buildingAddress: BuildingAddress;
  recipe: {
    Input: EntityStack[];
    Output: EntityStack[];
    DurationSeconds: number;
  };
  building: {
    progressTrackers: Readonly<number[]>;
    BuildingCount: number;
    inputBuffers?: ReadonlyItemBuffer;
    outputBuffers?: ReadonlyItemBuffer;
  };

  maxTriggersAdded?: number;
  outputAddress?: StateAddress;
  outputBuffers?: ReadonlyItemBuffer;
  inputAddress?: StateAddress;
  inputBuffers?: ReadonlyItemBuffer;
};

export function ProduceWithTracker({
  dispatch,
  currentTick,
  buildingAddress,
  building,
  recipe,
  maxTriggersAdded = Infinity,
  inputAddress,
  inputBuffers,
  outputAddress,
  outputBuffers,
}: trackerProps) {
  const ib = inputAddress ? inputBuffers : building.inputBuffers;
  if (!ib) throw new Error("Missing input");

  const ob = outputAddress ? outputBuffers : building.outputBuffers;
  if (!ob) throw new Error("Missing output");

  // Check empty factories
  const emptyFactoriesToStart = Math.min(
    productionRunsForInput(ib, recipe.Input),
    Math.max(building.BuildingCount - building.progressTrackers.length, 0),
    maxTriggersAdded
  );

  const addedTrackers = AddProgressTrackers(
    dispatch,
    buildingAddress,
    building,
    currentTick,
    emptyFactoriesToStart
  );

  if (addedTrackers) {
    // Consume resources
    for (const input of recipe.Input) {
      dispatch({
        kind: "AddItemCount",
        entity: input.Entity,
        count: -input.Count * addedTrackers,
        address: inputAddress
          ? inputAddress
          : { ...buildingAddress, buffer: "input" },
      });
    }
  }

  const availableInventorySpace = recipe.Output.reduce((accum, entityStack) => {
    const spaceInOutputStack = ob.AvailableSpace(entityStack.Entity);
    return Math.min(
      accum,
      Math.floor(spaceInOutputStack / recipe.Output[0].Count)
    );
  }, Infinity);

  const actualProduction = TickProgressTracker(
    dispatch,
    buildingAddress,
    building,
    currentTick,
    recipe.DurationSeconds * 1000,
    availableInventorySpace
  );

  if (!actualProduction) return 0;
  recipe.Output.forEach((outputStack) => {
    dispatch({
      // TODO: Use SetItem once it exists?
      kind: "AddItemCount",
      address: outputAddress
        ? outputAddress
        : { ...buildingAddress, buffer: "output" },
      entity: outputStack.Entity,
      count: outputStack.Count * actualProduction,
    });
  });
  return actualProduction;
}
