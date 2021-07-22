import { NewExtractor, NewFactory } from "./production";
import { MainBus, EntityStack, NewEntityStack } from "./types";

import { TestRecipe, TestOreRecipe, TestItemConsumerRecipe } from "./test_defs";
import { PushPullFromMainBus, PushToOtherProducer } from "./movement";

describe("PushToOtherProducer", () => {
  function TestMovement(
    from: any,
    to: any,
    maxMoved: number,
    expected: {
      moved: number;
      outputCount: number;
      inputBuffers: EntityStack[];
    }
  ) {
    const moved = PushToOtherProducer(from, to, maxMoved);
    expect(moved).toBe(expected.moved);
    expect(from.outputBuffer.Count).toBe(expected.outputCount);
    for (var expectedInput of expected.inputBuffers) {
      expect(to.inputBuffers.get(expectedInput.Entity)?.Count).toBe(
        expectedInput.Count
      );
    }
  }

  it("Moves between Extractor and Factory", () => {
    const extractor = NewExtractor(TestOreRecipe, 1),
      factory = NewFactory(TestRecipe, 1);
    extractor.outputBuffer.Count = 5;

    TestMovement(extractor, factory, 3, {
      moved: 3,
      outputCount: 2,
      inputBuffers: [
        NewEntityStack("test-ore", 3),
        NewEntityStack("copper-ore", 0),
      ],
    });
  });

  it("Moves between Factory and Factory", () => {
    const fromFactory = NewFactory(TestRecipe, 1),
      toFactory = NewFactory(TestItemConsumerRecipe, 1);
    fromFactory.outputBuffer.Count = 5;

    TestMovement(fromFactory, toFactory, 3, {
      moved: 3,
      outputCount: 2,
      inputBuffers: [NewEntityStack("test-item", 3)],
    });
  });

  it("Moves uncapped amounts between Factory and Factory", () => {
    const fromFactory = NewFactory(TestRecipe, 1),
      toFactory = NewFactory(TestItemConsumerRecipe, 1);
    fromFactory.outputBuffer.Count = 5;

    TestMovement(fromFactory, toFactory, Infinity, {
      moved: 5,
      outputCount: 0,
      inputBuffers: [NewEntityStack("test-item", 5)],
    });
  });

  it("Won't overflow target input", () => {
    const fromFactory = NewFactory(TestRecipe, 1),
      toFactory = NewFactory(TestItemConsumerRecipe, 1);
    fromFactory.outputBuffer.Count = 55;

    TestMovement(fromFactory, toFactory, Infinity, {
      moved: 50,
      outputCount: 5,
      inputBuffers: [NewEntityStack("test-item", 50)],
    });
  });

  it.todo("Errors if no relevant input buffer ");
});

describe("PushPullFromMainBus", () => {
  function TestMovement(
    producer: any,
    bus: MainBus,
    expected: {
      inputBuffers: EntityStack[];
      outputBufferCount: number;
      busCounts: Map<number, number>;
    }
  ) {
    PushPullFromMainBus(producer, bus);

    expect(producer.outputBuffer.Count).toBe(expected.outputBufferCount);

    for (var [beltId, count] of expected.busCounts) {
      expect(bus.lanes.get(beltId)?.Count).toBe(count);
    }
    for (var expectedInput of expected.inputBuffers) {
      expect(producer.inputBuffers.get(expectedInput.Entity)?.Count).toBe(
        expectedInput.Count
      );
    }
  }

  it("Moves between Factory and MainBus", () => {
    const mb = new MainBus();
    mb.AddLane("test-item", 0);
    mb.AddLane("test-ore", 5);
    mb.AddLane("copper-ore", 10);
    const factory = NewFactory(TestRecipe, 1);
    factory.outputBuffer.Count = 5;
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
        NewEntityStack("test-ore", 5),
        NewEntityStack("copper-ore", 10),
      ],
      busCounts: new Map([
        [1, 5],
        [2, 0],
        [3, 0],
      ]),
      outputBufferCount: 0,
    });
  });
});

it.todo("Moves to above neighbor");
it.todo("Moves to below neighbor");
it.todo("Moves to both neighbors");
