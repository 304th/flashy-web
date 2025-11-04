"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Loadable } from "@/components/ui/loadable";
import { CarouselCard } from "@/features/video/components/playlists-popular-carousel/carousel-card";
import { CarouselNavigation } from "@/features/video/components/playlists-popular-carousel/carousel-navigation";
import { usePopularPlaylists } from "@/features/video/queries/use-popular-playlists";

// Constants
const WRAP_AROUND_OFFSET = 2;
const DEFAULT_CARD_WIDTH = 450;
const INITIAL_INDEX = 1;

// Types
type ScrollBehavior = "auto" | "smooth";

interface ScrollCalculation {
  gap: number;
  cardWidth: number;
  stepWidth: number;
  containerWidth: number;
  paddingLeft: number;
  cardCenterOffset: number;
  containerCenterOffset: number;
}

// Helper Functions
const normalizePlaylistsArray = (data: unknown): Playlist[] => {
  return Array.isArray(data) ? (data.filter(Boolean) as Playlist[]) : [];
};

const createExtendedPlaylists = (playlists: Playlist[]): Playlist[] => {
  if (playlists.length < 2) {
    return playlists;
  }
  return [
    ...playlists.slice(-WRAP_AROUND_OFFSET),
    ...playlists,
    ...playlists.slice(0, WRAP_AROUND_OFFSET),
  ];
};

const calculateScrollMetrics = (
  container: HTMLElement,
  firstCard: HTMLElement | null,
): ScrollCalculation => {
  const styles = getComputedStyle(container);
  const gap = parseFloat(styles.columnGap || styles.gap || "0");
  const cardWidth = firstCard ? firstCard.offsetWidth : DEFAULT_CARD_WIDTH;
  const stepWidth = cardWidth + gap;
  const containerWidth = container.clientWidth;
  const paddingLeft = parseFloat(styles.paddingLeft || "0");
  const cardCenterOffset = cardWidth / 2;
  const containerCenterOffset = containerWidth / 2;

  return {
    gap,
    cardWidth,
    stepWidth,
    containerWidth,
    paddingLeft,
    cardCenterOffset,
    containerCenterOffset,
  };
};

const calculateScrollPosition = (
  index: number,
  metrics: ScrollCalculation,
): number => {
  const extendedIndex = index + WRAP_AROUND_OFFSET;
  return (
    extendedIndex * metrics.stepWidth +
    metrics.cardCenterOffset -
    metrics.containerCenterOffset +
    metrics.paddingLeft
  );
};

const calculateOriginalIndex = (
  extendedIndex: number,
  extendedLength: number,
  originalLength: number,
): number => {
  const isInMiddleSection =
    extendedIndex >= WRAP_AROUND_OFFSET &&
    extendedIndex < extendedLength - WRAP_AROUND_OFFSET;

  if (isInMiddleSection) {
    return extendedIndex - WRAP_AROUND_OFFSET;
  }

  if (extendedIndex < WRAP_AROUND_OFFSET) {
    return originalLength - WRAP_AROUND_OFFSET + extendedIndex;
  }

  return extendedIndex - extendedLength + WRAP_AROUND_OFFSET;
};

const getPlaylistKey = (playlist: Playlist, index: number): string => {
  return playlist.fbId || playlist._id || `playlist-${index}`;
};

// Sub-components
interface CarouselCardWrapperProps {
  playlist: Playlist;
  isActive: boolean;
  keyValue: string;
  onClick: () => void;
}

const CarouselCardWrapper = ({
  playlist,
  isActive,
  keyValue,
  onClick,
}: CarouselCardWrapperProps) => (
  <div
    key={keyValue}
    data-card
    style={{ scrollSnapAlign: "center", pointerEvents: "auto" }}
  >
    <CarouselCard playlist={playlist} isActive={isActive} onClick={onClick} />
  </div>
);

// Main Component
export const PlaylistPopularCarousel = () => {
  const { data: popularPlaylists, query } = usePopularPlaylists();
  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const playlists = normalizePlaylistsArray(popularPlaylists);
  const extendedPlaylists = createExtendedPlaylists(playlists);

  const scrollToIndex = (
    index: number,
    behavior: ScrollBehavior = "smooth",
  ) => {
    const container = scrollContainerRef.current;
    if (!container || playlists.length === 0) {
      return;
    }

    const firstCard = container.querySelector(
      "[data-card]",
    ) as HTMLElement | null;
    const metrics = calculateScrollMetrics(container, firstCard);
    const scrollPosition = calculateScrollPosition(index, metrics);

    if (behavior === "auto") {
      container.scrollLeft = scrollPosition;
    } else {
      container.scrollTo({ left: scrollPosition, behavior });
    }

    setCurrentIndex(index);
  };

  // Initialize carousel position
  useLayoutEffect(() => {
    if (playlists.length > 0) {
      scrollToIndex(INITIAL_INDEX, "auto");
    }
  }, [playlists.length]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (playlists.length > 0) {
        scrollToIndex(currentIndex);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex, playlists.length]);

  return (
    <div className="w-full">
      <Loadable
        queries={[query]}
        fullScreenForDefaults
        skipLoadingIfDataPresent
      >
        {() => (
          <div className="relative">
            {/* Carousel Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-hidden scrollbar-hide px-8"
              style={{
                scrollSnapType: "x mandatory",
                pointerEvents: "none",
              }}
            >
              {extendedPlaylists.filter(Boolean).map((playlist, index) => {
                if (!playlist) return null;

                const originalIndex = calculateOriginalIndex(
                  index,
                  extendedPlaylists.length,
                  playlists.length,
                );

                const keyValue = getPlaylistKey(playlist, index);

                return (
                  <CarouselCardWrapper
                    key={keyValue}
                    playlist={playlist}
                    isActive={originalIndex === currentIndex}
                    keyValue={keyValue}
                    onClick={() => scrollToIndex(originalIndex)}
                  />
                );
              })}
            </div>

            {/* Pagination Navigation */}
            {playlists.length > 1 && (
              <CarouselNavigation
                items={playlists}
                currentIndex={currentIndex}
                onScroll={scrollToIndex}
              />
            )}
          </div>
        )}
      </Loadable>
    </div>
  );
};
