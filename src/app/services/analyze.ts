import Groq from "groq-sdk";

export async function analyzeResume(text: string, jobDescription: string) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const prompt = `
        Analyze this resume for a job match.

        Resume:=
        ${text}

        Job Description: ${jobDescription}

        RETURN ONLY pure JSON.
        NO markdown.
        NO explanation.
        NO extra text.
        NO backticks.
        jobDescription (in two-three words) 
        
        Provide scores between 0-1 for:
        1. experienceScore: How well the work history matches the job requirements.
        2. skillsScore: Match of technical and soft skills.
        3. educationScore: Match of educational background.
        4. matchScore: The overall average of the above three scores.

        5. skillsAnalysis: An array of 4-5 relevant skill categories (e.g., "Backend", "Frontend", "Management") with a score between 0-1.

        missingKeywords must be an array of objects representing target keywords/skills from the Job Description that need evaluation or are missing/weak in the resume:
        {
          "keyword": string,
          "impact": "HIGH" | "MEDIUM" | "LOW",
          "status": "Strongly Demonstrated" | "Mentioned only" | "Not mentioned",
          "evidence": string[], // List of locations/projects/skills sections in the resume where the keyword appears or is referenced. E.g. ["TailorAI project", "Technical Skills"]. If not mentioned, return empty array [].
          "projectUsage": string[] | null, // If the keyword/skill is a tool/language/framework, list the project names where it is used (e.g. ["TailorAI", "TaskNest"]). If not used in any project, use ["None"] or null.
          "confidence": number, // A confidence percentage score (0-100) of your evaluation.
          "recommendation": string // Actionable recommendation (e.g., "No action required.", "Containerize TailorAI and mention it in Projects.", "Describe projects using Docker in detail.")
        }

        Guidance for evaluation:
        - Analyze the ENTIRE resume carefully, including the professional experience (projects, responsibilities) and skills sections.
        - If a keyword/skill is mentioned in multiple projects or sections (e.g., Firebase is in TailorAI and TaskNest projects, and also in Skills), status must be "Strongly Demonstrated". List all projects and sections in "evidence", set project names in "projectUsage", and recommendation must be "No action required.".
        - If a skill is listed under the "Skills" section but not in any projects, status must be "Mentioned only". List where it was found in "evidence", set "projectUsage" to ["None"] (or null), and recommend how to demonstrate it in projects (e.g., "Containerize TailorAI and mention it in Projects.").
        - If a skill is completely absent from the resume, status must be "Not mentioned". Recommend learning or adding it if they have experience, or building a basic project using it.

        missingSkills and suggestions MUST always be arrays. If there are no values, return an empty array [].
        Use EXACT schema:

        {
          "matchScore": number,
          "experienceScore": number,
          "skillsScore": number,
          "educationScore": number,
          "skillsAnalysis": [
            { "label": string, "score": number }
          ],
          "missingSkills": string[],
          "missingKeywords": [
            {
              "keyword": string,
              "impact": "HIGH" | "MEDIUM" | "LOW",
              "status": "Strongly Demonstrated" | "Mentioned only" | "Not mentioned",
              "evidence": string[],
              "projectUsage": string[] | null,
              "confidence": number,
              "recommendation": string
            }
          ],
          "suggestions": string[],
          "coverLetter": string,
          "jobDescription": string,
          "date": string
        } `;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content?.trim() ?? "";
}
