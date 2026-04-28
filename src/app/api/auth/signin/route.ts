import { getAdminAuth } from "@/firebase/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    const adminAuth = getAdminAuth();

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const response = NextResponse.json({ success: true });
    response.cookies.set("session", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 5,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Firebase Admin Error verifying ID token:", error);
    return NextResponse.json({ message: "Unauthorized", error: String(error) }, { status: 401 });
  }
}
