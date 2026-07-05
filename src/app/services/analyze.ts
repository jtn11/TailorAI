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
          "status": "Strong" | "Demonstrated" | "Mentioned" | "Missing",
          "evidence": string[], // List of locations/projects/skills sections in the resume where the keyword appears or is referenced. E.g. ["TailorAI project", "Technical Skills"]. If not mentioned, return empty array [].
          "projectUsage": string[] | null, // If the keyword/skill is a tool/language/framework, list the project names where it is used (e.g. ["TailorAI", "TaskNest"]). If not used in any project, use ["None"] or null or [].
          "inSkillsSection": boolean, // Set to true if the keyword is explicitly listed/found in the skills list/section of the resume, otherwise false.
          "confidence": number, // A confidence percentage score (0-100) of your evaluation.
          "recommendation": string // Actionable recommendation (e.g., "No action required.", "Containerize TailorAI and mention it in Projects.", "Describe projects using Docker in detail.")
        }

        Guidance for evaluation:
        - Analyze the ENTIRE resume carefully, including the professional experience (projects, responsibilities) and skills sections.
        - Set "inSkillsSection" to true if the keyword is explicitly listed in the skills list/section.
        - Set "projectUsage" to the list of projects using it. If it is only in the skills list and not in any projects, set "projectUsage" to ["None"] or null.
        - Determine the status:
          - "Strong": if used in at least one project AND mentioned in the skills list (projectUsage.length > 0 and inSkillsSection is true).
          - "Demonstrated": if used in at least one project but NOT mentioned in the skills list (projectUsage.length > 0 and inSkillsSection is false).
          - "Mentioned": if mentioned in the skills list but NOT used in any projects (projectUsage is null/empty and inSkillsSection is true).
          - "Missing": if completely absent from the resume.

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
              "status": "Strong" | "Demonstrated" | "Mentioned" | "Missing",
              "evidence": string[],
              "projectUsage": string[] | null,
              "inSkillsSection": boolean,
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
