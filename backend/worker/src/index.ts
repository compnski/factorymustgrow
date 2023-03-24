/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Env, isCommentRequest } from "./types"
import { deleteState, getManyComments, listStates, loadState, saveComment, saveState } from "./kv"
import { SaveStateRequestValidator } from "./validators"

const baseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS,DELETE",
  "Access-Control-Max-Age": "86400",
  "Content-Type": "application/json",
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (request.method == "OPTIONS") {
      const r = new Response(JSON.stringify({ status: "ok" }))
      setHeaders(r.headers)
      return r
    }

    if (request.method == "GET" && isListSaveRequest(url)) {
      return await serveListSaveRequest(url, env)
    }
    if (request.method == "GET" && isSaveRequest(url)) {
      return await serveGetSaveRequest(url, env)
    }
    if (request.method == "GET" && isListCommentRequest(url)) {
      return await serveListCommentRequest(url, env)
    }
    if (request.method == "DELETE" && isSaveRequest(url)) {
      return await serveDeleteSaveRequest(url, env)
    }
    if (request.method == "POST") {
      const body = await request.json()
      if (isCommentRequest(body)) {
        await saveComment(env, body)
      }
      if (isSaveRequest(url)) {
        try {
          const { value: saveRequest, error } = SaveStateRequestValidator.validate(body)
          if (error) throw error
          if (saveRequest) {
            await saveState(env, saveRequest)
          }
        } catch (e) {
          console.warn(e)
        }
      }

      const r = new Response(JSON.stringify({ status: "ok" }))
      setHeaders(r.headers)
      return r
    }
    return new Response(null, { status: 404, statusText: "Nothing here" })
  },
}

function isListSaveRequest(url: URL) {
  return url.pathname.endsWith("/saves")
}

async function serveListSaveRequest(url: URL, env: Env): Promise<Response> {
  const cloudSaveName = url.searchParams.get("cloudSaveName")
  const states = await listStates(env, cloudSaveName)
  const r = new Response(JSON.stringify(states))
  setHeaders(r.headers)

  return r
}

function isSaveRequest(url: URL) {
  return url.pathname.endsWith("/save")
}

async function serveGetSaveRequest(url: URL, env: Env): Promise<Response> {
  const cloudSaveName = url.searchParams.get("cloudSaveName")
  const saveVersion = url.searchParams.get("saveVersion")
  const saveGameState = await loadState(env, cloudSaveName, saveVersion)

  const r = new Response(saveGameState)
  setHeaders(r.headers)
  return r
}

async function serveDeleteSaveRequest(url: URL, env: Env): Promise<Response> {
  const cloudSaveName = url.searchParams.get("cloudSaveName")
  const saveVersion = url.searchParams.get("saveVersion")
  await deleteState(env, cloudSaveName, saveVersion)
  const r = new Response("ok")
  setHeaders(r.headers)
  return r
}

function isListCommentRequest(url: URL) {
  return url.pathname.endsWith("/comments")
}

async function serveListCommentRequest(url: URL, env: Env): Promise<Response> {
  const comments = await getManyComments(env)
  const r = new Response(JSON.stringify(comments, undefined, 2))
  setHeaders(r.headers)
  return r
}

function setHeaders(headers: Headers) {
  Object.entries(baseHeaders).forEach(([key, value]) => headers.set(key, value))
  headers.append("Vary", "Origin")
}
