import {
  Extractor,
  Factory,
  NewExtractor,
  NewFactory,
  ProduceFromExtractor,
  ProduceFromFactory,
} from "./production";
import {
  EntityStack,
  FillEntityStack,
  NewEntityStack,
  NewRegion,
  Recipe,
  Region,
} from "./types";
import {
  TestRecipeBook,
  TestRecipe,
  TestSlowRecipe,
  TestOreRecipe,
  TestSlowOreRecipe,
} from "./test_defs";
import { TicksPerSecond } from "./constants";

describe("Factories", () => {
  function TestFactory(
    factory: Factory,
    expected: {
      produced: number;
      outputCount: number;
      inputBuffers: EntityStack[];
    }
  ) {
    for (var i = 0; i < TicksPerSecond; i++) {
      ProduceFromFactory(factory, TestRecipeBook.get.bind(TestRecipeBook));
    }
    expect(factory.outputBuffer.Count).toBe(expected.outputCount);
    for (var expectedInput of expected.inputBuffers) {
      expect(factory.inputBuffers.get(expectedInput.Entity)?.Count).toBe(
        expectedInput.Count
      );
    }
  }

  it("Produces a single item", () => {
    const factory = NewFactory(TestRecipe, 1);
    factory.inputBuffers.forEach((input) => FillEntityStack(input, 10));
    factory.outputBuffer.Count = 1;

    TestFactory(factory, {
      produced: 1,
      outputCount: 2,
      inputBuffers: [
        NewEntityStack("test-ore", 8),
        NewEntityStack("copper-ore", 7),
      ],
    });
  });

  it("Produces three item", () => {
    const factory = NewFactory(TestRecipe, 3);
    factory.inputBuffers.forEach((input) => FillEntityStack(input, 10));

    TestFactory(factory, {
      produced: 3,
      outputCount: 3,
      inputBuffers: [
        NewEntityStack("test-ore", 4),
        NewEntityStack("copper-ore", 1),
      ],
    });
  });

  it("Produces 1.5 items", () => {
    const factory = NewFactory(TestSlowRecipe, 3);
    factory.inputBuffers.forEach((input) => FillEntityStack(input, 10));

    TestFactory(factory, {
      produced: 1.5,
      outputCount: 1.5,
      inputBuffers: [
        NewEntityStack("test-ore", 7),
        NewEntityStack("copper-ore", 5.5),
      ],
    });
  });

  it("Requires 1 full set of materials to start", () => {
    const factory = NewFactory(TestSlowRecipe, 3);
    factory.inputBuffers.forEach((input) => FillEntityStack(input, 2));

    TestFactory(factory, {
      produced: 0,
      outputCount: 0,
      inputBuffers: [
        NewEntityStack("test-ore", 2),
        NewEntityStack("copper-ore", 2),
      ],
    });
  });

  it("Won't overfill inventory", () => {
    const factory = NewFactory(TestRecipe, 1);
    factory.inputBuffers.forEach((input) => FillEntityStack(input, 10));
    factory.outputBuffer.Count = factory.outputBuffer.MaxCount || 0;

    TestFactory(factory, {
      produced: 0,
      outputCount: 50,
      inputBuffers: [
        NewEntityStack("test-ore", 10),
        NewEntityStack("copper-ore", 10),
      ],
    });
  });
});

describe("Extractors", () => {
  function TestExtractor(
    extractor: Extractor,
    region: Region,
    expected: {
      produced: number;
      outputCount: number;
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

    expect(extractor.outputBuffer.Count).toBe(expected.outputCount);
    for (var expectedOre of expected.regionalOre) {
      expect(region.Ore.get(expectedOre.Entity)?.Count).toBe(expectedOre.Count);
    }
  }

  it("Produces a single item", () => {
    const extractor = NewExtractor(TestOreRecipe, 1);
    extractor.outputBuffer.Count = 1;
    const region = NewRegion(0, [NewEntityStack("test-ore", 10)]);

    TestExtractor(extractor, region, {
      produced: 1,
      outputCount: 2,
      regionalOre: [NewEntityStack("test-ore", 9)],
    });
  });

  it("Produces 1.5 items", () => {
    const extractor = NewExtractor(TestSlowOreRecipe, 3);
    extractor.outputBuffer.Count = 1;
    const region = NewRegion(0, [NewEntityStack("test-ore", 10)]);

    TestExtractor(extractor, region, {
      produced: 1.5,
      outputCount: 2.5,
      regionalOre: [NewEntityStack("test-ore", 8.5)],
    });
  });

  it("Produces three items", () => {
    const extractor = NewExtractor(TestOreRecipe, 3);
    const region = NewRegion(0, [NewEntityStack("test-ore", 10)]);

    TestExtractor(extractor, region, {
      produced: 3,
      outputCount: 3,
      regionalOre: [NewEntityStack("test-ore", 7)],
    });
  });

  it("Produces only as much ore is left", () => {
    const extractor = NewExtractor(TestOreRecipe, 5);
    const region = NewRegion(0, [NewEntityStack("test-ore", 3)]);

    TestExtractor(extractor, region, {
      produced: 3,
      outputCount: 3,
      regionalOre: [NewEntityStack("test-ore", 0)],
    });
  });
});
