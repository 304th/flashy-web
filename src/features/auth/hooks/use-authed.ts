"use client";

import { useSyncExternalStore } from "react";
import { type User, onAuthStateChanged, type Unsubscribe } from "firebase/auth";
import { firebaseAuth } from "@/services/firebase";

export interface Authed {
  user: User | null;
  status: "pending" | "resolved";
}

/* ------------------------------------------------------------------ */
/* 1. The *external* store – lives outside of React                     */
/* ------------------------------------------------------------------ */
let current: Authed = { user: null, status: "pending" };
const listeners = new Set<() => void>();

// Helper that notifies *every* listener that the data may have changed
const notify = () => listeners.forEach((cb) => cb());

// Initialise the store **once** when the module is first imported
let unsubscribeFirebase: Unsubscribe | null = null;

if (typeof window !== "undefined") {
  unsubscribeFirebase = onAuthStateChanged(firebaseAuth, (user) => {
    current = { user, status: "resolved" };
    notify(); // <-- THIS IS THE MISSING CALL
  });
}

/* ------------------------------------------------------------------ */
/* 2. Public API for components                                         */
/* ------------------------------------------------------------------ */
export const useAuthed = (): Authed => {
  return useSyncExternalStore<Authed>(
    // ---- subscribe ----------------------------------------------------
    (onChange) => {
      listeners.add(onChange);
      return () => {
        listeners.delete(onChange);
      };
    },

    // ---- getSnapshot (client) -----------------------------------------
    () => current,

    // ---- getServerSnapshot (SSR) --------------------------------------
    // During SSR we have no auth session → always return the initial shape
    () => ({ user: null, status: "pending" }),
  );
};

/* ------------------------------------------------------------------ */
/* 3. Optional: clean-up when the app unmounts (Next.js pages)         */
/* ------------------------------------------------------------------ */
export const cleanupAuthStore = () => {
  unsubscribeFirebase?.();
  listeners.clear();
};
