import Joi from "joi";

export type Settings = {
  animatedEnabled: boolean;
  debugEnabled: boolean;
  cloudSaveEnabled: boolean;
  autosaveIntervalMin: number; //0 to disable
  autosaveCount: number;
};

export const defaultSettings: Settings = {
  animatedEnabled: false,
  debugEnabled: false,
  cloudSaveEnabled: true,
  autosaveIntervalMin: 5,
  autosaveCount: 5,
};

let _settings: Settings | undefined;

export function settings(): Settings {
  if (_settings) return _settings;
  const { value, error, warning } = settingsValidator.validate(
    JSON.parse(localStorage.getItem("gameSettings") || "{}")
  );

  //  console.log(error, warning);
  if (!value || error) return defaultSettings;
  return value;
}

export function updateSetting(key: string, value: boolean | number): Settings {
  console.log(key, value);
  const s = { ...settings(), [key]: value };
  console.log(s);
  localStorage.setItem("gameSettings", JSON.stringify(s));
  console.log("wrote gameSettings", localStorage.getItem("gameSettings"));
  _settings = s;
  return s;
}

export const settingsValidator = Joi.object<Settings>({
  animatedEnabled: Joi.boolean()
    .optional()
    .default(defaultSettings.animatedEnabled),
  cloudSaveEnabled: Joi.boolean()
    .optional()
    .default(defaultSettings.cloudSaveEnabled),
  debugEnabled: Joi.boolean().optional().default(defaultSettings.debugEnabled),
  autosaveIntervalMin: Joi.number()
    .min(0)
    .optional()
    .default(defaultSettings.autosaveIntervalMin),
  autosaveCount: Joi.number()
    .min(0)
    .optional()
    .default(defaultSettings.autosaveCount),
}).default(defaultSettings);
