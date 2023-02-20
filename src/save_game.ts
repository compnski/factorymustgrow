import { compressToBase64, decompressFromBase64 } from "lz-string";
import { CurrentGameStateVersion, FactoryGameState } from "./factoryGameState";
import { serializeGameState } from "./localstorage";
import { settings } from "./settings";

const prodHost =
  "https://factorymustgrow-production.factorymustgrow.workers.dev";
const devHost = "http://127.0.0.1:8787";
const host = process.env.NODE_ENV == "development" ? devHost : prodHost;

const getCloudSaveUrl = host + "/save";
const listCloudSaveUrl = host + "/saves";
const saveCloudSaveUrl = getCloudSaveUrl;

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

export function listSaveGamesInLocalStorage() {
  const saves: Record<string, SaveGameMetadata> = {};
  for (let idx = 0; idx < localStorage.length; idx++) {
    const key = localStorage.key(idx);
    if (!key) continue;
    if (maybeSaveGameMetadataKey(key)) {
      const val = localStorage.getItem(key);
      if (!val) continue;
      const data = JSON.parse(val);
      if (isSaveGameMetadata(data)) saves[key] = data;
    }
  }
  return saves;
}

export async function loadCloudSaveGame(
  cloudSaveName: string,
  sgmKey: string
): Promise<string | undefined> {
  if (!settings.cloudSaveEnabled) throw new Error("Cloud saves disabled");
  const data = await fetchCloudSaveState(cloudSaveName, sgmKey);
  console.log(data);
  if (data?.serializedGameState)
    return fromSaveGame(data as Pick<SaveGame, "serializedGameState">);
}

async function fetchCloudSaveState(
  cloudSaveName: string,
  saveVersion: string
): Promise<undefined | Partial<SaveGame>> {
  const response = await fetch(
    getCloudSaveUrl +
      `?cloudSaveName=${cloudSaveName}&saveVersion=${saveVersion}`
  );
  if (!response.ok) {
    return;
  }
  const jsonObj = await response.json();
  return jsonObj;
}

export type SavedState = {
  name: string;
  state?: string;
  stateVersion: string;
  createdAt: string;
};

export async function listSavedGamesInCloudStorage(cloudSaveName: string) {
  if (!settings.cloudSaveEnabled) return;
  const response = await fetch(
    listCloudSaveUrl + `?cloudSaveName=${cloudSaveName}`
  );
  if (!response.ok) {
    return;
  }
  const jsonObj = (await response.json()) as SaveGameMetadata[];
  return jsonObj;
}

export async function saveGameToCloudStorage(
  cloudSaveName: string,
  gs: FactoryGameState,
  name: string
) {
  if (!settings.cloudSaveEnabled) return;

  const sg = { saveGame: await toSaveGame(gs, name), cloudSaveName };

  await fetch(saveCloudSaveUrl, {
    method: "POST",
    body: JSON.stringify(sg),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function deleteGameFromCloudStorage(
  cloudSaveName: string,
  saveVersion: string
) {
  if (!settings.cloudSaveEnabled) return;
  await fetch(
    saveCloudSaveUrl +
      `?cloudSaveName=${cloudSaveName}&saveVersion=${saveVersion}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export function loadSaveGame(sgmKey: string): string | undefined {
  const key = saveGameDataKey(sgmKey);
  const val = localStorage.getItem(key);
  if (!val) return;
  const data = JSON.parse(val) as Partial<SaveGame>;
  if (data.serializedGameState)
    return fromSaveGame(data as Pick<SaveGame, "serializedGameState">);
}

export function deleteGameFromLocalStorage(sgmKey: string) {
  const sgmDataKey = saveGameDataKey(sgmKey);
  localStorage.removeItem(sgmKey);
  localStorage.removeItem(sgmDataKey);
}

export async function saveGameToLocalStorage(
  gs: FactoryGameState,
  name: string
) {
  const sg = await toSaveGame(gs, name);
  const sgm = { ...sg, serializedGameState: undefined };
  const sgmKey = saveGameMetadataKey(sgm);
  const sgmDataKey = saveGameDataKey(sgmKey);
  localStorage.setItem(sgmKey, JSON.stringify(sgm));
  localStorage.setItem(sgmDataKey, JSON.stringify(sg));
}

async function toSaveGame(
  gs: FactoryGameState,
  saveVersion: string
): Promise<SaveGame> {
  const gameState = serializeGameState(gs);
  return {
    serializedGameState: compressToBase64(gameState),
    gameStateVersion: CurrentGameStateVersion,
    saveVersion,
    createdAtMs: Date.now(),
    kind: "fmg",
    gameStateHash: await sha256(gameState),
    datapackName: "factorio",
    schemaVersion: 1,
  };
}

async function sha256(msg: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(msg);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

function fromSaveGame(s: Pick<SaveGame, "serializedGameState">): string {
  const state = decompressFromBase64(s.serializedGameState);
  if (!state) throw new Error("Failed to decompress.");
  return state;
}

function isSaveGameMetadata(s: object): s is SaveGameMetadata {
  const sg = s as SaveGameMetadata;
  return sg && sg.kind == "fmg" && sg.gameStateVersion != undefined;
}

function saveGameMetadataKey(sg: SaveGameMetadata): string {
  const shortname = sg.saveVersion.substring(0, 6);
  return `sg.${shortname}.${Date.now()}.metadata`;
}

function maybeSaveGameMetadataKey(key: string): boolean {
  return key.startsWith("sg.") && key.endsWith(".metadata");
}

function saveGameDataKey(metadataKey: string): string {
  return metadataKey.replace(".metadata", ".gamestate");
}
