import { GetResearch } from "./gen/research";
import { ReadonlyBuilding } from "./useGameState";

const seenSet = new Set<string>();

export const once = (key: string | number | null, f: () => void) => {
  const seenKey = new Error().stack + "_" + key;
  if (seenSet.has(seenKey)) return;
  seenSet.add(seenKey);
  f();
};

const Liquids = new Set([
  "water",
  "crude-oil",
  "heavy-oil",
  "light-oil",
  "lubricant",
  "petroleum-gas",
  "sulfuric-acid",
]);

export function entityIconLookupByKind(
  kind: string
): (entity: string) => string {
  switch (kind) {
    case "Lab":
      return (entity: string): string => {
        if (entity.endsWith("science-pack")) return entity;
        const research = !entity ? "" : GetResearch(entity);
        if (research) return "sprite-technology-" + research.Icon;
        return "sprite-technology-no-science";
      };
    case "MainBus":
      return (entity: string) => {
        if (Liquids.has(entity)) {
          return entity + "-barrel";
        }
        return entity;
      };
  }
  return function entityLookupInnerFunction(entity: string) {
    return entity;
  };
}

export function BuildingHasOutput(
  building?: string | ReadonlyBuilding,
  entity?: string
): boolean {
  if (typeof building === "string") {
    return building !== "Lab";
  }
  return Boolean(
    entity &&
      building &&
      BuildingHasOutput(building.kind) &&
      (building.outputBuffers.Accepts(entity) ||
        building.outputBuffers.Count(entity) > 0)
  );
}

export function BuildingHasInput(
  building?: string | ReadonlyBuilding,
  entity?: string
): boolean {
  if (typeof building === "string") {
    return building !== "Extractor";
  }
  return Boolean(
    entity &&
      building &&
      BuildingHasInput(building.kind) &&
      building.inputBuffers &&
      (building.inputBuffers.Accepts(entity) ||
        building.inputBuffers.Count(entity) > 0)
  );
}

export function showUserError(s: string) {
  console.log("User Error: " + s);
}

export function assertNever(shouldBeNever: never) {
  throw new Error("Was not never: " + shouldBeNever);
}

export function swap<T>(a: T[], lowerIdx: number, upperIdx: number): T[] {
  const lowerSlot = a[lowerIdx];
  const upperSlot = a[upperIdx];

  return [
    ...a.slice(0, lowerIdx),
    upperSlot,
    ...(upperIdx != lowerIdx + 1 ? a.slice(lowerIdx + 1, upperIdx) : []),
    lowerSlot,
    ...a.slice(upperIdx + 1),
  ];
}

export function replaceItem<T>(a: T[], idx: number, t: T): T[] {
  return [...a.slice(0, idx), t, ...a.slice(idx + 1)];
}
