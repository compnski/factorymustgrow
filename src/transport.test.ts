import { NewTruckLine } from "./transport";

// var nextTestRegionId = 1;
// var testRegions = new Map<string, Region>();
// function NewTestRegion(ore: EntityStack[] = []): Region {
//   const r = NewRegion(`test-${nextTestRegionId++}`, 0, 0, 0, ore, []);
//   testRegions.set(r.Id, r);
//   return r;
// }
// beforeEach(function () {
//   nextTestRegionId = 1;
//   testRegions.clear();
// });

describe("TruckLine", () => {
  it("Initializes properly", function () {
    const truckLine = NewTruckLine("123", "concrete", 3);

    expect(truckLine.length).toBe(3);
    expect(truckLine.truckLineId).toBe("123");
  });

  // it("Transports items of one type across regions", function () {
  //   //
  //   const fromRegion = NewTestRegion(),
  //     toRegion = NewTestRegion();

  //   const [truckLine, fromDepot, toDepot] = NewTruckLinePair(
  //     fromRegion,
  //     toRegion,
  //     "transport-belt",
  //     3
  //   );

  //   fromRegion.BuildingSlots.push(NewBuildingSlot(fromDepot));
  //   toRegion.BuildingSlots.push(NewBuildingSlot(toDepot));

  //   fromDepot.inputBuffers.Add(NewEntityStack("iron-ore", 50, 50), Infinity);
  //   //UpdateTruckLine(0, testRegions, truckLine);
  //   for (var i = 1; i < 4; i++) {
  //     UpdateTruckLine(0, testRegions, truckLine);
  //     expect(fromDepot.inputBuffers.Count("iron-ore")).toBe(50 - 16 * i);
  //     expect(toDepot.outputBuffers.Entities()).toEqual([]);
  //   }
  //   UpdateTruckLine(0, testRegions, truckLine);
  //   expect(fromDepot.inputBuffers.Count("iron-ore")).toBe(0);
  //   expect(toDepot.outputBuffers.Entities()).toEqual([["iron-ore", 16]]);
  //   for (var i = 2; i < 5; i++) {
  //     UpdateTruckLine(0, testRegions, truckLine);
  //     expect(toDepot.outputBuffers.Count("iron-ore")).toBe(
  //       Math.min(16 * i, 50)
  //     );
  //   }
  // });

  // it("Transports items of many types across regions", function () {
  //   //
  //   const fromRegion = NewTestRegion(),
  //     toRegion = NewTestRegion();

  //   const [truckLine, fromDepot, toDepot] = NewTruckLinePair(
  //     fromRegion,
  //     toRegion,
  //     "transport-belt",
  //     3
  //   );

  //   fromRegion.BuildingSlots.push(NewBuildingSlot(fromDepot));
  //   toRegion.BuildingSlots.push(NewBuildingSlot(toDepot));

  //   fromDepot.inputBuffers.Add(NewEntityStack("iron-ore", 20, 50), Infinity);
  //   //UpdateTruckLine(0, testRegions, truckLine);
  //   for (var i = 1; i < 4; i++) {
  //     UpdateTruckLine(0, testRegions, truckLine);
  //     expect(fromDepot.inputBuffers.Count("iron-ore")).toBe(
  //       Math.max(0, 20 - 16 * i)
  //     );
  //     expect(toDepot.outputBuffers.Entities()).toEqual([]);
  //   }

  //   fromDepot.inputBuffers.Add(NewEntityStack("copper-ore", 20, 50), Infinity);
  //   //UpdateTruckLine(0, testRegions, truckLine);
  //   for (var i = 1; i < 4; i++) {
  //     UpdateTruckLine(0, testRegions, truckLine);
  //     expect(fromDepot.inputBuffers.Count("copper-ore")).toBe(
  //       Math.max(0, 20 - 16 * i)
  //     );

  //     expect(toDepot.outputBuffers.Count("iron-ore")).toBe(
  //       Math.min(16 * i, 20)
  //     );
  //   }
  //   expect(
  //     toDepot.outputBuffers.Remove(NewEntityStack("iron-ore", 0, 50))
  //   ).toBe(20);

  //   UpdateTruckLine(0, testRegions, truckLine);
  //   expect(
  //     toDepot.outputBuffers.Remove(NewEntityStack("copper-ore", 0, 50))
  //   ).toBe(16);

  //   UpdateTruckLine(0, testRegions, truckLine);
  //   expect(
  //     toDepot.outputBuffers.Remove(NewEntityStack("copper-ore", 0, 50))
  //   ).toBe(4);
  // });
  it.todo("Coaleceses item stacks");
});
