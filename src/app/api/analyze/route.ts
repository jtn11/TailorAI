export const runtime = "nodejs";
import { analyzeResume } from "@/app/services/analyze";
import { db } from "@/firebase/firebase-admin";
import { NextResponse } from "next/server";

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
    const raw = await analyzeResume(text, jobDescription);
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
