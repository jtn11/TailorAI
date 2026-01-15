import admin from "firebase-admin";

let app: admin.app.App | null = null;

export function getAdminApp() {
  if (app) return app;

  if (!process.env.FIREBASE_ADMIN_KEY) {
    throw new Error("Missing FIREBASE_ADMIN_KEY");
  }

  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
    }),
  });
  return app;
}

export function getAdminDb() {
  return getAdminApp().firestore();
}

export function getAdminAuth() {
  return getAdminApp().auth();
}
