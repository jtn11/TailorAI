"use client";
import { getfirebaseApp } from "@/firebase/firebase";
import { getAuth, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthcontextType {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
  userid?: string | null;
  currentUser: any;
  username: string | null;
}

const Authcontext = createContext<AuthcontextType | undefined>(undefined);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userid, setUserid] = useState<string | null>(null);
  const [auth, setAuth] = useState<any>(null);
  const [username, setUsername] = useState<string | null>("");

  const router = useRouter();

  const createSession = async (user: any) => {
    const idToken = await user.getIdToken();
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to create session");
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle session creation and navigation
  };

  const signup = async (email: string, password: string, username: string) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    });
    if (!res.ok) {
      throw new Error("Signup failed");
    }

    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle session creation and navigation
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle session creation and navigation
    } catch (error: any) {
      if (error.code === "auth/popup-blocked") {
        console.warn("Popup blocked by browser. Falling back to redirect...");
        import("firebase/auth").then(({ signInWithRedirect }) => {
          signInWithRedirect(auth, provider);
        });
      } else {
        throw error;
      }
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await signOut(auth);
    router.push("/signin");
  };

  useEffect(() => {
    const app = getfirebaseApp();
    if (!app) return;

    const authInstance = getAuth(app);
    setAuth(authInstance);

    // Sync session universally on auth state change. This handles token refreshes
    // and redirect logins before exposing the user to the application state,
    // preventing middleware race conditions.
    const unsubscribe = authInstance.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          await createSession(user);
          // Only set user state if session creation succeeded!
          setCurrentUser(user);
          setUserid(user.uid);
          setUsername(user.displayName);
        } catch (e) {
          console.error("Failed to sync session cookie. Signing out.", e);
          await signOut(authInstance);
          setCurrentUser(null);
          setUserid(null);
          setUsername(null);
        }
      } else {
        setCurrentUser(null);
        setUserid(null);
        setUsername(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const isLoggedIn = currentUser ? true : false;

  return (
    <Authcontext.Provider
      value={{
        login,
        signup,
        signInWithGoogle,
        logout,
        isLoggedIn,
        userid,
        currentUser,
        username,
      }}
    >
      {children}
    </Authcontext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(Authcontext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
