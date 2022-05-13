/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

type SaveStateRequest = {
  stateJson: string;
  stateName: string;
  userName: string;
};

type CommentRequest = {
  comment: string;
  state?: object;
  userName?: string;
  userEmail?: string;
  feeling?: string;
};

function isCommentRequest(b: unknown): b is CommentRequest {
  return typeof (b as CommentRequest).comment === "string";
}

function isSaveStateRequest(b: unknown): b is SaveStateRequest {
  const r = b as SaveStateRequest;
  return (
    r.stateJson != undefined &&
    r.userName != undefined &&
    r.stateName != undefined
  );
}

type Env = {
  FACTORY_KV: KVNamespace;
};
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body = await request.json();
    if (isCommentRequest(body)) {
      await saveComment(env, body);
    }
    if (isSaveStateRequest(body)) {
      await saveState(env, body);
    }
    return new Response(JSON.stringify({ status: "ok" }));
  },
};

async function saveComment(env: Env, body: CommentRequest) {
  await env.FACTORY_KV.put(commentKey(), JSON.stringify(body));
}

async function saveState(env: Env, body: SaveStateRequest) {
  await env.FACTORY_KV.put(newKey(body), body.stateJson);
}

function commentKey() {
  return `comments/${new Date()}`;
}

function newKey({
  stateName,
  userName,
}: Pick<SaveStateRequest, "stateName" | "userName">) {
  return `${userName}/${stateName}`;
}
