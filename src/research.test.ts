import { EntityStack, FillEntityStack, NewEntityStack } from "./types";
import { TicksPerSecond } from "./constants";
import { Lab, NewLab, ResearchInLab } from "./research";
import { TestResearchBook } from "./test_research_defs";
import { ResearchState } from "./state/FactoryGameState";
import { AddItemsToFixedBuffer } from "./test_utils";

describe("Labs", () => {
  function TestLab(
    lab: Lab,
    researchState: ResearchState,
    expected: {
      outputBuffers: EntityStack[];
      inputBuffers: EntityStack[];
      recipeId: string;
      progress: EntityStack[];
    }
  ) {
    for (var i = 0; i < TicksPerSecond; i++) {
      const produced = ResearchInLab(
        lab,
        researchState,
        TestResearchBook.get.bind(TestResearchBook)
      );
    }
    expect(lab.RecipeId).toBe(expected.recipeId);
    for (var expectedOutput of expected.outputBuffers) {
      expect(lab.outputBuffers.Count(expectedOutput.Entity)).toBe(
        expectedOutput.Count
      );
    }
    for (var expectedInput of expected.inputBuffers) {
      expect(lab.inputBuffers.Count(expectedInput.Entity)).toBe(
        expectedInput.Count
      );
    }
  }

  const testResearchState = () => ({
    CurrentResearchId: "test-research",
    Progress: new Map(),
  });

  fit("Produces a single item", () => {
    const lab = NewLab(1);

    AddItemsToFixedBuffer(lab.inputBuffers, 10);

    TestLab(lab, testResearchState(), {
      outputBuffers: [NewEntityStack("test-research", 1)],
      recipeId: "test-research",
      inputBuffers: [
        NewEntityStack("automation-science-pack", 9),
        NewEntityStack("logistic-science-pack", 9),
        NewEntityStack("production-science-pack", 10),
      ],
      progress: [NewEntityStack("test-research", 1)],
    });
  });

  it("Requires the correct types of science", () => {
    const lab = NewLab(1);
    lab.RecipeId = "test-research";
    lab.inputBuffers.Add(NewEntityStack("automation-science-pack", 1));

    TestLab(lab, testResearchState(), {
      outputBuffers: [NewEntityStack("test-research", 0)],
      recipeId: "test-research",
      inputBuffers: [
        NewEntityStack("automation-science-pack", 1),
        NewEntityStack("logistic-science-pack", 0),
      ],
      progress: [NewEntityStack("test-research", 0)],
    });
  });

  it("Won't Over-produces", () => {
    const lab = NewLab(1);
    const researchState = testResearchState();
    researchState.Progress.set(
      "test-research",
      NewEntityStack("test-research", 150, 150)
    );

    lab.inputBuffers
      .Entities()
      .forEach(([entity]) => lab.inputBuffers.Add(NewEntityStack(entity, 10)));

    TestLab(lab, researchState, {
      outputBuffers: [NewEntityStack("test-research", 150)],
      recipeId: "test-research",
      inputBuffers: [
        NewEntityStack("automation-science-pack", 10),
        NewEntityStack("logistic-science-pack", 10),
        NewEntityStack("production-science-pack", 10),
      ],
      progress: [NewEntityStack("test-research", 150)],
    });
  });
});
