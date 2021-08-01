import { EntityStack, FillEntityStack, NewEntityStack } from "./types";
import { TicksPerSecond } from "./constants";
import { Lab, NewLab, ResearchInLab } from "./research";
import { TestResearchBook } from "./test_research_defs";
import { ResearchState } from "./factoryGame";

describe("Labs", () => {
  function TestLab(
    lab: Lab,
    researchState: ResearchState,
    expected: {
      outputCount: number;
      inputBuffers: EntityStack[];
      recipeId: string;
      progress: EntityStack[];
    }
  ) {
    for (var i = 0; i < TicksPerSecond; i++) {
      ResearchInLab(
        lab,
        researchState,
        TestResearchBook.get.bind(TestResearchBook)
      );
    }
    expect(lab.RecipeId).toBe(expected.recipeId);
    expect(lab.outputBuffer.Count).toBe(expected.outputCount);
    for (var expectedInput of expected.inputBuffers) {
      expect(lab.inputBuffers.get(expectedInput.Entity)?.Count).toBe(
        expectedInput.Count
      );
    }
  }

  const testResearchState = () => ({
    CurrentResearchId: "test-research",
    Progress: new Map(),
  });

  it("Produces a single item", () => {
    const lab = NewLab(1);

    lab.inputBuffers.forEach((input) => FillEntityStack(input, 10));

    TestLab(lab, testResearchState(), {
      outputCount: 1,
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
    FillEntityStack(
      lab.inputBuffers.get("automation-science-pack") ??
        NewEntityStack("never"),
      1
    );

    TestLab(lab, testResearchState(), {
      outputCount: 0,
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

    lab.inputBuffers.forEach((input) => FillEntityStack(input, 10));

    TestLab(lab, researchState, {
      outputCount: 150,
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
