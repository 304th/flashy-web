"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface OpportunityCardProps {
  id: string;
  title: string;
  brandName: string;
  brandLogo?: string;
  imageUrl: string;
  category: string;
  type: "sponsorship" | "partnership" | "affiliate";
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function OpportunityCard({
  id,
  title,
  brandName,
  imageUrl,
  category,
  type,
  isWishlisted = false,
  onWishlistToggle,
  onClick,
}: OpportunityCardProps) {
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div
      className="group cursor-pointer"
      onClick={() => onClick?.(id)}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle?.(id);
          }}
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded-md transition-colors",
            isWishlisted
              ? "text-yellow-400"
              : "text-white/70 hover:text-white"
          )}
        >
          <Star
            className="w-4 h-4"
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-white truncate">{title}</h3>
        <p className="text-xs text-base-800">{category}</p>
        <p className="text-xs text-purple-400">{typeLabel}</p>
      </div>
    </div>
  );
}
