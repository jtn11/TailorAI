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

        missingKeywords, missingSkills, and suggestions MUST always be arrays. If there are no values, return an empty array [].
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
          "missingKeywords": string[],
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
