import { ImmutableMap } from "./immutable";
import { Lab, NewLab, ResearchInLab, ResearchOutput } from "./research";
import { BuildingAddress } from "./state/address";
import { TestResearchBook } from "./test_research_defs";
import { AddItemsToReadonlyFixedBuffer as AddItemsToFixedBuffer } from "./test_utils";
import { EntityStack, NewEntityStack } from "./types";
import { ReadonlyResearchState } from "./factoryGameState";
// TODO: Need tests that work with progress trackers
// maybe call state update
// maybe split tests
describe("Labs", () => {
  function TestLab(
    lab: Lab,
    researchState: ReadonlyResearchState,
    expected: {
      outputBuffers: EntityStack[];
      inputBuffers: EntityStack[];
      recipeId: string;
      progress: EntityStack[];
    }
  ) {
    const vmDispatch = jest.fn();
    //    vmDispatch.mockImplementation(console.log);

    const labAddress: BuildingAddress = {
      regionId: "testRegion",
      buildingIdx: 0,
    };
    ResearchInLab(0, labAddress, lab, researchState, vmDispatch, (id) => {
      const r = TestResearchBook.get(id);
      if (!r) throw new Error("Failed to find id");
      return r;
    });

    const r = TestResearchBook.get(expected.recipeId);
    expect(lab.RecipeId).toBe(expected.recipeId);

    const count = -expected.inputBuffers[0]?.Count;

    if (count) {
      expect(vmDispatch).toHaveBeenCalledWith({
        address: { regionId: "testRegion", buildingIdx: 0 },
        count,
        currentTick: 0,
        kind: "AddProgressTrackers",
      });

      for (const expectedInput of expected.inputBuffers) {
        expect(vmDispatch).toHaveBeenCalledWith({
          address: { regionId: "testRegion", buildingIdx: 0, buffer: "input" },
          count: expectedInput.Count,
          entity: expectedInput.Entity,
          kind: "AddItemCount",
        });
      }
    }

    // TODO: progress trackers?
    if (count) lab.progressTrackers = new Array(count).fill(0);
    lab.outputBuffers = (lab.outputBuffers as ResearchOutput).SetResearch(
      lab.RecipeId,
      0,
      150
    );

    ResearchInLab(1000, labAddress, lab, researchState, vmDispatch, (id) => {
      const r = TestResearchBook.get(id);
      if (!r) throw new Error("Failed to find id");
      return r;
    });

    if (expected.outputBuffers.length)
      expect(vmDispatch).toHaveBeenCalledWith({
        address: { regionId: "testRegion", buildingIdx: 0 },
        count: -count,
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

    for (const expectedProgress of expected.progress) {
      expect(vmDispatch).toHaveBeenCalledWith({
        count: expectedProgress.Count,
        maxCount: r?.ProductionRequiredForCompletion,
        researchId: expectedProgress.Entity,
        kind: "AddResearchCount",
      });
    }
  }

  const testResearchState = () => ({
    CurrentResearchId: "test-research",
    Progress: ImmutableMap<string, EntityStack>(),
  });

  it("Produces a single item", () => {
    const lab = NewLab(1);

    lab.inputBuffers = AddItemsToFixedBuffer(lab.inputBuffers, 10);

    TestLab(lab, testResearchState(), {
      outputBuffers: [NewEntityStack("test-research", 1)],
      recipeId: "test-research",
      inputBuffers: [
        NewEntityStack("automation-science-pack", -1),
        NewEntityStack("logistic-science-pack", -1),
      ],
      progress: [NewEntityStack("test-research", 1)],
    });
  });

  it("Requires the correct types of science", () => {
    const lab = NewLab(1);
    lab.RecipeId = "test-research";
    lab.inputBuffers = lab.inputBuffers.AddItems("automation-science-pack", 1);

    TestLab(lab, testResearchState(), {
      outputBuffers: [],
      recipeId: "test-research",
      inputBuffers: [],
      progress: [],
    });
  });

  it("Won't Over-produces", () => {
    const lab = NewLab(1);
    const researchState = testResearchState();
    researchState.Progress = researchState.Progress.set(
      "test-research",
      NewEntityStack("test-research", 150, 150)
    );
    lab.inputBuffers = AddItemsToFixedBuffer(lab.inputBuffers, 10);

    TestLab(lab, researchState, {
      outputBuffers: [],
      recipeId: "test-research",
      inputBuffers: [],
      progress: [],
    });
  });
});
