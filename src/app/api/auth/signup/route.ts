import { getAdminAuth, getAdminDb } from "@/firebase/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json();
    if (!email || !password || !username) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();

    const user = await adminAuth.createUser({
      email,
      password,
      displayName: username,
    });

    await adminDb.collection("users").doc(user.uid).set({
      email,
      username,
      uid: user.uid,
      createdAt: new Date(),
    });
    return NextResponse.json({
      success: true,
      uid: user.uid,
      email: user.email,
    });
  } catch (error: any) {
    if (error.code === "auth/email-already-exists") {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: error.message || "Signup failed" },
      { status: 500 },
    );
  }
}
