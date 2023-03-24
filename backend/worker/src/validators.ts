import * as Joi from "joi"
import type { SaveGame, SaveStateRequest } from "./types"

export const SaveGameValidator = Joi.object<SaveGame>({
  serializedGameState: Joi.string().min(1).max(1_000_000).optional(),
  saveVersion: Joi.string().min(1).max(128).required(),
  createdAtMs: Joi.number().min(0).required(),
  kind: Joi.string().valid("fmg").required(),
  gameStateVersion: Joi.string().min(1).required(),
  gameStateHash: Joi.string().min(1).max(256).required(),
  datapackName: Joi.string().min(1).max(256).required(),
  schemaVersion: Joi.number().valid(1),
})

export const SaveStateRequestValidator = Joi.object<SaveStateRequest>({
  cloudSaveName: Joi.string().min(1).required(),
  saveGame: SaveGameValidator,
})
