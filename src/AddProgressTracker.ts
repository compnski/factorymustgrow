// Factory

import { Building } from "./building";
import { BuildingAddress, StateVMAction } from "./stateVm";

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
