import {
  MouseEvent as ReactMouseEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { reallyRandomName } from "../namegen";
import {
  deleteGameFromCloudStorage,
  deleteGameFromLocalStorage,
  listSavedGamesInCloudStorage,
  listSaveGamesInLocalStorage,
  loadCloudSaveGame,
  loadSaveGame,
  SaveGameMetadata,
  saveGameToCloudStorage,
  saveGameToLocalStorage,
} from "../save_game";
import { settings, updateSetting } from "../settings";
import { sleep } from "../utils";
import "./SaveCard.scss";

export type SaveCardProps = {
  onConfirm: (
    evt: SyntheticEvent,
    saveData:
      | string
      | { saveVersion: string; cloudSaveName: string | undefined }
  ) => void;
  showSaveButton: boolean;
};

// TODO: Combine saves using gameStateHash
export const SaveCard = function SaveCard({
  onConfirm,
  showSaveButton,
}: SaveCardProps) {
  const [localSaves, setLocalSaves] = useState<
    Record<string, SaveGameMetadata>
  >({});
  const [newSaveName, setNewSaveName] = useState("");
  const [displaySettings, setDisplaySettings] = useState(settings());
  const [cloudSaveError, setCloudSaveError] = useState(false);

  useEffect(() => {
    setLocalSaves(listSaveGamesInLocalStorage);
  }, []);

  const [cloudSaveName, setCloudSaveName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("cloudSaveName") || "";
      const savedValue = (JSON.parse(saved) as string) || "";
      return savedValue == "" ? reallyRandomName() : savedValue;
    } catch (e) {
      return reallyRandomName();
    }
  });

  useEffect(() => {
    localStorage.setItem("cloudSaveName", JSON.stringify(cloudSaveName));
  }, [cloudSaveName]);

  const [cloudSaves, setCloudSaves] = useState<SaveGameMetadata[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // TODO: Debounce
    void listCloudSave();
  }, [cloudSaveName, displaySettings]);

  async function listCloudSave() {
    try {
      const saves = await listSavedGamesInCloudStorage(cloudSaveName);
      if (saves) setCloudSaves(saves);
      setCloudSaveError(false);
    } catch (e) {
      setCloudSaveError(true);
    }
  }

  async function saveGameClick(evt: SyntheticEvent, saveVersion: string) {
    //saveGame(name, cloudSaveName);
    // TODO: Now that save is async, need to poll for saved gaes?
    setSaved(true);
    onConfirm(evt, { saveVersion, cloudSaveName });
    await sleep(500);
  }

  function loadLocalSave(
    evt: ReactMouseEvent<HTMLLIElement, MouseEvent>,
    sgmKey: string
  ) {
    const gameData = loadSaveGame(sgmKey);
    if (gameData) onConfirm(evt, gameData);
  }

  async function loadCloudSave(
    evt: ReactMouseEvent<HTMLLIElement, MouseEvent>,
    saveName: string
  ) {
    try {
      const gameData = await loadCloudSaveGame(cloudSaveName, saveName);
      if (gameData) onConfirm(evt, gameData);
    } catch (e) {
      console.error(e);
      alert("Failed to load cloud save!");
    }
  }

  async function deleteCloudSave(evt: SyntheticEvent, saveName: string) {
    evt.stopPropagation();
    await deleteGameFromCloudStorage(cloudSaveName, saveName);
    setDeleteIdx(undefined);
    void listCloudSave();
  }

  function deleteLocalSave(evt: SyntheticEvent, sgmKey: string) {
    evt.stopPropagation();
    deleteGameFromLocalStorage(sgmKey);
    setDeleteIdx(undefined);
    setLocalSaves(listSaveGamesInLocalStorage);
  }

  const saveGameArea = showSaveButton ? (
    <div className="m-4">
      <label>
        <input
          className="text-black p-1 pl-2"
          type="text"
          value={newSaveName}
          onChange={(evt) => setNewSaveName(evt.target.value)}
          placeholder="Save Game Name"
        />
      </label>
      <button
        className="ml-2 w-36 border-2 border-grey-300 drop-shadow-md"
        onClick={(evt) => void saveGameClick(evt, newSaveName)}
      >
        Create Save Game
      </button>
    </div>
  ) : undefined;

  const buttonClasses =
    "flex backdrop-brightness-50 shadow shadow-orange-800 w-96 p-2 hover:ring-sky-700 hover:ring-2 focus:ring-sky-700 focus:ring-2";

  const [deleteIdxKey, setDeleteIdx] = useState<string | undefined>();

  const cloudSaveNameEl = settings().cloudSaveEnabled ? (
    <div className="mt-4">
      Your 'Cloud Save Name' is the key to your saves.
      <br />
      <label>
        <span className="text-gray-400">Cloud Save Name </span>
        <input
          type="text"
          className="text-gray-800 pl-2"
          value={cloudSaveName}
          onChange={(evt) => setCloudSaveName(evt.target.value)}
        />
      </label>
    </div>
  ) : undefined;

  const saveEl = (
    <>
      <div className="help-text">
        <div>Save Your Game</div>
        <div className="text-sm h-10">
          {displaySettings.cloudSaveEnabled ? (
            cloudSaveError ? (
              <span>
                Saves only to local storage.
                <span
                  style={{ fontSize: 16 }}
                  className="material-icons text-red-400 align-top ml-2 mr-1"
                >
                  cloud_off
                </span>
                Cloud save unreachable.
              </span>
            ) : (
              <span>Saves locally and to the cloud.</span>
            )
          ) : (
            <span>Saves only to local storage. </span>
          )}
          <div>
            <input
              className="pointer-events-auto cursor-pointer"
              type="checkbox"
              onChange={() => {
                setDisplaySettings(
                  updateSetting(
                    "cloudSaveEnabled",
                    !displaySettings.cloudSaveEnabled
                  )
                );
              }}
              checked={settings().cloudSaveEnabled}
            />{" "}
            Use Cloud Saves
          </div>
        </div>
      </div>
      <div className="inner-content">
        {saveGameArea}
        <ul className="stateList select-none cursor-pointer align-middle leading-none">
          {Object.entries(localSaves).map(([key, sgm], idx) => {
            const idxKey = `local-${idx}`;
            return (
              <li key={idxKey} onClick={(evt) => loadLocalSave(evt, key)}>
                <div className={buttonClasses + " group"}>
                  <span>
                    {sgm.saveVersion} - {new Date(sgm.createdAtMs).toString()}
                  </span>
                  <span
                    onClick={(evt) => {
                      setDeleteIdx(idxKey);
                      evt.stopPropagation();
                    }}
                    className="material-icons group-hover:visible invisible"
                  >
                    delete
                  </span>

                  {deleteIdxKey == idxKey && (
                    <span onClick={(evt) => deleteLocalSave(evt, key)}>
                      Delete?
                    </span>
                  )}
                </div>
              </li>
            );
          })}
          {cloudSaves?.map((stateInfo, idx) => {
            const idxKey = `cloud-${idx}`;
            return (
              <li
                key={idxKey}
                onClick={(evt) =>
                  void loadCloudSave(evt, stateInfo.saveVersion)
                }
              >
                <div className={buttonClasses + " group"}>
                  <span>
                    <span className="material-icons">cloud</span>
                    {stateInfo.saveVersion} -{" "}
                    {new Date(stateInfo.createdAtMs).toString()}{" "}
                  </span>
                  <span
                    onClick={(evt) => {
                      setDeleteIdx(idxKey);
                      evt.stopPropagation();
                    }}
                    className="material-icons group-hover:visible invisible"
                  >
                    delete
                  </span>
                  {deleteIdxKey == idxKey && (
                    <span
                      onClick={(evt) =>
                        deleteCloudSave(evt, stateInfo.saveVersion)
                      }
                    >
                      Delete?
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        {cloudSaveNameEl}
      </div>
    </>
  );

  return (
    <div className="modal save-card">
      <div className="inner-frame">
        <span
          className="material-icons close-icon clickable"
          onClick={(evt) => onConfirm(evt, "")}
        >
          close
        </span>

        {saved ? (
          <div className="text-3xl text-white text-center">Saved!</div>
        ) : (
          saveEl
        )}
      </div>
    </div>
  );
};
