import { ImmutableMap } from "./immutable";
import { Lab, NewLab, ResearchInLab } from "./research";
import { TestResearchBook } from "./test_research_defs";
import { AddItemsToReadonlyFixedBuffer as AddItemsToFixedBuffer } from "./test_utils";
import { EntityStack, NewEntityStack } from "./types";
import { ReadonlyResearchState } from "./useGameState";

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

    ResearchInLab("testRegion", 0, lab, researchState, vmDispatch, (id) => {
      const r = TestResearchBook.get(id);
      if (!r) throw new Error("Failed to find id");
      return r;
    });

    const r = TestResearchBook.get(expected.recipeId);
    expect(lab.RecipeId).toBe(expected.recipeId);

    for (const expectedInput of expected.inputBuffers) {
      // expect(lab.inputBuffers.Count(expectedInput.Entity)).toBe(
      //   expectedInput.Count
      // );
      expect(vmDispatch).toHaveBeenCalledWith({
        address: { regionId: "testRegion", buildingSlot: 0, buffer: "input" },
        count: expectedInput.Count,
        entity: expectedInput.Entity,
        kind: "AddItemCount",
      });
    }

    for (const expectedOutput of expected.outputBuffers) {
      expect(vmDispatch).toHaveBeenCalledWith({
        count: expectedOutput.Count,
        maxCount: r?.ProductionRequiredForCompletion,
        researchId: expectedOutput.Entity,
        kind: "SetResearchCount",
      });

      expect(vmDispatch).toHaveBeenCalledWith({
        address: { regionId: "testRegion", buildingSlot: 0, buffer: "output" },
        count: expectedOutput.Count,
        entity: expectedOutput.Entity,
        kind: "AddItemCount",
      });

      // expect(lab.outputBuffers.Count(expectedOutput.Entity)).toBe(
      //   expectedOutput.Count
      // );
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
      progress: [NewEntityStack("test-research", 150)],
    });
  });
});
