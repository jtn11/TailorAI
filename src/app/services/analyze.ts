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
        jobDescription (in two -three words) 
        matchScore (decimal value between 0-1)

        Use EXACT schema:

        {
          "matchScore": number,
          "missingSkills": string[],
          "missingKeywords": string[],
          "suggestions": string[],
          "coverLetter": string,
          "jobDescription" : string,
          "date": string (should be the current date)
        } `;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content?.trim() ?? "";
}
