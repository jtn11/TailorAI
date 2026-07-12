import Groq from "groq-sdk";

async function analyzeResumeStructure(groq: Groq, text: string, jobDescription: string): Promise<string> {
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

        5. skillsAnalysis: An array of 4-5 relevant skill categories (e.g., "Backend", "Frontend", "Database") with:
           - label: name of the category (string)
           - score: score between 0-1 (number)
           - strengths: 2-3 key skills or technologies the candidate strongly has in this category based on their resume (string[])
           - gaps: 2-3 key missing or weak skills or technologies in this category based on the job description requirements (string[])

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

        matchBreakdown must be an object containing:
        {
          "strengths": string[], // 3-4 key matching strengths of the candidate for this role (e.g., "React + Next.js experience").
          "weaknesses": string[], // 3-4 core weaknesses, missing qualifications, or gaps (e.g., "No AWS experience").
          "improvements": [
            { "scoreBoost": number, "action": string } // scoreBoost: the percentage score improvement (e.g., 3 for +3%). action: actionable suggestion (e.g., "Show PostgreSQL in a project").
          ],
          "potentialScore": number // Overall potential match score if all improvements are made, between 0-1 (e.g., 0.94).
        }

        missingSkills and suggestions MUST always be arrays. If there are no values, return an empty array [].
        Use EXACT schema:

        {
          "matchScore": number,
          "experienceScore": number,
          "skillsScore": number,
          "educationScore": number,
          "skillsAnalysis": [
            { "label": string, "score": number, "strengths": string[], "gaps": string[] }
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
          "jobDescription": string,
          "date": string,
          "matchBreakdown": {
            "strengths": string[],
            "weaknesses": string[],
            "improvements": [
              { "scoreBoost": number, "action": string }
            ],
            "potentialScore": number
          }
        } `;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content?.trim() ?? "";
}

async function generateCoverLetter(groq: Groq, text: string, jobDescription: string): Promise<string> {
  const prompt = `
        You are an expert career coach and professional writer.
        Your task is to write a highly personalized, professional, and compelling cover letter based on the candidate's Resume and the target Job Description.

        Resume:
        ${text}

        Job Description:
        ${jobDescription}

        Guidelines:
        1. Tone & Style:
           - Confident, professional, engaging, and enthusiastic.
           - Use active verbs and professional phrasing. Avoid generic templates, clichés, and buzzwords.
           - The letter must feel genuinely written by the candidate, referencing actual details from their resume.

        2. Layout & Formatting:
           - Include standard business letter header placeholders at the top:
             [Your Name]
             [Your Contact Information]
             [Date]

             [Hiring Manager's Name or Search Committee]
             [Company Name]
             [Company Address]

             Dear [Hiring Manager's Name or Hiring Team],
           - DO NOT use any markdown formatting (no bold asterisks like **, no bullet points -, no hashes #). Write in clean, professional plain text with standard capitalization and spacing.
           - Use double newlines ("\n\n") to separate paragraphs cleanly.

        3. Structure (3-4 paragraphs, 250-400 words):
           - Introduction: Hook the reader, state the specific target job title, and summarize the candidate's core value proposition.
           - Body Paragraph 1 (Skills & Experience Alignment): Detail the candidate's technical/professional experience that directly maps to the job description. Cite specific projects, roles, and achievements from the resume (e.g. "During my work as a Software Engineer at Google, I..."). Use metrics or impact where available.
           - Body Paragraph 2 (Value Add & Soft Skills): Highlight the candidate's core strengths, problem-solving abilities, and how they can solve specific challenges for the company.
           - Conclusion: Reiterate enthusiasm for the company and role, state a clear call-to-action (expressing interest in discussing the role in an interview), and end with a professional closing:
             Sincerely,

             [Your Name]

        Provide ONLY the cover letter text. Do not include any explanations, introduction, markdown blocks (like \`\`\`text), or notes. Start directly with the header placeholders.
  `;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content?.trim() ?? "";
}

export async function analyzeResume(text: string, jobDescription: string) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const [structureRaw, coverLetterText] = await Promise.all([
    analyzeResumeStructure(groq, text, jobDescription),
    generateCoverLetter(groq, text, jobDescription),
  ]);

  try {
    const parsed = JSON.parse(structureRaw);
    parsed.coverLetter = coverLetterText;
    return JSON.stringify(parsed);
  } catch (err) {
    console.error("Failed to parse structure raw JSON:", err, "raw was:", structureRaw);
    // If parsing fails, create a minimal valid JSON with the cover letter
    return JSON.stringify({
      matchScore: 0,
      experienceScore: 0,
      skillsScore: 0,
      educationScore: 0,
      skillsAnalysis: [],
      missingSkills: [],
      missingKeywords: [],
      suggestions: [],
      jobDescription: "Failed to analyze",
      date: new Date().toISOString(),
      matchBreakdown: {
        strengths: [],
        weaknesses: [],
        improvements: [],
        potentialScore: 0
      },
      coverLetter: coverLetterText,
      error: "Model returned invalid JSON structure"
    });
  }
}
