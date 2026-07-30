import { analyzeResume } from "@/app/services/analyze";

jest.mock("@/app/services/analyze", () => ({
  analyzeResume: jest.fn(),
}));

describe("analyzeResume service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns valid JSON string from AI service", async () => {
    (analyzeResume as jest.Mock).mockResolvedValue(
      JSON.stringify({
        matchScore: 80,
        missingSkills: [
          {
            skill: "Docker",
            category: "Cloud/DevOps",
            gapDescription: "No containerization technology found in resume",
            recommendation: "Demonstrate Docker usage in a project description",
            impact: "HIGH",
          }
        ],
        missingKeywords: ["Kubernetes"],
        suggestions: ["Learn Docker"],
        coverLetter: "Sample cover letter",
      }),
    );

    const result = await analyzeResume("resume text", "job description");
    const parsed = JSON.parse(result);

    expect(parsed.matchScore).toBe(80);
    expect(parsed.missingSkills[0].skill).toBe("Docker");
  });

  it("throws error when AI returns invalid JSON", async () => {
    (analyzeResume as jest.Mock).mockResolvedValue(
      "This is not JSON from the AI",
    );

    const result = await analyzeResume("resume text", "job description");

    expect(() => JSON.parse(result)).toThrow();
  });

  it("handles empty resume text gracefully", async () => {
    (analyzeResume as jest.Mock).mockResolvedValue(
      JSON.stringify({
        matchScore: 0,
        missingSkills: [
          {
            skill: "Programming",
            category: "General",
            gapDescription: "No programming experience found",
            recommendation: "Add programming languages to your resume",
            impact: "HIGH",
          }
        ],
        missingKeywords: ["Web Development"],
        suggestions: ["Add technical skills"],
      }),
    );

    const result = await analyzeResume("", "Web Developer");
    const parsed = JSON.parse(result);

    expect(parsed.matchScore).toBe(0);
    expect(parsed.missingSkills.length).toBeGreaterThan(0);
    expect(parsed.missingSkills[0].skill).toBe("Programming");
  });
});
