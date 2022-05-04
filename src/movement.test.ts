import { Building, NewBuildingSlot } from "./building";
import { ImmutableMap } from "./immutable";
import { NewInserter } from "./inserter";
import { MainBus } from "./mainbus";
import { PushPullFromMainBus } from "./MainBusMovement";
import { VMPushToOtherBuilding } from "./movement";
import {
  Extractor,
  Factory,
  NewExtractorForRecipe,
  NewFactoryForRecipe,
} from "./production";
import { NewLab } from "./research";
import { NewChest } from "./storage";
import { AddItemsToReadonlyFixedBuffer } from "./test_utils";
import { BeltConnection, EntityStack, NewEntityStack } from "./types";

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

describe("VMPushToOtherBuilding", () => {
  function TestMovement(
    from: any,
    to: any,
    maxMoved: number,
    expected: {
      outputBuffers: EntityStack[];
      inputBuffers: EntityStack[];
    }
  ) {
    const vmDispatch = jest.fn();
    VMPushToOtherBuilding(vmDispatch, "testRegion", 0, from, 1, to, maxMoved);

    // Check InputBuffers
    for (const expectedInput of expected.inputBuffers) {
      expect(vmDispatch).toHaveBeenCalledWith({
        address: { regionId: "testRegion", buildingIdx: 1, buffer: "input" },
        count: expectedInput.Count,
        entity: expectedInput.Entity,
        kind: "AddItemCount",
      });
    }

    // Check OutputBuffers
    for (const expectedOutput of expected.outputBuffers) {
      expect(vmDispatch).toHaveBeenCalledWith({
        address: { regionId: "testRegion", buildingIdx: 0, buffer: "output" },
        count: expectedOutput.Count,
        entity: expectedOutput.Entity,
        kind: "AddItemCount",
      });
    }
  }

  it("Moves between Chest to Lab", () => {
    const fromChest = NewChest(
        { subkind: "iron-chest" },
        4,
        ImmutableMap([["automation-science-pack", 10]])
      ),
      toLab = NewLab(1);

    TestMovement(fromChest, toLab, 3, {
      outputBuffers: [NewEntityStack("automation-science-pack", -3)],
      inputBuffers: [NewEntityStack("automation-science-pack", 3)],
    });
  });

  it("Won't move more than exists from Chest to Lab", () => {
    const fromChest = NewChest(
        { subkind: "iron-chest" },
        4,
        ImmutableMap([["automation-science-pack", 10]])
      ),
      toLab = NewLab(1);

    TestMovement(fromChest, toLab, 3, {
      outputBuffers: [],
      inputBuffers: [],
    });
  });

  it("Won't move more than fits from Chest to Lab", () => {
    const fromChest = NewChest(
        { subkind: "iron-chest" },
        1,
        ImmutableMap([["automation-science-pack", 10]])
      ),
      toLab = NewLab(1);
    toLab.inputBuffers = AddItemsToReadonlyFixedBuffer(toLab.inputBuffers, 199);

    TestMovement(fromChest, toLab, 3, {
      outputBuffers: [NewEntityStack("automation-science-pack", -1)],
      inputBuffers: [NewEntityStack("automation-science-pack", 1)],
    });
  });
  // });

  // describe("PushToOtherProducer", () => {
  //   function TestMovement(
  //     from: any,
  //     to: any,
  //     maxMoved: number,
  //     expected: {
  //       outputBuffers: EntityStack[];
  //       inputBuffers: EntityStack[];
  //     }
  //   ) {
  //     PushToOtherProducer(from, to, maxMoved);

  //     // Check InputBuffers
  //     for (var expectedInput of expected.inputBuffers) {
  //       expect(to.inputBuffers.Count(expectedInput.Entity)).toBe(
  //         expectedInput.Count
  //       );
  //     }

  //     // Check OutputBuffers
  //     for (var expectedOutput of expected.outputBuffers) {
  //       expect(from.outputBuffers.Count(expectedOutput.Entity)).toBe(
  //         expectedOutput.Count
  //       );
  //     }
  //   }

  it("Moves between Extractor and Factory", () => {
    const extractor = NewTestExtractor("test-ore", 1),
      factory = NewTestFactory("test-item", 1);
    extractor.outputBuffers = AddItemsToReadonlyFixedBuffer(
      extractor.outputBuffers,
      5
    );

    TestMovement(extractor, factory, 3, {
      outputBuffers: [NewEntityStack("test-ore", -3)],
      inputBuffers: [NewEntityStack("test-ore", 3)],
    });
  });

  it("Moves between Factory and Factory", () => {
    const fromFactory = NewTestFactory("test-item", 1),
      toFactory = NewTestFactory("test-item-consumer", 1);
    fromFactory.outputBuffers = AddItemsToReadonlyFixedBuffer(
      fromFactory.outputBuffers,
      5
    );

    TestMovement(fromFactory, toFactory, 3, {
      outputBuffers: [NewEntityStack("test-item", -3)],
      inputBuffers: [NewEntityStack("test-item", 3)],
    });
  });

  it("Moves uncapped amounts between Factory and Factory", () => {
    const fromFactory = NewTestFactory("test-item", 1),
      toFactory = NewTestFactory("test-item-consumer", 1);
    fromFactory.outputBuffers = AddItemsToReadonlyFixedBuffer(
      fromFactory.outputBuffers,
      5
    );

    TestMovement(fromFactory, toFactory, Infinity, {
      outputBuffers: [NewEntityStack("test-item", -5)],
      inputBuffers: [NewEntityStack("test-item", 5)],
    });
  });

  it("Won't overflow target input", () => {
    const fromFactory = NewTestFactory("test-item", 1),
      toFactory = NewTestFactory("test-item-consumer", 1);
    fromFactory.outputBuffers = AddItemsToReadonlyFixedBuffer(
      fromFactory.outputBuffers,
      50
    );
    toFactory.outputBuffers = AddItemsToReadonlyFixedBuffer(
      toFactory.inputBuffers,
      5
    );

    TestMovement(fromFactory, toFactory, Infinity, {
      outputBuffers: [],
      inputBuffers: [],
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
    const dispatch = jest.fn();
    const building = slot.Building;
    PushPullFromMainBus(dispatch, slot, bus);

    for (const expectedOutput of expected.outputBuffers) {
      expect(building.outputBuffers.Count(expectedOutput.Entity)).toBe(
        expectedOutput.Count
      );
    }

    for (const [beltId, count] of expected.busCounts) {
      const lane = bus.lanes.get(beltId),
        entity = lane?.Entities()[0][0] || "";
      expect(lane?.Count(entity)).toBe(count);
    }

    for (const expectedInput of expected.inputBuffers) {
      expect(building.inputBuffers.Count(expectedInput.Entity)).toBe(
        expectedInput.Count
      );
    }
  }

  it.todo("Only pushes up to #producer count");

  xit("Moves between Factory and MainBus", () => {
    const mb = new MainBus();
    const testItemLane = mb.AddLane("test-item", 0);
    mb.AddLane("test-ore", 5);
    mb.AddLane("test-slow-ore", 10);
    const factory = NewTestFactory("test-item", 0);
    const slot = NewBuildingSlot(factory, 3);

    factory.outputBuffers = AddItemsToReadonlyFixedBuffer(
      factory.outputBuffers,
      5
    );

    slot.BeltConnections = [
      {
        direction: "TO_BUS",
        laneId: testItemLane,
        Inserter: NewInserter(1, "TO_BUS"),
      },
      {
        direction: "FROM_BUS",
        laneId: 2,
        Inserter: NewInserter(1, "FROM_BUS"),
      },
      {
        direction: "FROM_BUS",
        laneId: 3,
        Inserter: NewInserter(1, "FROM_BUS"),
      },
    ];

    TestMovement(slot, mb, {
      inputBuffers: [
        NewEntityStack("test-ore", 1),
        NewEntityStack("test-slow-ore", 1),
      ],
      busCounts: new Map([
        [testItemLane, 1],
        [2, 4],
        [3, 9],
      ]),
      outputBuffers: [NewEntityStack("test-item", 4)],
    });
  });

  it.skip("Moves between Lab and MainBus", () => {
    const mb = new MainBus();
    const testItemLane = mb.AddLane("automation-science-pack", 10);
    const lab = NewLab(1);
    lab.inputBuffers = AddItemsToReadonlyFixedBuffer(lab.inputBuffers, 10);

    const slot = NewBuildingSlot(lab, 3);

    slot.BeltConnections = [
      {
        direction: "TO_BUS",
        laneId: testItemLane,
        Inserter: NewInserter(1, "TO_BUS"),
      },
      {
        direction: "FROM_BUS",
        laneId: 2,
        Inserter: NewInserter(1, "FROM_BUS"),
      },
      {
        direction: "FROM_BUS",
        laneId: 3,
        Inserter: NewInserter(1, "FROM_BUS"),
      },
    ];

    TestMovement(slot, mb, {
      inputBuffers: [NewEntityStack("automation-science-pack", 1)],
      busCounts: new Map([[testItemLane, 9]]),
      outputBuffers: [],
    });
  });
});

it.todo("Moves to above neighbor");
it.todo("Moves to below neighbor");
it.todo("Moves to both neighbors");
