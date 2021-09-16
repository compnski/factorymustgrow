import {
  Extractor,
  Factory,
  NewExtractor,
  NewFactory,
  ProduceFromExtractor,
  ProduceFromFactory,
  UpdateBuildingRecipe,
} from "./production";
import {
  EntityStack,
  FillEntityStack,
  ItemBuffer,
  NewEntityStack,
  NewRegion,
  Region,
} from "./types";
import {
  TestRecipeBook,
  TestRecipe,
  TestSlowRecipe,
  TestOreRecipe,
  TestSlowOreRecipe,
  GetTestRecipe,
} from "./test_recipe_defs";
import { TicksPerSecond } from "./constants";
import { GetTestEntity, TestEntityList } from "./test_entity_defs";
import { Inventory } from "./inventory";
import { AddItemsToFixedBuffer } from "./test_utils";

function NewTestFactory(r: string, count: number = 1): Factory {
  const factory = NewFactory({ subkind: "assembling-machine-1" }, count);
  UpdateBuildingRecipe(factory, r, GetTestEntity, GetTestRecipe);
  return factory;
}

function NewTestExtractor(r: string, count: number = 1): Extractor {
  const factory = NewExtractor({ subkind: "burner-mining-drill" }, count);
  UpdateBuildingRecipe(factory, r, GetTestEntity, GetTestRecipe);
  return factory;
}

function NewTestRegion(ore: EntityStack[]): Region {
  return NewRegion("start", 0, 0, ore, [], GetTestEntity);
}

describe("Factories", () => {
  function TestFactory(
    factory: Factory,
    expected: {
      outputBuffers: EntityStack[];
      inputBuffers: EntityStack[];
    }
  ) {
    for (var i = 0; i < TicksPerSecond; i++) {
      ProduceFromFactory(factory, TestRecipeBook.get.bind(TestRecipeBook));
    }

    for (var expectedOutput of expected.outputBuffers) {
      expect(factory.outputBuffers.Count(expectedOutput.Entity)).toBe(
        expectedOutput.Count
      );
    }

    for (var expectedInput of expected.inputBuffers) {
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

  it("Produces 1.5 items", () => {
    const factory = NewTestFactory("test-slow-item", 3);
    AddItemsToFixedBuffer(factory.inputBuffers, 10);

    TestFactory(factory, {
      outputBuffers: [NewEntityStack("test-item", 1.5)],

      inputBuffers: [
        NewEntityStack("test-ore", 7),
        NewEntityStack("test-slow-ore", 5.5),
      ],
    });
  });

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
        NewEntityStack("test-ore", 10),
        NewEntityStack("test-slow-ore", 10),
      ],
    });
  });
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
    for (var i = 0; i < TicksPerSecond; i++) {
      ProduceFromExtractor(
        extractor,
        region,
        TestRecipeBook.get.bind(TestRecipeBook)
      );
    }

    for (var expectedOutput of expected.outputBuffers) {
      expect(extractor.outputBuffers.Count(expectedOutput.Entity)).toBe(
        expectedOutput.Count
      );
    }

    for (var expectedOre of expected.regionalOre) {
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
