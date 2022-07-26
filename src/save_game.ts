import { CurrentGameStateVersion, FactoryGameState } from "./factoryGameState";
import { deserializeGameState, serializeGameState } from "./localstorage";
import { compressToBase64, decompressFromBase64 } from "lz-string";

export type SaveGame = SaveGameMetadata & {
  serializedGameState: string;
};

export type SaveGameMetadata = {
  gameStateVersion: string;
  name: string;
  createdAtMs: number;
  kind: "fmg";
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

export function loadSaveGame(sgmKey: string): string | undefined {
  const key = saveGameDataKey(sgmKey);
  const val = localStorage.getItem(key);
  if (!val) return;
  const data = JSON.parse(val) as Partial<SaveGame>;
  if (data.serializedGameState)
    return fromSaveGame(data as Pick<SaveGame, "serializedGameState">);
}

export function saveGameToLocalStorage(gs: FactoryGameState, name: string) {
  const sg = toSaveGame(gs, name);
  const sgm = { ...sg, serializeGameState: undefined };
  const sgmKey = saveGameMetadataKey(sgm);
  const sgmDataKey = saveGameDataKey(sgmKey);
  localStorage.setItem(sgmKey, JSON.stringify(sgm));
  localStorage.setItem(sgmDataKey, JSON.stringify(sg));
}

function toSaveGame(gs: FactoryGameState, name: string): SaveGame {
  return {
    serializedGameState: compressToBase64(serializeGameState(gs)),
    gameStateVersion: CurrentGameStateVersion,
    name,
    createdAtMs: Date.now(),
    kind: "fmg",
  };
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
  const shortname = sg.name.substring(0, 6);
  return `sg.${shortname}.${Date.now()}.metadata`;
}

function maybeSaveGameMetadataKey(key: string): boolean {
  return key.startsWith("sg.") && key.endsWith(".metadata");
}

function saveGameDataKey(metadataKey: string): string {
  return metadataKey.replace(".metadata", ".gamestate");
}
