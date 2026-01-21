"use client";

import { useEffect, useRef, useCallback } from "react";

const LAST_CLICKED_POST_KEY = "last-clicked-post";
const SCROLL_CONTAINER_ID = "container";

/**
 * Hook to scroll to the last clicked post when returning to the feed.
 * Much simpler than tracking scroll position - just saves the post ID
 * and scrolls to that element when coming back.
 */
export const useScrollToLastPost = ({
  enabled = true,
  ready = true,
}: {
  enabled?: boolean;
  ready?: boolean;
} = {}) => {
  const hasScrolled = useRef(false);

  // Save clicked post ID
  const saveLastClickedPost = useCallback((postId: string) => {
    try {
      sessionStorage.setItem(LAST_CLICKED_POST_KEY, postId);
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Get and clear last clicked post ID
  const getAndClearLastClickedPost = useCallback((): string | null => {
    try {
      const postId = sessionStorage.getItem(LAST_CLICKED_POST_KEY);
      sessionStorage.removeItem(LAST_CLICKED_POST_KEY);
      return postId;
    } catch {
      return null;
    }
  }, []);

  // Scroll to last clicked post when ready
  useEffect(() => {
    if (!enabled || !ready || hasScrolled.current) return;

    const postId = getAndClearLastClickedPost();
    if (!postId) {
      hasScrolled.current = true;
      return;
    }

    // Find the post element and scroll to it
    const scrollToPost = () => {
      const postElement = document.querySelector(
        `[data-post-id="${postId}"]`,
      ) as HTMLElement;

      if (postElement) {
        const container = document.getElementById(SCROLL_CONTAINER_ID);
        if (container) {
          // Calculate position relative to container
          const containerRect = container.getBoundingClientRect();
          const postRect = postElement.getBoundingClientRect();
          const scrollTop =
            container.scrollTop + postRect.top - containerRect.top - 100; // 100px offset from top

          container.scrollTo({
            top: Math.max(0, scrollTop),
            behavior: "instant",
          });
        }
        hasScrolled.current = true;
        return true;
      }
      return false;
    };

    // Try immediately, then retry a few times
    if (!scrollToPost()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (scrollToPost() || attempts >= 10) {
          clearInterval(interval);
          hasScrolled.current = true;
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [enabled, ready, getAndClearLastClickedPost]);

  // Reset on mount
  useEffect(() => {
    hasScrolled.current = false;
  }, []);

  return {
    saveLastClickedPost,
  };
};

// Keep old export name for compatibility
export const useScrollRestoration = useScrollToLastPost;
