import { getUserFromAuth } from "@/app/lib/getUserFromAuth";
import { db } from "@/firebase/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }>},
) {
  const userId = await getUserFromAuth(req);
  const { id } = await params;

  try {
    await db
      .collection("users")
      .doc(userId)
      .collection("analysis_history")
      .doc(id)
      .delete();
    return NextResponse.json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}
