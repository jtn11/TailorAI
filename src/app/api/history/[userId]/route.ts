import { getAdminDb } from "@/firebase/firebase-admin";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  const db = getAdminDb();
  try {
    const { userId } = await context.params;

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
