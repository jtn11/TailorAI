export const runtime = "nodejs";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    console.log("Api hit");
    const { text, jobDescription } = await req.json();
    console.log(text);

    if (!text) {
      return NextResponse.json(
        { error: "resume text or job description missing" },
        { status: 400 },
      );
    }

    const prompt = `
Analyze this resume for a job match.

Resume:
${text}

Job Description: ${jobDescription}

RETURN ONLY pure JSON.
NO markdown.
NO explanation.
NO extra text.
NO backticks.

Use EXACT schema:

{
  "matchScore": number,
  "missingSkills": string[],
  "missingKeywords": string[],
  "suggestions": string[],
  "coverLetter": string
}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.choices[0].message.content?.trim() ?? "";

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("JSON Parse error from model output:", raw);
      return NextResponse.json(
        {
          success: false,
          error: "Model returned invalid JSON",
          rawResponse: raw,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}
