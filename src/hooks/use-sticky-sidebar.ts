import { useEffect, useRef, useState, useCallback } from "react";

interface UseStickySidebarOptions {
  /** Distance from top when stuck (e.g. header height) */
  topOffset?: number;
  /** Optional: scroll container (if not window) */
  containerRef?: React.RefObject<HTMLElement>;
  containerId?: string;
}

interface StickyStyle {
  position: "static" | "relative" | "fixed" | "sticky";
  top: number;
}

/**
 * Twitter/X-style sticky sidebar hook
 * - Sticks to top when scrolling down
 * - Returns to natural flow when scrolling up
 */
export function useStickySidebar({
  topOffset = 0,
  containerRef,
  containerId,
}: UseStickySidebarOptions = {}): {
  ref: (node: HTMLElement | null) => void;
} & StickyStyle {
  const sidebarRef = useRef<HTMLElement | null>(null);
  const [style, setStyle] = useState<StickyStyle>({
    position: "relative",
    top: 0,
  });

  const prevScrollY = useRef<number>(0);
  const initialOffsetTop = useRef<number>(0);

  const updatePosition = useCallback(() => {
    const sidebar = sidebarRef.current;

    if (!sidebar) {
      return;
    }

    const scrollElement = containerId ? document.getElementById(containerId) : (containerRef?.current || window);
    const isWindow = scrollElement === window;

    const scrollY = isWindow
      ? window.pageYOffset || document.documentElement.scrollTop
      : (scrollElement as HTMLElement).scrollTop;

    const rect = sidebar.getBoundingClientRect();
    const sidebarHeight = sidebar.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Capture initial offsetTop only once
    if (initialOffsetTop.current === 0) {
      initialOffsetTop.current = sidebar.offsetTop;
    }

    // Early exit: sidebar completely above or below viewport
    if (rect.bottom < -100 || rect.top > viewportHeight + 100) {
      setStyle({ position: "relative", top: 0 });
      prevScrollY.current = scrollY;
      return;
    }

    const scrollingDown = scrollY > prevScrollY.current;
    const scrollingUp = scrollY < prevScrollY.current;

    // If sidebar is shorter than viewport → just use sticky
    if (sidebarHeight <= viewportHeight) {
      setStyle({ position: "sticky", top: topOffset });
      prevScrollY.current = scrollY;
      return;
    }

    // Main Twitter/X logic
    if (scrollingDown) {
      // When top of sidebar reaches the sticky point → fix it
      if (rect.top <= topOffset) {
        setStyle({ position: "fixed", top: topOffset });
      }
    }

    if (scrollingUp) {
      // Calculate how far we've scrolled past the natural position
      const distanceFromNatural =
        scrollY - (initialOffsetTop.current - topOffset);

      if (distanceFromNatural <= 0) {
        // We're back near the natural position → return to flow
        setStyle({ position: "relative", top: 0 });
      } else {
        // Still "stuck" from previous scroll down
        setStyle({ position: "fixed", top: topOffset });
      }
    }

    prevScrollY.current = scrollY;
  }, [topOffset, containerRef, containerId]);

  const ref = useCallback((node: HTMLElement | null) => {
    sidebarRef.current = node;
  }, []);

  useEffect(() => {
    const scrollEl = containerRef?.current || window;

    const handleScroll = () => requestAnimationFrame(updatePosition);

    const target = containerId ? document.getElementById(containerId) : scrollEl === window ? window : scrollEl;
    target!.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updatePosition);

    // Initial position
    requestAnimationFrame(updatePosition);

    return () => {
      target!.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updatePosition);
    };
  }, [updatePosition, containerRef, containerId]);

  return { ref, ...style };
}
