import { initializeApp } from "firebase/app";
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
  type UserCredential,
  type User,
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

export const onAuthStateChanged = async (): Promise<User | null> =>
  new Promise((resolve) => {
    firebaseAuth.onAuthStateChanged((user, ) => resolve(user));
  });

export const signUpUserWithEmail = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(firebaseAuth, email, password);
}

export const sendVerificationEmail = async (userCredential: UserCredential, redirectUrl: string) => {
  await sendEmailVerification(userCredential.user, {
    url: redirectUrl,
  });
}

export const sendSignInLink = async (email: string) =>
  sendSignInLinkToEmail(firebaseAuth, email, {
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

export const isSignInWithLink = async () => isSignInWithEmailLink(firebaseAuth, window.location.href)
export const signInWithLMagicLink = async (email: string, link: string) => {
  await signInWithEmailLink(firebaseAuth, email, link);

  return firebaseAuth.currentUser?.getIdToken();
}

export const signInWithToken = async (token: string) => {
  await signInWithCustomToken(firebaseAuth, token)
}