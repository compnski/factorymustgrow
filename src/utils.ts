import { Building } from "./building";
import { GetResearch } from "./gen/research";

const seenSet = new Set<any>();

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
        const research = GetResearch(entity);
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
  return (entity: string) => {
    return entity;
  };
}

export function BuildingHasOutput(
  building?: string | Building,
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
  building?: string | Building,
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

export function showUserError(s: String) {
  console.log("User Error: " + s);
}
