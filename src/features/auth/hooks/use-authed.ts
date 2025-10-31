"use client";

import { useSyncExternalStore } from "react";
import type { User } from "firebase/auth";
import { firebaseAuth } from "@/services/firebase";

export interface Authed {
  user: User | null;
  status: "pending" | "resolved";
}

let authed: Authed = {
  user: null,
  status: "pending",
};

export const useAuthed = () => {
  return useSyncExternalStore<Authed>(
    (callback) => {
      return firebaseAuth.onAuthStateChanged(() => {
        authed.status = "resolved";

        return callback();
      });
    },
    () => {
      if (firebaseAuth.currentUser !== authed.user) {
        authed = {
          user: firebaseAuth.currentUser,
          status: "pending",
        };
      } else if (
        !firebaseAuth.currentUser &&
        !authed.user &&
        authed.status === "pending"
      ) {
        authed = {
          user: null,
          status: "resolved",
        };
      }

      return authed;
    },
    () => authed,
  );
};
