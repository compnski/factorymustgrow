import { NewExtractor, NewFactory } from "./production";
import { MainBus, EntityStack, NewEntityStack } from "./types";

import {
  TestRecipe,
  TestOreRecipe,
  TestItemConsumerRecipe,
} from "./test_recipe_defs";
import { PushPullFromMainBus, PushToOtherProducer } from "./movement";

describe("PushToOtherProducer", () => {
  function TestMovement(
    from: any,
    to: any,
    maxMoved: number,
    expected: {
      outputBuffers: EntityStack[];
      inputBuffers: EntityStack[];
    }
  ) {
    PushToOtherProducer(from, to, maxMoved);

    for (var expectedOutput of expected.outputBuffers) {
      expect(from.outputBuffers.get(expectedOutput.Entity)?.Count).toBe(
        expectedOutput.Count
      );
    }

    for (var expectedInput of expected.inputBuffers) {
      expect(to.inputBuffers.get(expectedInput.Entity)?.Count).toBe(
        expectedInput.Count
      );
    }
  }

  it("Moves between Extractor and Factory", () => {
    const extractor = NewExtractor(TestOreRecipe, 1),
      factory = NewFactory(TestRecipe, 1);
    extractor.outputBuffers.get("test-ore")!.Count = 5;

    TestMovement(extractor, factory, 3, {
      outputBuffers: [NewEntityStack("test-ore", 2)],
      inputBuffers: [
        NewEntityStack("test-ore", 3),
        NewEntityStack("copper-ore", 0),
      ],
    });
  });

  it("Moves between Factory and Factory", () => {
    const fromFactory = NewFactory(TestRecipe, 1),
      toFactory = NewFactory(TestItemConsumerRecipe, 1);
    fromFactory.outputBuffers.get("test-item")!.Count = 5;

    TestMovement(fromFactory, toFactory, 3, {
      outputBuffers: [NewEntityStack("test-item", 2)],
      inputBuffers: [NewEntityStack("test-item", 3)],
    });
  });

  it("Moves uncapped amounts between Factory and Factory", () => {
    const fromFactory = NewFactory(TestRecipe, 1),
      toFactory = NewFactory(TestItemConsumerRecipe, 1);
    fromFactory.outputBuffers.get("test-item")!.Count = 5;

    TestMovement(fromFactory, toFactory, Infinity, {
      outputBuffers: [NewEntityStack("test-item", 0)],
      inputBuffers: [NewEntityStack("test-item", 5)],
    });
  });

  it("Won't overflow target input", () => {
    const fromFactory = NewFactory(TestRecipe, 1),
      toFactory = NewFactory(TestItemConsumerRecipe, 1);
    fromFactory.outputBuffers.get("test-item")!.Count = 55;

    TestMovement(fromFactory, toFactory, Infinity, {
      outputBuffers: [NewEntityStack("test-item", 5)],
      inputBuffers: [NewEntityStack("test-item", 50)],
    });
  });

  it.todo("Errors if no relevant input buffer ");
  it.todo("Only pushes up to #producer count");
});

describe("PushPullFromMainBus", () => {
  function TestMovement(
    producer: any,
    bus: MainBus,
    expected: {
      inputBuffers: EntityStack[];
      outputBuffers: EntityStack[];
      busCounts: Map<number, number>;
    }
  ) {
    PushPullFromMainBus(producer, bus);

    for (var expectedOutput of expected.outputBuffers) {
      expect(producer.outputBuffers.get(expectedOutput.Entity)?.Count).toBe(
        expectedOutput.Count
      );
    }

    for (var [beltId, count] of expected.busCounts) {
      expect(bus.lanes.get(beltId)?.Count).toBe(count);
    }

    for (var expectedInput of expected.inputBuffers) {
      expect(producer.inputBuffers.get(expectedInput.Entity)?.Count).toBe(
        expectedInput.Count
      );
    }
  }

  it.todo("Only pushes up to #producer count");

  it("Moves between Factory and MainBus", () => {
    const mb = new MainBus();
    mb.AddLane("test-item", 0);
    mb.AddLane("test-ore", 5);
    mb.AddLane("copper-ore", 10);
    const factory = NewFactory(TestRecipe, 1);

    factory.outputBuffers.get("test-item")!.Count = 5;

    factory.outputStatus.beltConnections = [
      {
        direction: "TO_BUS",
        beltId: 1,
      },
      {
        direction: "FROM_BUS",
        beltId: 2,
      },
      {
        direction: "FROM_BUS",
        beltId: 3,
      },
    ];
    TestMovement(factory, mb, {
      inputBuffers: [
        NewEntityStack("test-ore", 1),
        NewEntityStack("copper-ore", 1),
      ],
      busCounts: new Map([
        [1, 1],
        [2, 4],
        [3, 9],
      ]),
      outputBuffers: [NewEntityStack("test-item", 4)],
    });
  });
});

it.todo("Moves to above neighbor");
it.todo("Moves to below neighbor");
it.todo("Moves to both neighbors");
