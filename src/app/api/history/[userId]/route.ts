import { db } from "@/firebase/firebase-admin";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise <{ userId: string }> },
) {
  try {
    const {userId} = await params;

    if (!userId) {
      return NextResponse.json({ error: "userId missing" }, { status: 400 });
    }

    const snapshot = await db
      .collection("users")
      .doc(userId)
      .collection("analysis_history")
      .orderBy("createdAt", "desc")
      .get();

    const history = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, history });
  } catch (error) {
    console.error("Firestore fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
