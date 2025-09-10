"use client";

import { useSyncExternalStore } from "react";
import { firebaseAuth } from "@/services/firebase";

export const useAuthedUser = () => {
  return useSyncExternalStore(
    (callback) => {
      return firebaseAuth.onAuthStateChanged(callback);
    },
    () => firebaseAuth.currentUser,
    () => null,
  );
};
