import { TicksPerSecond } from "./constants";
import {
  AddProgressTracker,
  Extractor,
  Factory,
  NewExtractor,
  NewFactory,
  ProduceFromExtractor,
  ProduceFromFactory,
  RemoveProgressTracker,
  TickProgressTracker,
  UpdateBuildingRecipe,
} from "./production";
import { TestRecipeBook } from "./test_recipe_defs";
import { AddItemsToFixedBuffer } from "./test_utils";
import { EntityStack, NewEntityStack, NewRegion, Region } from "./types";

function NewTestFactory(r: string, count = 1): Factory {
  const factory = NewFactory({ subkind: "assembling-machine-1" }, count);
  UpdateBuildingRecipe(factory, r);
  return factory;
}

function NewTestExtractor(r: string, count = 1): Extractor {
  const factory = NewExtractor({ subkind: "burner-mining-drill" }, count);
  UpdateBuildingRecipe(factory, r);
  return factory;
}

function NewTestRegion(ore: EntityStack[]): Region {
  return NewRegion("start", 2, 2, 2, ore, []);
}

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

  describe("Adding", () => {
    it("Adds a first tracker", () => {
      const t = tracker(1, []);
      expect(AddProgressTracker(t, 5)).toBe(1);
      expect(t.progressTrackers.length).toBe(1);
      expect(t.progressTrackers[0]).toBe(5);
    });

    it("Adds an additional tracker", () => {
      const t = tracker(2, [1]);
      expect(AddProgressTracker(t, 2)).toBe(1);
      expect(t.progressTrackers.length).toBe(2);
      expect(t.progressTrackers[0]).toBe(1);
      expect(t.progressTrackers[1]).toBe(2);
    });

    it("Won't add trackers past the BuildingCount", () => {
      const t = tracker(2, [1, 2]);
      expect(t.progressTrackers.length).toBe(2);
      expect(AddProgressTracker(t, 3)).toBe(0);
      expect(t.progressTrackers.length).toBe(2);
    });
  });

  describe("Removing", () => {
    it("Try removing an empty tracker", () => {
      const t = tracker(2, []);
      expect(RemoveProgressTracker(t)).toBe(0);
    });

    it("Removes only tracker", () => {
      const t = tracker(2, [1]);
      expect(RemoveProgressTracker(t)).toBe(1);
      expect(t.progressTrackers.length).toBe(0);
    });

    it("Removes last tracker", () => {
      const t = tracker(3, [1, 2, 3]);
      expect(RemoveProgressTracker(t)).toBe(1);
      expect(t.progressTrackers.length).toBe(2);
      expect(t.progressTrackers[1]).toBe(2);
    });
  });

  describe("Ticks", () => {
    it("Does nothing when there are no expiring trackers", () => {
      const t = tracker(3, [1, 2, 3]);
      expect(TickProgressTracker(t, 5, 5, Infinity)).toBe(0);
      expect(t.progressTrackers.length).toBe(3);
    });

    it("Returns a count of expiring trackers and removes them", () => {
      const t = tracker(3, [1, 2, 3]);
      expect(TickProgressTracker(t, 7, 5, Infinity)).toBe(2);
      expect(t.progressTrackers.length).toBe(1);
      expect(t.progressTrackers[0]).toBe(3);
    });

    it("Only removes up to maxRemoved trackers", () => {
      const t = tracker(3, [1, 2, 3]);
      expect(TickProgressTracker(t, 7, 5, 1)).toBe(1);
      expect(t.progressTrackers.length).toBe(2);
      expect(t.progressTrackers[0]).toBe(2);
    });
  });
});
describe("Factories", () => {
  function TestFactory(
    factory: Factory,
    expected: {
      outputBuffers: EntityStack[];
      inputBuffers: EntityStack[];
    }
  ) {
    [0, 1000].forEach((tick) => {
      ProduceFromFactory(factory, tick);
    });

    for (const expectedOutput of expected.outputBuffers) {
      expect(factory.outputBuffers.Count(expectedOutput.Entity)).toBe(
        expectedOutput.Count
      );
    }

    for (const expectedInput of expected.inputBuffers) {
      expect(factory.inputBuffers.Count(expectedInput.Entity)).toBe(
        expectedInput.Count
      );
    }
  }

  it("Produces a single item", () => {
    const factory = NewTestFactory("test-item");
    AddItemsToFixedBuffer(factory.inputBuffers, 10);
    AddItemsToFixedBuffer(factory.outputBuffers, 1);

    TestFactory(factory, {
      outputBuffers: [NewEntityStack("test-item", 2)],
      inputBuffers: [
        NewEntityStack("test-ore", 8),
        NewEntityStack("test-slow-ore", 7),
      ],
    });
  });

  it("Produces three item", () => {
    const factory = NewTestFactory("test-item", 3);
    AddItemsToFixedBuffer(factory.inputBuffers, 10);

    TestFactory(factory, {
      outputBuffers: [NewEntityStack("test-item", 3)],
      inputBuffers: [
        NewEntityStack("test-ore", 4),
        NewEntityStack("test-slow-ore", 1),
      ],
    });
  });

  // it("Produces 1.5 items", () => {
  //   const factory = NewTestFactory("test-slow-item", 3);
  //   AddItemsToFixedBuffer(factory.inputBuffers, 10);

  //   TestFactory(factory, {
  //     outputBuffers: [NewEntityStack("test-item", 1.5)],

  //     inputBuffers: [
  //       NewEntityStack("test-ore", 7),
  //       NewEntityStack("test-slow-ore", 5.5),
  //     ],
  //   });
  // });

  it("Requires 1 full set of materials to start", () => {
    const factory = NewTestFactory("test-slow-item", 3);
    AddItemsToFixedBuffer(factory.inputBuffers, 2);

    TestFactory(factory, {
      outputBuffers: [NewEntityStack("test-item", 0)],
      inputBuffers: [
        NewEntityStack("test-ore", 2),
        NewEntityStack("test-slow-ore", 2),
      ],
    });
  });

  it("Won't overfill inventory", () => {
    const factory = NewTestFactory("test-item", 1);
    AddItemsToFixedBuffer(factory.inputBuffers, 10);
    AddItemsToFixedBuffer(factory.outputBuffers, Infinity);

    TestFactory(factory, {
      outputBuffers: [NewEntityStack("test-item", 50)],
      inputBuffers: [
        NewEntityStack("test-ore", 8),
        NewEntityStack("test-slow-ore", 7),
      ],
    });
  });

  it("Won't overfill inventory when outputing multiple items", () => {
    const factory = NewTestFactory("test-multi-count-item", 1);
    AddItemsToFixedBuffer(factory.inputBuffers, 10);
    AddItemsToFixedBuffer(factory.outputBuffers, 49);

    TestFactory(factory, {
      outputBuffers: [NewEntityStack("test-item", 49)],
      inputBuffers: [NewEntityStack("test-ore", 8)],
    });
  });

  it.todo("Keeps track of progress even when output is full");
});

describe("Extractors", () => {
  function TestExtractor(
    extractor: Extractor,
    region: Region,
    expected: {
      outputBuffers: EntityStack[];
      regionalOre: EntityStack[];
    }
  ) {
    for (let i = 0; i < TicksPerSecond; i++) {
      ProduceFromExtractor(extractor, region);
    }

    for (const expectedOutput of expected.outputBuffers) {
      expect(extractor.outputBuffers.Count(expectedOutput.Entity)).toBe(
        expectedOutput.Count
      );
    }

    for (const expectedOre of expected.regionalOre) {
      expect(region.Ore.Count(expectedOre.Entity)).toBe(expectedOre.Count);
    }
  }

  it("Produces a single item", () => {
    const extractor = NewTestExtractor("test-ore", 1);
    AddItemsToFixedBuffer(extractor.outputBuffers, 1);

    const region = NewTestRegion([NewEntityStack("test-ore", 10)]);

    TestExtractor(extractor, region, {
      outputBuffers: [NewEntityStack("test-ore", 2)],
      regionalOre: [NewEntityStack("test-ore", 9)],
    });
  });

  it("Produces 1.5 items", () => {
    const extractor = NewTestExtractor("test-slow-ore", 3);
    AddItemsToFixedBuffer(extractor.outputBuffers, 1);
    const region = NewTestRegion([NewEntityStack("test-ore", 10)]);

    TestExtractor(extractor, region, {
      outputBuffers: [NewEntityStack("test-ore", 2.5)],
      regionalOre: [NewEntityStack("test-ore", 8.5)],
    });
  });

  it("Produces three items", () => {
    const extractor = NewTestExtractor("test-ore", 3);
    const region = NewTestRegion([NewEntityStack("test-ore", 10)]);

    TestExtractor(extractor, region, {
      outputBuffers: [NewEntityStack("test-ore", 3)],
      regionalOre: [NewEntityStack("test-ore", 7)],
    });
  });

  it("Produces only as much ore is left", () => {
    const extractor = NewTestExtractor("test-ore", 5);
    const region = NewTestRegion([NewEntityStack("test-ore", 3)]);

    TestExtractor(extractor, region, {
      outputBuffers: [NewEntityStack("test-ore", 3)],
      regionalOre: [NewEntityStack("test-ore", 0)],
    });
  });
});
