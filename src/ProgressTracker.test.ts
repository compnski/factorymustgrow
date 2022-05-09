import {
  AddProgressTrackers,
  RemoveProgressTracker,
  TickProgressTracker,
} from "./AddProgressTracker";
import { BuildingAddress } from "./state/address";

describe("Progress Trackers", () => {
  function tracker(
    count = 1,
    trackers: number[] = []
  ): {
    progressTrackers: number[];
    BuildingCount: number;
  } {
    return { progressTrackers: trackers, BuildingCount: count };
  }

  const vmDispatch = jest.fn();
  const address: BuildingAddress = { regionId: "testRegion", buildingIdx: 0 };

  const expectTracker = (count: number, currentTick = 0) => {
    expect(vmDispatch).toHaveBeenCalledWith({
      address: { regionId: "testRegion", buildingIdx: 0 },
      count,
      currentTick,
      kind: "AddProgressTrackers",
    });
  };

  describe("Adding", () => {
    describe("just one", () => {
      it("Adds a first tracker", () => {
        const t = tracker(1, []);
        expect(AddProgressTrackers(vmDispatch, address, t, 5, 1)).toBe(1);
        expectTracker(1, 5);
      });

      it("Adds an additional tracker", () => {
        const t = tracker(2, [1]);
        expect(AddProgressTrackers(vmDispatch, address, t, 2, 1)).toBe(1);
        expectTracker(1, 2);
      });

      it("Won't add trackers past the BuildingCount", () => {
        const t = tracker(2, [1, 2]);
        expect(AddProgressTrackers(vmDispatch, address, t, 3, 1)).toBe(0);
        expect(vmDispatch).not.toHaveBeenCalled();
      });
    });

    describe("Multiple", () => {
      it("Adds a first tracker", () => {
        const t = tracker(5, []);
        expect(AddProgressTrackers(vmDispatch, address, t, 5, 2)).toBe(2);
        expectTracker(2, 5);
      });

      it("Adds an additional tracker", () => {
        const t = tracker(5, [1]);
        expect(AddProgressTrackers(vmDispatch, address, t, 2, 2)).toBe(2);
        expectTracker(2, 2);
      });

      it("Won't add trackers past the BuildingCount, but does some", () => {
        const t = tracker(4, [1, 2]);
        expect(AddProgressTrackers(vmDispatch, address, t, 3, 3)).toBe(2);
        expectTracker(2, 3);
      });

      it("Won't add trackers past the BuildingCount", () => {
        const t = tracker(2, [1, 2]);
        expect(AddProgressTrackers(vmDispatch, address, t, 3, 3)).toBe(0);
        expect(vmDispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe("Removing", () => {
    it("Try removing an empty tracker", () => {
      const t = tracker(2, []);
      expect(RemoveProgressTracker(vmDispatch, address, t)).toBe(0);
      expect(vmDispatch).not.toHaveBeenCalled();
    });

    it("Removes only tracker", () => {
      const t = tracker(2, [1]);
      expect(RemoveProgressTracker(vmDispatch, address, t)).toBe(1);
      expectTracker(-1, 0);
    });
  });

  describe("Ticks", () => {
    it("Does nothing when there are no expiring trackers", () => {
      const t = tracker(3, [1, 2, 3]);
      expect(TickProgressTracker(vmDispatch, address, t, 5, 5, Infinity)).toBe(
        0
      );
      expect(vmDispatch).not.toHaveBeenCalled();
    });

    it("Returns a count of expiring trackers and removes them", () => {
      const t = tracker(3, [1, 2, 3]);
      expect(TickProgressTracker(vmDispatch, address, t, 7, 5, Infinity)).toBe(
        2
      );
      expectTracker(-2, 7);
    });

    it("Only removes up to maxRemoved trackers", () => {
      const t = tracker(3, [1, 2, 3]);
      expect(TickProgressTracker(vmDispatch, address, t, 7, 5, 1)).toBe(1);
      expectTracker(-1, 7);
    });
  });
});
