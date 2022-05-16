import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { settings, Settings, updateSetting } from "../settings";

export function SettingsCard({
  onConfirm,
}: {
  onConfirm: (evt: SyntheticEvent, r: any) => void;
}) {
  const [displaySettings, setDisplaySettings] = useState(settings);

  useEffect(() => {
    setDisplaySettings(settings);
    localStorage.setItem("gameSettings", JSON.stringify(settings));
    console.log("wrote gameSettings", localStorage.getItem("gameSettings"));
  }, [settings]);

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
          <div>Settings</div>
        </div>
        <div className="inner-content">
          <ul>
            {Object.entries(displaySettings).map(([key, value]) => (
              <li key={key}>
                <label>
                  <input
                    type="checkbox"
                    checked={value || false}
                    onChange={(evt) => updateSetting(key, !value)}
                  />
                  {key}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
