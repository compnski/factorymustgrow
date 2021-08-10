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
        return "";
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

export function ProducerHasOutput(kind?: string): boolean {
  return kind !== "Lab";
}

export function ProducerHasInput(kind?: string): boolean {
  return kind !== "Extractor";
}
