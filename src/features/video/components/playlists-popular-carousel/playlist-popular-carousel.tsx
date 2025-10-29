"use client";

import {useState, useRef, useEffect, useLayoutEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loadable } from "@/components/ui/loadable";
import { CarouselCard } from "@/features/video/components/playlists-popular-carousel/carousel-card";
import { CarouselNavigation } from "@/features/video/components/playlists-popular-carousel/carousel-navigation";
import { usePopularPlaylists } from "@/features/video/queries/use-popular-playlists";

export const PlaylistPopularCarousel = () => {
  const { data: popularPlaylists, query } = usePopularPlaylists();
  const [currentIndex, setCurrentIndex] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Create extended array with duplicates for seamless centering
  const extendedPlaylists = popularPlaylists
    ? [
        ...popularPlaylists.slice(-2), // Last 2 cards at the beginning
        ...popularPlaylists,
        ...popularPlaylists.slice(0, 2), // First 2 cards at the end
      ]
    : [];

  const scrollToIndex = (index: number, behavior: "auto" | "smooth" = "smooth") => {
    if (scrollContainerRef.current && popularPlaylists) {
      const container = scrollContainerRef.current;
      const firstCard = container.querySelector("[data-card]") as HTMLElement;
      const styles = getComputedStyle(container);
      const gap = parseFloat(styles.columnGap || styles.gap || "0");
      const cardBodyWidth = firstCard ? firstCard.offsetWidth : 450;
      const stepWidth = cardBodyWidth + gap;

      // Calculate the center position - ensure the selected card is perfectly centered
      const containerWidth = container.clientWidth;
      const paddingLeft = parseFloat(styles.paddingLeft || "0");
      const cardCenterOffset = cardBodyWidth / 2;
      const containerCenterOffset = containerWidth / 2;

      // Adjust index for the extended array (add offset for duplicated cards at beginning)
      const extendedIndex = index + 2; // Offset by 2 for the duplicated cards at the beginning
      const scrollPosition = extendedIndex * stepWidth + cardCenterOffset - containerCenterOffset + paddingLeft;

      if (behavior === "auto") {
        container.scrollLeft = scrollPosition;
      } else {
        container.scrollTo({ left: scrollPosition, behavior });
      }
    }
    setCurrentIndex(index);
  };

  // Removed scroll event listener since we only want click-based navigation

  // Initial centering after DOM mounts but before paint
  useLayoutEffect(() => {
    if (popularPlaylists && popularPlaylists.length > 0) {
      scrollToIndex(1, "auto");
    }
  }, [popularPlaylists]);

  // Update scroll position when window resizes to maintain centering
  useEffect(() => {
    const handleResize = () => {
      if (popularPlaylists && popularPlaylists.length > 0) {
        scrollToIndex(currentIndex);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex, popularPlaylists]);

  return (
    <div className="w-full">
      <Loadable queries={[query]} fullScreenForDefaults>
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
              {extendedPlaylists.map((playlist, index) => {
                // Calculate the original index for active state
                const originalIndex =
                  index >= 2 && index < extendedPlaylists.length - 2
                    ? index - 2
                    : index < 2
                      ? (popularPlaylists?.length || 0) - 2 + index
                      : index - extendedPlaylists.length + 2;

                return (
                  <div
                    key={`${playlist.fbId}-${index}`}
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
            {popularPlaylists && popularPlaylists.length > 1 && (
              <CarouselNavigation items={popularPlaylists} currentIndex={currentIndex} onScroll={(index) => scrollToIndex(index)} />
            )}
          </div>
        )}
      </Loadable>
    </div>
  );
};
