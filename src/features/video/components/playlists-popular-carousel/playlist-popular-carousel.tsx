'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loadable } from '@/components/ui/loadable';
import { usePopularPlaylists } from '@/features/video/queries/use-popular-playlists';
import { PlayIcon } from '@/components/ui/icons/play-icon';
import { TrophyIcon } from '@/components/ui/icons/trophy-icon';

interface CarouselCardProps {
  playlist: Playlist;
  isActive: boolean;
}

const CarouselCard = ({ playlist, isActive, onClick }: CarouselCardProps & { onClick: () => void }) => {
  return (
    <div 
      className={`relative flex-shrink-0 w-[450px] md:w-[500px] h-[280px] md:h-[320px] rounded-lg overflow-hidden cursor-pointer transition ${isActive ? '' : 'opacity-70'}`}
      onClick={onClick}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={playlist.image || '/images/placeholder.png'}
          alt={playlist.title}
          fill
          className="object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-4 md:p-6">
        {/* Top section with icon and title */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 md:mb-4">
            <TrophyIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-white text-sm md:text-lg font-bold truncate max-w-[250px] md:max-w-[280px]">
              {playlist.title}
            </h3>
            <PlayIcon className="w-4 h-4 md:w-5 md:h-5 text-white flex-shrink-0" />
          </div>
          
          {/* Tags */}
          <div className="flex gap-2 mb-3 md:mb-4">
            <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 border border-blue-400 text-blue-300 rounded">
              New
            </span>
            <span className="px-2 py-1 text-xs font-medium bg-green-500/20 border border-green-400 text-green-300 rounded">
              Winner
            </span>
          </div>
        </div>

        {/* Bottom section with action button */}
        <div className="flex justify-end">
          <Button 
            variant="default" 
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white border-0 text-xs md:text-sm"
          >
            Watch Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export const PlaylistPopularCarousel = () => {
  const { data: popularPlaylists, query } = usePopularPlaylists();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Create extended array with duplicates for seamless centering
  const extendedPlaylists = popularPlaylists ? [
    ...popularPlaylists.slice(-2), // Last 2 cards at the beginning
    ...popularPlaylists,
    ...popularPlaylists.slice(0, 2) // First 2 cards at the end
  ] : [];

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current && popularPlaylists) {
      const container = scrollContainerRef.current;
      const firstCard = container.querySelector('[data-card]') as HTMLElement;
      const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 466; // 450px + 16px gap on mobile, 500px + 16px on desktop
      
      // Calculate the center position - ensure the selected card is perfectly centered
      const containerWidth = container.offsetWidth;
      const cardCenterOffset = cardWidth / 2;
      const containerCenterOffset = containerWidth / 2;
      
      // Adjust index for the extended array (add offset for duplicated cards at beginning)
      const extendedIndex = index + 2; // Offset by 2 for the duplicated cards at the beginning
      const scrollPosition = (extendedIndex * cardWidth) + cardCenterOffset - containerCenterOffset;
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
    setCurrentIndex(index);
  };


  // Removed scroll event listener since we only want click-based navigation

  // Center the first card on mount
  useEffect(() => {
    if (popularPlaylists && popularPlaylists.length > 0) {
      // Small delay to ensure the container is rendered
      setTimeout(() => {
        scrollToIndex(0);
      }, 100);
    }
  }, [popularPlaylists]);

  // Update scroll position when window resizes to maintain centering
  useEffect(() => {
    const handleResize = () => {
      if (popularPlaylists && popularPlaylists.length > 0) {
        scrollToIndex(currentIndex);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, popularPlaylists]);

  return (
    <div className="w-full">
      <Loadable queries={[query]} fullScreenForDefaults>
        {() => (
          <div className="relative">
            {/* Carousel Container */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-hidden scrollbar-hide pb-4 px-8"
              style={{ 
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                pointerEvents: 'none'
              }}
            >
              {extendedPlaylists.map((playlist, index) => {
                // Calculate the original index for active state
                const originalIndex = index >= 2 && index < extendedPlaylists.length - 2 
                  ? index - 2 
                  : index < 2 
                    ? (popularPlaylists?.length || 0) - 2 + index 
                    : index - extendedPlaylists.length + 2;
                
                return (
                  <div 
                    key={`${playlist.fbId}-${index}`} 
                    data-card 
                    style={{ scrollSnapAlign: 'center', pointerEvents: 'auto' }}
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
              <div className="flex justify-center gap-2">
                {popularPlaylists.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToIndex(index)}
                    className={`w-6 h-[2px] rounded transition-all cursor-pointer duration-200 ${
                      index === currentIndex 
                        ? 'bg-white w-12 h-1' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Loadable>
    </div>
  );
};