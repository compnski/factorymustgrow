export type Env = {
  FACTORY_KV: KVNamespace;
};

export type SaveGame = SaveGameMetadata & {
  serializedGameState: string;
};

export type SaveGameMetadata = {
  gameStateVersion: string;
  saveVersion: string;
  createdAtMs: number;
  kind: "fmg";
  gameStateHash: string;
  datapackName: string;
  schemaVersion: 1;
};

export type SaveStateRequest = {
  saveGame: SaveGame;
  cloudSaveName: string;
};

export type CommentRequest = {
  comment: string;
  state?: object;
  userName?: string;
  userEmail?: string;
  feeling?: string;
};

export function isCommentRequest(b: unknown): b is CommentRequest {
  return typeof (b as CommentRequest).comment === "string";
}
