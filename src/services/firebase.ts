import config from "@/config";
import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithCustomToken,
  sendPasswordResetEmail,
  confirmPasswordReset,
  type UserCredential,
  type User,
  type Auth,
} from "firebase/auth";

let firebase: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;

const getFirebase = () => {
  if (!firebase && typeof window !== "undefined") {
    firebase = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    });
  }
  return firebase;
};

const getFirebaseAuth = () => {
  if (!firebaseAuth) {
    const app = getFirebase();
    if (app) {
      firebaseAuth = getAuth(app);
    }
  }
  return firebaseAuth;
};

export { getFirebase as firebase, getFirebaseAuth as firebaseAuth };

export const signInWithEmail = async (email: string, password: string) => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not initialized");
  await signInWithEmailAndPassword(auth, email, password);

  return auth.currentUser?.getIdToken();
};

export const signInWithGoogle = async (credential: JwtToken) => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not initialized");
  const GoogleProvider = GoogleAuthProvider.credential(credential);
  await signInWithCredential(auth, GoogleProvider);

  return auth.currentUser?.getIdToken();
};

export const signOut = async () => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not initialized");
  await auth.signOut();
};

export const onAuthStateChanged = async (): Promise<User | null> =>
  new Promise((resolve) => {
    const auth = getFirebaseAuth();
    if (!auth) return resolve(null);
    auth.onAuthStateChanged((user) => resolve(user));
  });

export const signUpUserWithEmail = async (email: string, password: string) => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not initialized");
  return createUserWithEmailAndPassword(auth, email, password);
};

export const sendVerificationEmail = async (
  userCredential: UserCredential,
  redirectUrl: string,
) => {
  await sendEmailVerification(userCredential.user, {
    url: redirectUrl,
  });
};

export const sendSignInLink = async (email: string) => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not initialized");
  return sendSignInLinkToEmail(auth, email, {
    url: `${window.location.origin}?magicLink=true&email=${encodeURIComponent(email)}`,
    handleCodeInApp: true,
    iOS: {
      bundleId: "com.example.ios",
    },
    android: {
      packageName: "com.example.android",
      installApp: true,
      minimumVersion: "12",
    },
  });
};

export const isSignInWithLink = async () => {
  const auth = getFirebaseAuth();
  if (!auth) return false;
  return isSignInWithEmailLink(auth, window.location.href);
};

export const signInWithLMagicLink = async (email: string, link: string) => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not initialized");
  await signInWithEmailLink(auth, email, link);

  return auth.currentUser?.getIdToken();
};

export const signInWithToken = async (token: string) => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not initialized");
  await signInWithCustomToken(auth, token);
};

export const sendPasswordReset = (email: string) => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not initialized");
  return sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}${config.misc.passwordResetRoute}`,
    handleCodeInApp: true,
  });
};

export const confirmNewPassword = (params: {
  oobCode: string;
  newPassword: string;
}) => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not initialized");
  return confirmPasswordReset(auth, params.oobCode, params.newPassword);
};
