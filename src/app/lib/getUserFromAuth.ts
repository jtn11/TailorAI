import { getAdminAuth } from "@/firebase/firebase-admin";

export async function getUserFromAuth(req: Request) {
  const admin = getAdminAuth(); 
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorised");
  }

  const token = authHeader.replace("Bearer ", "");
  const decodedToken = await admin.verifyIdToken(token);
  return decodedToken.uid;
}
