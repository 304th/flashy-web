"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BusinessOpportunityMediaProps {
  mediaAssets?: string[];
  brandLogo?: string;
  brandName: string;
}

export function BusinessOpportunityMedia({
  mediaAssets = [],
  brandLogo,
  brandName,
}: BusinessOpportunityMediaProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const allMedia = brandLogo ? [brandLogo, ...mediaAssets] : mediaAssets;

  if (allMedia.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-base-700">
        No media assets available
      </div>
    );
  }

  const handlePrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + allMedia.length) % allMedia.length);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % allMedia.length);
  };

  return (
    <>
      <div className="space-y-4">
        <div
          className="relative aspect-video rounded-lg overflow-hidden
            bg-base-200 cursor-pointer max-w-2xl"
          onClick={() => setSelectedIndex(0)}
        >
          <Image
            src={allMedia[0]}
            alt={brandName}
            fill
            className="object-cover"
          />
        </div>

        {allMedia.length > 1 && (
          <div className="grid grid-cols-5 gap-2 max-w-2xl">
            {allMedia.slice(1, 6).map((media, index) => (
              <button
                key={index}
                className="relative aspect-video rounded-lg overflow-hidden
                  bg-base-200 cursor-pointer hover:opacity-80
                  transition-opacity"
                onClick={() => setSelectedIndex(index + 1)}
              >
                <Image
                  src={media}
                  alt={`${brandName} media ${index + 2}`}
                  fill
                  className="object-cover"
                />
                {index === 4 && allMedia.length > 6 && (
                  <div
                    className="absolute inset-0 bg-black/60 flex items-center
                      justify-center"
                  >
                    <span className="text-white text-lg font-semibold">
                      +{allMedia.length - 6}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center
            justify-center"
          onClick={() => setSelectedIndex(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(null);
            }}
          >
            <X className="w-6 h-6" />
          </Button>

          {allMedia.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 text-white hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 text-white hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allMedia[selectedIndex]}
              alt={`${brandName} media ${selectedIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {allMedia.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white
                text-sm"
            >
              {selectedIndex + 1} / {allMedia.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
