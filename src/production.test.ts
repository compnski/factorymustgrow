import {
  Extractor,
  Factory,
  NewExtractorForRecipe,
  NewFactoryForRecipe,
  ProduceFromExtractor,
  ProduceFromFactory,
} from "./production";
import { AddItemsToReadonlyFixedBuffer as AddItemsToFixedBuffer } from "./test_utils";
import { EntityStack, NewEntityStack, NewRegion, Region } from "./types";

function NewTestFactory(r: string, count = 1): Factory {
  const factory = NewFactoryForRecipe(
    { subkind: "assembling-machine-1" },
    r,
    count
  );
  return factory;
}

function NewTestExtractor(r: string, count = 1): Extractor {
  const factory = NewExtractorForRecipe(
    { subkind: "burner-mining-drill" },
    r,
    count
  );
  return factory;
}

function NewTestRegion(ore: EntityStack[]): Region {
  return NewRegion("start", 2, 2, 2, ore, []);
}
describe("Factories", () => {
  function TestFactory(
    factory: Factory,
    expected: {
      outputBuffers: EntityStack[];
      inputBuffers: EntityStack[];
      productionCount: number;
      outputCount?: number;
    }
  ) {
    const vmDispatch = jest.fn();
    //vmDispatch.mockImplementation(console.log);
    const buildingAddress = { regionId: "testRegion", buildingIdx: 0 };

    ProduceFromFactory(factory, vmDispatch, buildingAddress, 0);

    for (const expectedInput of expected.inputBuffers) {
      const count = -expected.inputBuffers[0]?.Count;

      if (count) {
        expect(vmDispatch).toHaveBeenCalledWith({
          address: { regionId: "testRegion", buildingIdx: 0, buffer: "input" },
          count: expectedInput.Count,
          entity: expectedInput.Entity,
          kind: "AddItemCount",
        });
      }
    }
    if (expected.productionCount)
      expect(vmDispatch).toHaveBeenCalledWith({
        address: { regionId: "testRegion", buildingIdx: 0 },
        count: expected.productionCount,
        currentTick: 0,
        kind: "AddProgressTrackers",
      });
    else expect(vmDispatch).not.toHaveBeenCalled();

    factory.progressTrackers = new Array(expected.productionCount).fill(0);

    ProduceFromFactory(factory, vmDispatch, buildingAddress, 1000);

    if (expected.outputCount)
      expect(vmDispatch).toHaveBeenCalledWith({
        address: { regionId: "testRegion", buildingIdx: 0 },
        count: -expected.outputCount,
        currentTick: 1000,
        kind: "AddProgressTrackers",
      });
    // TODO: Matcher
    //else expect(vmDispatch).not.toHaveBeenCalledWith();

    for (const expectedOutput of expected.outputBuffers) {
      expect(vmDispatch).toHaveBeenCalledWith({
        address: { regionId: "testRegion", buildingIdx: 0, buffer: "output" },
        count: expectedOutput.Count,
        entity: expectedOutput.Entity,
        kind: "AddItemCount",
      });
    }
  }

  it("Produces a single item", () => {
    const factory = NewTestFactory("test-item");
    factory.inputBuffers = AddItemsToFixedBuffer(factory.inputBuffers, 10);
    factory.outputBuffers = AddItemsToFixedBuffer(factory.outputBuffers, 1);

    TestFactory(factory, {
      productionCount: 1,
      outputCount: 1,
      outputBuffers: [NewEntityStack("test-item", 1)],
      inputBuffers: [
        NewEntityStack("test-ore", -2),
        NewEntityStack("test-slow-ore", -3),
      ],
    });
  });

  it("Produces three item", () => {
    const factory = NewTestFactory("test-item", 3);
    factory.inputBuffers = AddItemsToFixedBuffer(factory.inputBuffers, 10);

    TestFactory(factory, {
      productionCount: 3,
      outputCount: 3,
      outputBuffers: [NewEntityStack("test-item", 3)],
      inputBuffers: [
        NewEntityStack("test-ore", -6),
        NewEntityStack("test-slow-ore", -9),
      ],
    });
  });

  it("Requires 1 full set of materials to start", () => {
    const factory = NewTestFactory("test-slow-item", 3);
    factory.inputBuffers = AddItemsToFixedBuffer(factory.inputBuffers, 2);

    TestFactory(factory, {
      productionCount: 0,
      outputCount: 0,
      outputBuffers: [],
      inputBuffers: [],
    });
  });

  it("Won't overfill inventory", () => {
    const factory = NewTestFactory("test-item", 1);
    factory.inputBuffers = AddItemsToFixedBuffer(factory.inputBuffers, 10);
    factory.outputBuffers = AddItemsToFixedBuffer(factory.outputBuffers, 50);

    TestFactory(factory, {
      productionCount: 1,
      outputCount: 0,
      outputBuffers: [],
      inputBuffers: [
        NewEntityStack("test-ore", -2),
        NewEntityStack("test-slow-ore", -3),
      ],
    });
  });

  it("Won't overfill inventory but will produce some", () => {
    const factory = NewTestFactory("test-item", 3);
    factory.inputBuffers = AddItemsToFixedBuffer(factory.inputBuffers, 10);
    factory.outputBuffers = AddItemsToFixedBuffer(factory.outputBuffers, 48);

    TestFactory(factory, {
      productionCount: 3,
      outputCount: 2,
      outputBuffers: [NewEntityStack("test-item", 2)],
      inputBuffers: [
        NewEntityStack("test-ore", -6),
        NewEntityStack("test-slow-ore", -9),
      ],
    });
  });

  it("can produce multiple items", () => {
    const factory = NewTestFactory("test-multi-count-item", 1);
    factory.inputBuffers = AddItemsToFixedBuffer(factory.inputBuffers, 10);
    factory.outputBuffers = AddItemsToFixedBuffer(factory.outputBuffers, 0);

    TestFactory(factory, {
      productionCount: 1,
      outputCount: 1,
      outputBuffers: [NewEntityStack("test-item", 2)],
      inputBuffers: [NewEntityStack("test-ore", -2)],
    });
  });

  it("Won't overfill inventory when outputing multiple items", () => {
    const factory = NewTestFactory("test-multi-count-item", 1);
    factory.inputBuffers = AddItemsToFixedBuffer(factory.inputBuffers, 10);
    factory.outputBuffers = AddItemsToFixedBuffer(factory.outputBuffers, 49);

    TestFactory(factory, {
      productionCount: 1,
      outputCount: 0,
      outputBuffers: [],
      inputBuffers: [NewEntityStack("test-ore", -2)],
    });
  });

  it.todo("Keeps track of progress even when output is full");
});

describe("Extractors", () => {
  function TestExtractor(
    extractor: Extractor,
    region: Region,
    expected: {
      outputCount: number;
      productionCount: number;
      outputBuffers: EntityStack[];
      regionalOre: EntityStack[];
    }
  ) {
    const vmDispatch = jest.fn();
    //vmDispatch.mockImplementation(console.log);
    const address = { regionId: "testRegion", buildingIdx: 0 };

    ProduceFromExtractor(extractor, region, vmDispatch, address, 0);
    if (expected.productionCount) {
      expect(vmDispatch).toHaveBeenCalledWith({
        address: { regionId: "testRegion", buildingIdx: 0 },
        count: expected.productionCount,
        currentTick: 0,
        kind: "AddProgressTrackers",
      });

      for (const expectedOre of expected.regionalOre) {
        expect(vmDispatch).toHaveBeenCalledWith({
          address: {
            regionId: "testRegion",
            buffer: "ore",
          },
          count: expectedOre.Count,
          entity: expectedOre.Entity,
          kind: "AddItemCount",
        });
      }
    } else expect(vmDispatch).not.toHaveBeenCalled();

    extractor.progressTrackers = new Array(expected.productionCount).fill(0);

    ProduceFromExtractor(extractor, region, vmDispatch, address, 1000);

    if (expected.outputCount)
      expect(vmDispatch).toHaveBeenCalledWith({
        address: { regionId: "testRegion", buildingIdx: 0 },
        count: -expected.outputCount,
        currentTick: 1000,
        kind: "AddProgressTrackers",
      });

    for (const expectedOutput of expected.outputBuffers) {
      expect(vmDispatch).toHaveBeenCalledWith({
        address: { regionId: "testRegion", buildingIdx: 0, buffer: "output" },
        count: expectedOutput.Count,
        entity: expectedOutput.Entity,
        kind: "AddItemCount",
      });
    }
  }

  it("Produces a single item", () => {
    const extractor = NewTestExtractor("test-ore", 1);
    extractor.outputBuffers = AddItemsToFixedBuffer(extractor.outputBuffers, 1);

    const region = NewTestRegion([NewEntityStack("test-ore", 10)]);

    TestExtractor(extractor, region, {
      productionCount: 1,
      outputCount: 1,
      outputBuffers: [NewEntityStack("test-ore", 1)],
      regionalOre: [NewEntityStack("test-ore", -1)],
    });
  });

  it("Produces three items", () => {
    const extractor = NewTestExtractor("test-ore", 3);
    const region = NewTestRegion([NewEntityStack("test-ore", 10)]);

    TestExtractor(extractor, region, {
      productionCount: 3,
      outputCount: 3,
      outputBuffers: [NewEntityStack("test-ore", 3)],
      regionalOre: [NewEntityStack("test-ore", -3)],
    });
  });

  it("Produces only as much ore is left", () => {
    const extractor = NewTestExtractor("test-ore", 5);
    const region = NewTestRegion([NewEntityStack("test-ore", 3)]);

    TestExtractor(extractor, region, {
      productionCount: 3,
      outputCount: 3,
      outputBuffers: [NewEntityStack("test-ore", 3)],
      regionalOre: [NewEntityStack("test-ore", -3)],
    });
  });

  it("Won't overfill inventory", () => {
    const extractor = NewTestExtractor("test-ore", 5);
    const region = NewTestRegion([NewEntityStack("test-ore", 3)]);
    extractor.outputBuffers = AddItemsToFixedBuffer(
      extractor.outputBuffers,
      48
    );

    TestExtractor(extractor, region, {
      productionCount: 3,
      outputCount: 2,
      outputBuffers: [NewEntityStack("test-ore", 2)],
      regionalOre: [NewEntityStack("test-ore", -3)],
    });
  });
});
