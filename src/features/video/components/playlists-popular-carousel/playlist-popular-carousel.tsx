"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Loadable } from "@/components/ui/loadable";
import { CarouselCard } from "@/features/video/components/playlists-popular-carousel/carousel-card";
import { CarouselNavigation } from "@/features/video/components/playlists-popular-carousel/carousel-navigation";
import { usePopularPlaylists } from "@/features/video/queries/use-popular-playlists";

export const PlaylistPopularCarousel = () => {
  const { data: popularPlaylists, query } = usePopularPlaylists();
  const [currentIndex, setCurrentIndex] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Defensive typing to ensure array is Playlist[]
  const playlists: Playlist[] = Array.isArray(popularPlaylists)
    ? (popularPlaylists.filter(Boolean) as Playlist[])
    : [];

  // Safely extend array with wrap-around
  const extendedPlaylists: Playlist[] =
    playlists.length >= 2
      ? [...playlists.slice(-2), ...playlists, ...playlists.slice(0, 2)]
      : playlists;

  const scrollToIndex = (
    index: number,
    behavior: "auto" | "smooth" = "smooth",
  ) => {
    if (scrollContainerRef.current && playlists.length > 0) {
      const container = scrollContainerRef.current;
      const firstCard = container.querySelector("[data-card]") as HTMLElement;
      const styles = getComputedStyle(container);
      const gap = parseFloat(styles.columnGap || styles.gap || "0");
      const cardBodyWidth = firstCard ? firstCard.offsetWidth : 450;
      const stepWidth = cardBodyWidth + gap;
      const containerWidth = container.clientWidth;
      const paddingLeft = parseFloat(styles.paddingLeft || "0");
      const cardCenterOffset = cardBodyWidth / 2;
      const containerCenterOffset = containerWidth / 2;
      // Adjust index for the extended array (add offset for duplicated cards at beginning)
      const extendedIndex = index + 2; // Offset by 2 for the duplicated cards at the beginning
      const scrollPosition =
        extendedIndex * stepWidth +
        cardCenterOffset -
        containerCenterOffset +
        paddingLeft;
      if (behavior === "auto") {
        container.scrollLeft = scrollPosition;
      } else {
        container.scrollTo({ left: scrollPosition, behavior });
      }
    }
    setCurrentIndex(index);
  };

  // Removed scroll event listener since we only want click-based navigation

  useLayoutEffect(() => {
    if (playlists.length > 0) {
      scrollToIndex(1, "auto");
    }
  }, [playlists.length]);

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
      <Loadable queries={[query]} fullScreenForDefaults skipLoadingIfDataPresent fallback={<p>FUCK YOU</p>}>
        {() => (
          <div className="relative">
            {/* Carousel Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-hidden scrollbar-hide px-8"
              style={{
                scrollSnapType: "x mandatory",
                // scrollBehavior: "smooth",
                pointerEvents: "none",
              }}
            >
              {extendedPlaylists.filter(Boolean).map((playlist, index) => {
                if (!playlist) return null;
                // Calculate the original index for active state
                const originalIndex =
                  index >= 2 && index < extendedPlaylists.length - 2
                    ? index - 2
                    : index < 2
                      ? (playlists.length || 0) - 2 + index
                      : index - extendedPlaylists.length + 2;

                // Defensive key: prefer fbId, then _id, then index
                const key =
                  playlist.fbId || playlist._id || `playlist-${index}`;

                return (
                  <div
                    key={key}
                    data-card
                    style={{ scrollSnapAlign: "center", pointerEvents: "auto" }}
                  >
                    <CarouselCard
                      playlist={playlist}
                      isActive={originalIndex === currentIndex}
                      onClick={() => scrollToIndex(originalIndex)}
                    />
                  </div>
                );
              })}
            </div>
            {/* Pagination Dots */}
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
