import {
  Extractor,
  Factory,
  NewExtractor,
  NewFactory,
  UpdateBuildingRecipe,
} from "./production";
import {
  BeltConnection,
  EntityStack,
  ItemBuffer,
  NewEntityStack,
  Producer,
} from "./types";

import {
  TestRecipe,
  TestOreRecipe,
  TestItemConsumerRecipe,
  TestRecipeBook,
} from "./test_recipe_defs";
import { PushToOtherProducer } from "./movement";
import { PushPullFromMainBus } from "./MainBusMovement";
import { TestEntityList } from "./test_entity_defs";
import { MainBus } from "./mainbus";
import { Building, NewBuildingSlot } from "./building";
import { NewInserter } from "./inserter";

function AddItemsToFixedBuffer(buffer: ItemBuffer, count: number) {
  buffer
    .Entities()
    .forEach(([entity]) => buffer.Add(NewEntityStack(entity, count)));
}

function NewTestFactory(r: string, count: number = 1): Factory {
  const factory = NewFactory({ subkind: "assembling-machine-1" }, count);
  UpdateBuildingRecipe(
    factory,
    r,
    TestEntityList.get.bind(TestEntityList),
    TestRecipeBook.get.bind(TestRecipeBook)
  );
  return factory;
}

function NewTestExtractor(r: string, count: number = 1): Extractor {
  const factory = NewExtractor({ subkind: "burner-mining-drill" }, count);
  UpdateBuildingRecipe(
    factory,
    r,
    TestEntityList.get.bind(TestEntityList),
    TestRecipeBook.get.bind(TestRecipeBook)
  );
  return factory;
}

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

    // Check InputBuffers
    for (var expectedInput of expected.inputBuffers) {
      expect(to.inputBuffers.Count(expectedInput.Entity)).toBe(
        expectedInput.Count
      );
    }

    // Check OutputBuffers
    for (var expectedOutput of expected.outputBuffers) {
      expect(from.outputBuffers.Count(expectedOutput.Entity)).toBe(
        expectedOutput.Count
      );
    }
  }

  it("Moves between Extractor and Factory", () => {
    const extractor = NewTestExtractor("test-ore", 1),
      factory = NewTestFactory("test-item", 1);
    AddItemsToFixedBuffer(extractor.outputBuffers, 5);

    TestMovement(extractor, factory, 3, {
      outputBuffers: [NewEntityStack("test-ore", 2)],
      inputBuffers: [
        NewEntityStack("test-ore", 3),
        NewEntityStack("test-slow-ore", 0),
      ],
    });
  });

  it("Moves between Factory and Factory", () => {
    const fromFactory = NewTestFactory("test-item", 1),
      toFactory = NewTestFactory("test-item-consumer", 1);
    AddItemsToFixedBuffer(fromFactory.outputBuffers, 5);

    TestMovement(fromFactory, toFactory, 3, {
      outputBuffers: [NewEntityStack("test-item", 2)],
      inputBuffers: [NewEntityStack("test-item", 3)],
    });
  });

  it("Moves uncapped amounts between Factory and Factory", () => {
    const fromFactory = NewTestFactory("test-item", 1),
      toFactory = NewTestFactory("test-item-consumer", 1);
    AddItemsToFixedBuffer(fromFactory.outputBuffers, 5);

    TestMovement(fromFactory, toFactory, Infinity, {
      outputBuffers: [NewEntityStack("test-item", 0)],
      inputBuffers: [NewEntityStack("test-item", 5)],
    });
  });

  it("Won't overflow target input", () => {
    const fromFactory = NewTestFactory("test-item", 1),
      toFactory = NewTestFactory("test-item-consumer", 1);
    AddItemsToFixedBuffer(fromFactory.outputBuffers, 50);
    AddItemsToFixedBuffer(toFactory.inputBuffers, 5);

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
    slot: { Building: Building; BeltConnections: BeltConnection[] },
    bus: MainBus,
    expected: {
      inputBuffers: EntityStack[];
      outputBuffers: EntityStack[];
      busCounts: Map<number, number>;
    }
  ) {
    const building = slot.Building;
    PushPullFromMainBus(slot, bus);

    for (var expectedOutput of expected.outputBuffers) {
      expect(building.outputBuffers.Count(expectedOutput.Entity)).toBe(
        expectedOutput.Count
      );
    }

    for (var [beltId, count] of expected.busCounts) {
      const lane = bus.lanes.get(beltId),
        entity = lane?.Entities()[0][0] || "";
      expect(lane?.Count(entity)).toBe(count);
    }

    for (var expectedInput of expected.inputBuffers) {
      expect(building.inputBuffers.Count(expectedInput.Entity)).toBe(
        expectedInput.Count
      );
    }
  }

  it.todo("Only pushes up to #producer count");

  it("Moves between Factory and MainBus", () => {
    const mb = new MainBus();
    mb.getEntity = TestEntityList.get.bind(TestEntityList);
    mb.AddLane("test-item", 0);
    mb.AddLane("test-ore", 5);
    mb.AddLane("test-slow-ore", 10);
    const factory = NewTestFactory("test-item", 1);
    const slot = NewBuildingSlot(factory, 3);

    AddItemsToFixedBuffer(factory.outputBuffers, 5);

    slot.BeltConnections = [
      {
        direction: "TO_BUS",
        laneId: 1,
        Inserter: NewInserter(1),
      },
      {
        direction: "FROM_BUS",
        laneId: 2,
        Inserter: NewInserter(1),
      },
      {
        direction: "FROM_BUS",
        laneId: 3,
        Inserter: NewInserter(1),
      },
    ];
    TestMovement(slot, mb, {
      inputBuffers: [
        NewEntityStack("test-ore", 1),
        NewEntityStack("test-slow-ore", 1),
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
