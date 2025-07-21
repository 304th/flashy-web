import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const firebase = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
});

export const firebaseAuth = getAuth(firebase);

export const signInWithEmail = async (email: string, password: string) => {
  await signInWithEmailAndPassword(firebaseAuth, email, password);

  return firebaseAuth.currentUser?.getIdToken();
};

export const signInWithGoogle = async (credential: JwtToken) => {
  const GoogleProvider = GoogleAuthProvider.credential(credential);
  await signInWithCredential(firebaseAuth, GoogleProvider);

  return firebaseAuth.currentUser?.getIdToken();
};

export const signOut = async () => {
  await firebaseAuth.signOut();
};

export const onAuthStateChanged = async () =>
  new Promise((resolve) => {
    firebaseAuth.onAuthStateChanged(resolve);
  });
