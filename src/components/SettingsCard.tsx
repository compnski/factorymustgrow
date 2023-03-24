import { SyntheticEvent, useState } from "react"
import { settings, updateSetting } from "../settings"

export function SettingsCard({ onConfirm }: { onConfirm: (evt: SyntheticEvent, r: unknown) => void }) {
  const [displaySettings, setDisplaySettings] = useState(settings())

  return (
    <div className="modal save-card">
      <div className="inner-frame">
        <span className="material-icons close-icon clickable" onClick={(evt) => onConfirm(evt, "")}>
          close
        </span>
        <div className="help-text">
          <div>Settings</div>
        </div>
        <div className="inner-content">
          <ul>
            {Object.entries(displaySettings).map(([key, value]) => (
              <li key={key} className="my-2">
                <label>
                  {typeof value == "boolean" ? (
                    <input
                      type="checkbox"
                      checked={value || false}
                      onChange={() => {
                        setDisplaySettings(updateSetting(key, !value))
                      }}
                    />
                  ) : (
                    <input
                      className="text-black p-1"
                      type="input"
                      value={value}
                      onChange={(evt) => {
                        setDisplaySettings(updateSetting(key, parseInt(evt.target.value)))
                      }}
                    />
                  )}
                  <span className="ml-2">{key}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
