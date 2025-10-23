"use client";
import { app } from "@/firestore/firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { createContext, useContext } from "react";

interface AuthcontextType {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
}

const auth = getAuth(app);
const firebasedb = getFirestore();

const Authcontext = createContext<AuthcontextType | undefined>(undefined);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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

  return (
    <Authcontext.Provider value={{ login, signup, logout }}>
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
