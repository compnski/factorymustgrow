export type Settings = {
  animatedEnabled: boolean;
  debugEnabled: boolean;
  cloudSaveEnabled: boolean;
};

export const defaultSettings: Settings = {
  animatedEnabled: false,
  debugEnabled: false,
  cloudSaveEnabled: true,
};

export let settings = validateGameSettings(
  JSON.parse(localStorage.getItem("gameSettings") || "{}")
);

function validateGameSettings(arg0: unknown) {
  const maybeSettings = arg0 as Settings;
  Object.entries(defaultSettings).forEach(([k, value]) => {
    const key = k as keyof Settings;
    if (typeof maybeSettings[key] != typeof value)
      maybeSettings[key] = defaultSettings[key];
  });
  return maybeSettings;
}

export function updateSetting(key: string, value: boolean): void {
  console.log(key, value);
  settings = { ...settings, [key]: value };
  localStorage.setItem("gameSettings", JSON.stringify(settings));
  console.log("wrote gameSettings", localStorage.getItem("gameSettings"));
}
