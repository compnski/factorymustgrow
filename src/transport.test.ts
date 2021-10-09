import { NewBuildingSlot } from "./building";
import { NewBeltLinePair, UpdateBeltLine } from "./transport";
import { EntityStack, NewEntityStack, NewRegion, Region } from "./types";

var nextTestRegionId = 1;
var testRegions = new Map<string, Region>();
function NewTestRegion(ore: EntityStack[] = []): Region {
  const r = NewRegion(`test-${nextTestRegionId++}`, 0, 0, ore, []);
  testRegions.set(r.Id, r);
  return r;
}
beforeEach(function () {
  nextTestRegionId = 1;
  testRegions.clear();
});

describe("BeltLine", () => {
  it("Initializes properly", function () {
    const fromRegion = NewTestRegion(),
      toRegion = NewTestRegion();

    const [beltLine, fromDepot, toDepot] = NewBeltLinePair(
      fromRegion,
      toRegion,
      "transport-belt",
      3
    );

    expect(toDepot.otherRegionId).toBe("test-1");
    expect(fromDepot.otherRegionId).toBe("test-2");
    expect(toDepot.subkind).toBe("transport-belt");
    expect(fromDepot.subkind).toBe("transport-belt");
    expect(toDepot.length).toBe(3);
    expect(fromDepot.length).toBe(3);

    expect(beltLine.toRegionId).toBe("test-2");
    expect(beltLine.fromRegionId).toBe("test-1");
    expect(beltLine.beltLineId).toBe(toDepot.beltLineId);
    expect(beltLine.beltLineId).toBe(fromDepot.beltLineId);
    expect(beltLine.length).toBe(3);
  });

  it("Transports items of one type across regions", function () {
    //
    const fromRegion = NewTestRegion(),
      toRegion = NewTestRegion();

    const [beltLine, fromDepot, toDepot] = NewBeltLinePair(
      fromRegion,
      toRegion,
      "transport-belt",
      3
    );

    fromRegion.BuildingSlots.push(NewBuildingSlot(fromDepot));
    toRegion.BuildingSlots.push(NewBuildingSlot(toDepot));

    fromDepot.inputBuffers.Add(NewEntityStack("iron-ore", 50, 50), Infinity);
    //UpdateBeltLine(0, testRegions, beltLine);
    for (var i = 1; i < 4; i++) {
      UpdateBeltLine(0, testRegions, beltLine);
      expect(fromDepot.inputBuffers.Count("iron-ore")).toBe(50 - 16 * i);
      expect(toDepot.outputBuffers.Entities()).toEqual([]);
    }
    UpdateBeltLine(0, testRegions, beltLine);
    expect(fromDepot.inputBuffers.Count("iron-ore")).toBe(0);
    expect(toDepot.outputBuffers.Entities()).toEqual([["iron-ore", 16]]);
    for (var i = 2; i < 5; i++) {
      UpdateBeltLine(0, testRegions, beltLine);
      expect(toDepot.outputBuffers.Count("iron-ore")).toBe(
        Math.min(16 * i, 50)
      );
    }
  });

  it("Transports items of many types across regions", function () {
    //
    const fromRegion = NewTestRegion(),
      toRegion = NewTestRegion();

    const [beltLine, fromDepot, toDepot] = NewBeltLinePair(
      fromRegion,
      toRegion,
      "transport-belt",
      3
    );

    fromRegion.BuildingSlots.push(NewBuildingSlot(fromDepot));
    toRegion.BuildingSlots.push(NewBuildingSlot(toDepot));

    fromDepot.inputBuffers.Add(NewEntityStack("iron-ore", 20, 50), Infinity);
    //UpdateBeltLine(0, testRegions, beltLine);
    for (var i = 1; i < 4; i++) {
      UpdateBeltLine(0, testRegions, beltLine);
      expect(fromDepot.inputBuffers.Count("iron-ore")).toBe(
        Math.max(0, 20 - 16 * i)
      );
      expect(toDepot.outputBuffers.Entities()).toEqual([]);
    }

    fromDepot.inputBuffers.Add(NewEntityStack("copper-ore", 20, 50), Infinity);
    //UpdateBeltLine(0, testRegions, beltLine);
    for (var i = 1; i < 4; i++) {
      UpdateBeltLine(0, testRegions, beltLine);
      expect(fromDepot.inputBuffers.Count("copper-ore")).toBe(
        Math.max(0, 20 - 16 * i)
      );

      expect(toDepot.outputBuffers.Count("iron-ore")).toBe(
        Math.min(16 * i, 20)
      );
    }
    expect(
      toDepot.outputBuffers.Remove(NewEntityStack("iron-ore", 0, 50))
    ).toBe(20);

    UpdateBeltLine(0, testRegions, beltLine);
    expect(
      toDepot.outputBuffers.Remove(NewEntityStack("copper-ore", 0, 50))
    ).toBe(16);

    UpdateBeltLine(0, testRegions, beltLine);
    expect(
      toDepot.outputBuffers.Remove(NewEntityStack("copper-ore", 0, 50))
    ).toBe(4);
  });
  it.todo("Coaleceses item stacks");
});
