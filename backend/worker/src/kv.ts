import { CommentRequest, Env, SaveGame, SaveGameMetadata, SaveStateRequest } from "./types"
import { notEmpty } from "./utils"
import { SaveGameValidator } from "./validators"

export async function saveComment(env: Env, body: CommentRequest) {
  await env.FACTORY_KV.put(commentKey(), JSON.stringify(body))
}

export async function saveState(env: Env, body: SaveStateRequest) {
  const ret = await env.FACTORY_KV.put(
    saveStateKey(body.cloudSaveName, body.saveGame.saveVersion),
    JSON.stringify(body.saveGame),
    {
      metadata: {
        ...body.saveGame,
        serializedGameState: undefined,
      },
    }
  )
  console.log(`Saved ${body.cloudSaveName}/${body.saveGame.saveVersion}`)
}

export async function getManyComments(env: Env): Promise<string[]> {
  const resp = await env.FACTORY_KV.list({
    prefix: "comments/",
  })

  return (await Promise.all(resp.keys.map(({ name }) => env.FACTORY_KV.get(name)))).filter(notEmpty)
}

export async function listStates(env: Env, cloudSaveName: string): Promise<SaveGameMetadata[]> {
  const resp = await env.FACTORY_KV.list({
    prefix: saveStateKey(cloudSaveName, ""),
  })
  return resp.keys.map(({ metadata }) => SaveGameValidator.validate(metadata).value).filter(notEmpty)
}

export async function loadState(env: Env, cloudSaveName: string, saveVersion: string) {
  return await env.FACTORY_KV.get(saveStateKey(cloudSaveName, saveVersion))
}

export async function deleteState(env: Env, cloudSaveName: string, saveVersion: string) {
  return await env.FACTORY_KV.delete(saveStateKey(cloudSaveName, saveVersion))
}

function commentKey() {
  return `comments/${new Date()}`
}

function saveStateKey(cloudSaveName: string, saveVersion: string) {
  return `saves/${cloudSaveName}/${saveVersion}`
}
