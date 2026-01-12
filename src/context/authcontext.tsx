"use client";
import { app } from "@/firebase/firebase";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthcontextType {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
  userid?: string | null;
  currentUser: any;
}

const auth = getAuth(app);

const Authcontext = createContext<AuthcontextType | undefined>(undefined);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userid, setUserid] = useState<string | null>(null);

  const router = useRouter();

  const createSession = async (user: any) => {
    const idToken = await user.getIdToken();
    await fetch("api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  };

  const login = async (email: string, password: string) => {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    await createSession(userCred.user);
    router.push("/dashboard");
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

    const userCred = await signInWithEmailAndPassword(auth, email, password);
    await createSession(userCred.user);
    router.push("/dashboard");
  };

  const logout = async () => {
    await fetch("/api/auth/logout", {method : "POST"}) ;
    await signOut(auth);
    router.push("/signin");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        console.log("userUID", user.uid);
        setUserid(user.uid);
      } else {
        return;
      }
    });

    return () => unsubscribe();
  }, []);

  const isLoggedIn = currentUser ? true : false;

  return (
    <Authcontext.Provider
      value={{ login, signup, logout, isLoggedIn, userid, currentUser }}
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
