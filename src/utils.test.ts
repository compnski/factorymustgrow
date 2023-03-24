import { swap } from "./utils"

describe("swap", () => {
  it("Swaps l=2", () => expect(swap([1, 2], 0, 1)).toEqual([2, 1]))
  it("Swaps l=3", () => expect(swap([1, 2, 3], 0, 2)).toEqual([3, 2, 1]))
  it("Swaps l=4, inner", () => expect(swap([1, 2, 3, 4], 1, 2)).toEqual([1, 3, 2, 4]))
  it("Swaps l=4, outer", () => expect(swap([1, 2, 3, 4], 0, 3)).toEqual([4, 2, 3, 1]))
})
