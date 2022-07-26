import {
  MouseEvent as ReactMouseEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import {
  CurrentGameStateVersion,
  initialFactoryGameState,
} from "../factoryGameState";
import { serializeGameState } from "../localstorage";
import { reallyRandomName } from "../namegen";
import {
  listSaveGamesInLocalStorage,
  loadSaveGame,
  SaveGameMetadata,
  saveGameToLocalStorage,
} from "../save_game";
import "./SaveCard.scss";

export type SavedState = {
  name: string;
  state?: string;
  stateVersion: string;
  createdAt: string;
};

export type SaveCardProps = {
  onConfirm: (evt: SyntheticEvent, saveData: string) => void;
};

export const SaveCard = function SaveCard({ onConfirm }: SaveCardProps) {
  function handleClick(
    evt: ReactMouseEvent<HTMLLIElement, MouseEvent>,
    name: string
  ): void {
    evt.preventDefault();
    onConfirm(evt, name);
  }

  const [localSaves, setLocalSaves] = useState<
    Record<string, SaveGameMetadata>
  >({});
  const [newSaveName, setNewSaveName] = useState("");

  useEffect(() => {
    setLocalSaves(listSaveGamesInLocalStorage);
  }, []);

  const [cloudSaveName, setCloudSaveName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("cloudSaveName") || "";
      const savedValue = (JSON.parse(saved) as string) || "";
      return saved == "" ? reallyRandomName() : savedValue;
    } catch (e) {
      return reallyRandomName();
    }
  });

  useEffect(() => {
    localStorage.setItem("cloudSaveName", JSON.stringify(cloudSaveName));
  }, [cloudSaveName]);

  const [cloudSaves, setCloudSaves] = useState<SavedState[]>([]);

  useEffect(() => {
    // TODO: Debounce
    void fetchCloudSaves(cloudSaveName, setCloudSaves);
  }, [cloudSaveName]);

  function saveGame(name: string) {
    // TODO: Hack to get game state :/
    saveGameToLocalStorage(window.GameState(), name);
  }

  function loadGame(
    evt: ReactMouseEvent<HTMLLIElement, MouseEvent>,
    sgmKey: string
  ) {
    const gameData = loadSaveGame(sgmKey);
    if (gameData) onConfirm(evt, gameData);
  }

  return (
    <div className="modal save-card">
      <div className="inner-frame">
        <span
          className="material-icons close-icon clickable"
          onClick={(evt) => onConfirm(evt, "")}
        >
          close
        </span>
        <div className="help-text">
          <div>Cloud Saves!</div>
          <div style={{ fontSize: 16 }}>TBD</div>
        </div>
        <div className="inner-content">
          <label>
            <input
              type="text"
              value={cloudSaveName}
              onChange={(evt) => setCloudSaveName(evt.target.value)}
            />
          </label>
          <div>
            <label>
              <input
                type="text"
                value={newSaveName}
                onChange={(evt) => setNewSaveName(evt.target.value)}
              />
            </label>
            <button onClick={() => saveGame(newSaveName)}>New Save</button>
          </div>
          <p>States:</p>
          <ul className="stateList">
            {Object.entries(localSaves).map(([key, sgm]) => (
              <li key={sgm.createdAtMs} onClick={(evt) => loadGame(evt, key)}>
                <span>
                  {sgm.name} - {new Date(sgm.createdAtMs).toString()}
                </span>
              </li>
            ))}
            {cloudSaves.map((stateInfo) => (
              <li
                key={stateInfo.name}
                onClick={(evt) => handleClick(evt, stateInfo.name)}
              >
                <span>
                  {stateInfo.name} - {stateInfo.createdAt}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const listCloudSaveUrl =
  "https://factorymustgrow-production.factorymustgrow.workers.dev/states";

async function fetchCloudSaves(
  cloudSaveName: string,
  setCloudSaves: (s: SavedState[]) => void
) {
  const response = await fetch(
    listCloudSaveUrl + `?stateName=${cloudSaveName}`
  );
  if (!response.ok) {
    return;
  }
  const jsonObj = await response.json();

  setCloudSaves(jsonObj as SavedState[]);
}
