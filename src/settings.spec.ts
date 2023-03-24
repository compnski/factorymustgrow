import { defaultSettings, settingsValidator } from "./settings"

describe("Settings", () => {
  it("defaults", async () => {
    const { value } = settingsValidator.validate({})
    expect(value).toEqual(defaultSettings)
  })
})
