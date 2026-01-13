import { POST } from "@/app/api/analyze/route"; // Import the POST handler directly
import Groq from "groq-sdk";
jest.mock("@/lib/ai/groqClient");

describe("POST /api/analyze", () => {
  it("returns analysis result for valid input", async () => {
    (Groq.prototype.chat.completions.create as jest.Mock).mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              matchScore: 80,
              missingKeywords: ["Docker"],
              missingSkills: ["System Design"],
              suggestions: ["Add Docker experience"],
            }),
          },
        },
      ],
    });

    // Mock the Request object
    const mockRequest = {
      json: async () => ({
        text: "React developer",
        jobDescription: "Looking for React dev",
        userId: "user123",
      }),
    } as Request;

    // Call the POST handler directly
    const response = await POST(mockRequest);

    // Parse the JSON response
    const res = await response.json();

    expect(response.status).toBe(200);
    expect(res.data.matchScore).toBe(80);
  });
});
