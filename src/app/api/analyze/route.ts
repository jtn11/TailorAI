export const runtime = "nodejs";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    console.log("Api hit");
    const { text } = await req.json();
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

    Job Description: web Developer

    Output a JSON with:
    - matchScore (0-100)
    - missingSkills
    - strengths
    - improvementSuggestions
    - personalizedCoverLetter
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });
    return NextResponse.json({
      success: true,
      data: response.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}
