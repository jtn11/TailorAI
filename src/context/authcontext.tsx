"use client";
import { app } from "@/firestore/firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthcontextType {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
}

const auth = getAuth(app);
const firebasedb = getFirestore();

const Authcontext = createContext<AuthcontextType | undefined>(undefined);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [username, setUsername] = useState<string | null>(null);

  const router = useRouter();

  const login = async (email: string, password: string) => {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;
    console.log(user);
    router.push("/dashboard");
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      const signedInUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = signedInUser.user;
      console.log(user);
      await setDoc(doc(firebasedb, "users", user.uid), {
        username,
        email,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push("/signin");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        console.log("userUID", user.uid);
        console.log(
          "This is the current user token",
          (await user.getIdToken()).trim(),
        );
      }
    });

    return () => unsubscribe();
  }, []);

  const isLoggedIn = currentUser ? true : false;

  return (
    <Authcontext.Provider value={{ login, signup, logout, isLoggedIn }}>
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
