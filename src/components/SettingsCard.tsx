import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { settings, Settings, updateSetting } from "../settings";

export function SettingsCard({
  onConfirm,
}: {
  onConfirm: (evt: SyntheticEvent, r: any) => void;
}) {
  const [displaySettings, setDisplaySettings] = useState(settings);

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
                    onChange={() => {
                      updateSetting(key, !value);
                      setDisplaySettings(settings);
                    }}
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
