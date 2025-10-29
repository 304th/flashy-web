"use client";

import { useCallback } from "react";
import { useAuthed } from "@/features/auth/hooks/use-authed";
import { useModals } from "@/hooks/use-modals";

type AuthModalType = "LoginModal" | "SignupModal";

export interface ProtectedActionOptions {
  /**
   * Which auth modal to open when unauthenticated. Defaults to Login.
   */
  modal?: AuthModalType;
}

/**
 * Wrap protected actions (like, comment, subscribe, etc). If user is not
 * authenticated, opens the Sign In/Up modal instead of running the action.
 */
export const useProtectedAction = (options?: ProtectedActionOptions) => {
  const { user, status } = useAuthed();
  const { openModal } = useModals();

  const openAuthModal = useCallback(() => {
    const type: AuthModalType = options?.modal ?? "LoginModal";
    openModal(type);
  }, [openModal, options?.modal]);

  /**
   * Returns a function that will either run the provided action when the user
   * is authenticated, or open the auth modal otherwise.
   */
  const requireAuth = useCallback(
    <Args extends unknown[], R>(action: (...args: Args) => R) => {
      return (...args: Args): R | void => {
        const isResolved = status === "resolved";
        const isAuthenticated = Boolean(user?.uid);

        if (!isResolved || !isAuthenticated) {
          openAuthModal();
          return;
        }

        return action(...args);
      };
    },
    [openAuthModal, status, user?.uid],
  );

  return {
    /** True if the auth state is resolved and a user is present. */
    isAuthenticated: status === "resolved" && Boolean(user?.uid),
    /** Manually open the auth modal. */
    openAuthModal,
    /** Wrap an action so it only runs when authenticated. */
    requireAuth,
  } as const;
};
