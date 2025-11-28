export const runtime = "nodejs";
import { db } from "@/firebase/firebase-admin";
import { getAuth } from "firebase/auth";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";
// TODO: Make sure to import and initialize your Firebase Admin SDK

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    console.log("Api hit");
    const { text, jobDescription, userId } = await req.json();
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

    // storing analysis_history in firestore

    const docRef = await db
      .collection("users")
      .doc(userId)
      .collection("analysis_history")
      .add({
        createdAt: new Date(),
        data: parsed,
      });
    console.log("Analysis data prepared for Firestore:", docRef.id);
    return NextResponse.json({
      success: true,
      data: parsed,
      historyId: docRef.id,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}


export async function GET(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId missing" },
        { status: 400 }
      );
    }

    const snapshot = await db
      .collection("users")
      .doc(userId)
      .collection("analysis")
      .orderBy("createdAt", "desc")
      .get();

    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, history });

  } catch (error) {
    console.error("Firestore fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}