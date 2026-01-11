import { admin } from "@/firebase/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const response = NextResponse.json({ success: true });
    response.cookies.set("session", idToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 5,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
