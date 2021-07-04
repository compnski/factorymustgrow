import { Map } from "immutable";
//import * as entities from "./entities";
import { GetEntity, GetRecipe } from "./gen/entities";
import { Entity, EntityStack, ProducingEntity, ProducerType } from "./types";

export type Action = {
  type:
    | "Produce"
    | "AddProducer"
    | "RemoveProducer"
    | "AddProducerCapacity"
    | "RemoveProducerCapacity"
    | "UpgradeStorage"
    | "UpgradeResearch";
  producerName: string;
};

export type State = {
  EntityCounts: Map<string, number>;
  EntityStorageCapacityUpgrades: Map<string, number>;
  EntityProducers: Map<string, ProducingEntity>;
};

export const globalEntityCount = function (
  ec: Map<string, number>,
  e: string
): number {
  return ec.get(e) || 0;
};

export const entityStorageCapacity = function (
  es: Map<string, number>,
  e: string
): number {
  return GetEntity(e).StackSize * (1 + (es.get(e) || 0));
};

const ensureSufficientEntitiesExists = function (
  ec: Map<string, number>,
  stacks: EntityStack[]
): boolean {
  let ok = true;
  stacks.forEach(({ Entity, Count }) => {
    if (globalEntityCount(ec, Entity) < Count) ok = false;
  });
  return ok;
};

const ensureSufficientStorageExists = function (
  ec: Map<string, number>,
  es: Map<string, number>,
  stacks: EntityStack[]
): boolean {
  let ok = true;
  stacks.forEach(({ Entity, Count }) => {
    if (
      globalEntityCount(ec, Entity) + Count >
      entityStorageCapacity(es, Entity)
    )
      ok = false;
  });
  return ok;
};

const checkAndConsumeEntities = function (
  ec: Map<string, number>,
  stacks: EntityStack[]
): [Map<string, number>, boolean] {
  if (!ensureSufficientEntitiesExists(ec, stacks)) return [ec, false];
  const returnMap = ec.withMutations((ec: Map<string, number>) => {
    stacks.forEach(({ Entity, Count }) => {
      ec.update(Entity, (v) => (v || 0) - Count);
    });
  });
  return [returnMap, true];
};

const checkAndProduceEntities = function (
  ec: Map<string, number>,
  es: Map<string, number>,
  stacks: EntityStack[]
): [Map<string, number>, boolean] {
  if (!ensureSufficientStorageExists(ec, es, stacks)) return [ec, false];
  const returnMap = ec.withMutations((ec: Map<string, number>) => {
    stacks.forEach(({ Entity, Count }) => {
      ec.update(Entity, (v) => (v || 0) + Count);
    });
  });
  return [returnMap, true];
};

export const CurrentMaxProducerCount = function (p: ProducingEntity): number {
  return 50;
};

export function ProducerTypeUpgradeCost(
  type: ProducerType,
  _upgradeLevel: number
): EntityStack[] {
  switch (type) {
    case "Assembler":
      return [{ Entity: "assembling-machine-1", Count: 1 }];
    case "Smelter":
      return [{ Entity: "stone-furnace", Count: 1 }];
    case "Miner":
      return [{ Entity: "eletric-mining-drill", Count: 1 }];
    case "ChemFactory":
      return [];
    case "Refinery":
      return [];
    case "Pumpjack":
      return [];
  }
}

export function ProducerTypeCapacityUpgradeCost(
  type: ProducerType,
  _upgradeLevel: number
): EntityStack[] {
  switch (type) {
    case "Assembler":
    case "Smelter":
    case "Miner":
      return [{ Entity: "transport-belt", Count: 1 }];
    case "ChemFactory":
      return [];
    case "Refinery":
      return [];
    case "Pumpjack":
      return [];
  }
}

export function StorageUpgradeCost(
  type: string,
  _upgradeLevel: number
): EntityStack[] {
  switch (type) {
    case "Solid":
      return [{ Entity: "iron-chest", Count: 1 }];
    case "Liquid":
      return [];
  }
  return [];
}

export function entityCountReducer(state: State, action: Action): State {
  const { type, producerName } = action;
  const producer = state.EntityProducers.get(producerName);
  if (!producer) {
    console.log(`Cannot find producer with name ${producerName}`);
    return state;
  }
  const recipe = GetRecipe(producer.RecipeName);
  let ec = state.EntityCounts;
  let es = state.EntityStorageCapacityUpgrades;
  let ep = state.EntityProducers;
  let ok: boolean;
  switch (type) {
    case "Produce":
      [ec, ok] = checkAndConsumeEntities(ec, recipe.Input);
      console.log(ok);
      if (ok) [ec, ok] = checkAndProduceEntities(ec, es, recipe.Output);
      console.log(ok);
      if (!ok) return state;
      console.log(state);
      return {
        ...state,
        EntityCounts: ec,
      };
    case "AddProducer":
      if (producer.ProducerCount > CurrentMaxProducerCount(producer))
        return state;
      [ec, ok] = checkAndConsumeEntities(
        ec,
        ProducerTypeUpgradeCost(recipe.ProducerType, producer.ProducerCount)
      );
      if (!ok) return state;
      ep = ep.set(producerName, {
        ...producer,
        ProducerCount: (producer.ProducerCount || 0) + 1,
      });
      return { ...state, EntityCounts: ec, EntityProducers: ep };
    case "RemoveProducer":
      if (producer.ProducerCount <= 0) return state;
      [ec, ok] = checkAndProduceEntities(
        ec,
        es,
        ProducerTypeUpgradeCost(recipe.ProducerType, producer.ProducerCount)
      );
      if (!ok) return state;
      ep = ep.set(producerName, {
        ...producer,
        ProducerCount: (producer.ProducerCount || 0) - 1,
      });
      return { ...state, EntityCounts: ec, EntityProducers: ep };
    case "UpgradeStorage":
      [ec, ok] = checkAndConsumeEntities(
        ec,
        StorageUpgradeCost(
          GetEntity(recipe.Output[0].Entity).StorageUpgradeType,
          ec.get(recipe.Output[0].Entity) || 0
        )
      );
      if (!ok) return state;
      es = es.update(recipe.Output[0].Entity, (v) => (v || 0) + 1);
      return { ...state, EntityCounts: ec, EntityStorageCapacityUpgrades: es };

    case "AddProducerCapacity":
    case "RemoveProducerCapacity":
    case "UpgradeResearch":
    default:
      return state;
  }
}
