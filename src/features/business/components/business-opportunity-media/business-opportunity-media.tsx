"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];

const getFileExtension = (url: string) => {
  const pathname = url.split("?")[0];
  const ext = pathname.split(".").pop()?.toLowerCase();
  return ext ? `.${ext}` : "";
};

const isImageUrl = (url: string) => {
  const ext = getFileExtension(url);
  return IMAGE_EXTENSIONS.includes(ext);
};

const getFileName = (url: string) => {
  const pathname = url.split("?")[0];
  return pathname.split("/").pop() || "File";
};

interface BusinessOpportunityMediaProps {
  mediaAssets?: string[];
  brandName: string;
}

export function BusinessOpportunityMedia({
  mediaAssets = [],
  brandName,
}: BusinessOpportunityMediaProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const allMedia = mediaAssets;

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
        {/*<div*/}
        {/*  className="relative aspect-video rounded-lg overflow-hidden*/}
        {/*    bg-base-200 cursor-pointer max-w-2xl"*/}
        {/*  onClick={() => isImageUrl(allMedia[0]) ? setSelectedIndex(0) : window.open(allMedia[0], "_blank")}*/}
        {/*>*/}
        {/*  {isImageUrl(allMedia[0]) ? (*/}
        {/*    <Image*/}
        {/*      src={allMedia[0]}*/}
        {/*      alt={brandName}*/}
        {/*      fill*/}
        {/*      className="object-cover"*/}
        {/*    />*/}
        {/*  ) : (*/}
        {/*    <div className="w-full h-full flex flex-col items-center justify-center">*/}
        {/*      <FileText className="w-16 h-16 text-base-700 mb-2" />*/}
        {/*      <span className="text-base-700 text-sm truncate max-w-[90%] px-4">*/}
        {/*        {getFileName(allMedia[0])}*/}
        {/*      </span>*/}
        {/*      <span className="text-base-600 text-xs uppercase mt-1">*/}
        {/*        {getFileExtension(allMedia[0]).replace(".", "")}*/}
        {/*      </span>*/}
        {/*      <span className="text-primary text-xs mt-2">Click to open</span>*/}
        {/*    </div>*/}
        {/*  )}*/}
        {/*</div>*/}

        {allMedia.length > 0 && (
          <div className="grid grid-cols-4 gap-2 max-w-2xl">
            {allMedia.map((media, index) => (
              <button
                key={index}
                className="relative rounded-lg overflow-hidden bg-base-300
                  cursor-pointer hover:opacity-80 transition-opacity p-4
                  aspect-square"
                onClick={() => window.open(media, "_blank")}
              >
                {isImageUrl(media) ? (
                  <Image
                    src={media}
                    alt={`${brandName} media ${index + 2}`}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center
                      justify-center p-4 aspect-square"
                  >
                    <FileText className="w-16 h-16 text-base-700 mb-1" />
                    <span
                      className="text-base-700 text-[10px] truncate w-full
                        text-center"
                    >
                      {getFileName(media)}
                    </span>
                    <span className="text-base-600 text-[10px] uppercase">
                      {getFileExtension(media).replace(".", "")}
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
            {isImageUrl(allMedia[selectedIndex]) ? (
              <Image
                src={allMedia[selectedIndex]}
                alt={`${brandName} media ${selectedIndex + 1}`}
                fill
                className="object-contain"
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center
                  justify-center"
              >
                <FileText className="w-24 h-24 text-white mb-4" />
                <span
                  className="text-white text-lg truncate max-w-[90%] px-4 mb-2"
                >
                  {getFileName(allMedia[selectedIndex])}
                </span>
                <span className="text-base-400 text-sm uppercase mb-4">
                  {getFileExtension(allMedia[selectedIndex]).replace(".", "")}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => window.open(allMedia[selectedIndex], "_blank")}
                >
                  Open in new tab
                </Button>
              </div>
            )}
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
