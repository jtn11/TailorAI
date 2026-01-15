import { getUserFromAuth } from "@/app/lib/getUserFromAuth";
import { getAdminDb } from "@/firebase/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context : { params: { id: string }},
) {
  const userId = await getUserFromAuth(req);
  const { id } = context.params;
  const db = getAdminDb();

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
