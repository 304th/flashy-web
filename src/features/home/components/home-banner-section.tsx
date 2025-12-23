"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCurrentHomeBanner } from "@/features/home/queries/use-current-home-banner";

export const HomeBannerSection = () => {
  const [banner, bannerQuery] = useCurrentHomeBanner();

  if (bannerQuery.isLoading || !banner) {
    return null;
  }

  return <AnimatePresence>
    {
      banner && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex w-full h-[240px] rounded-lg overflow-hidden group"
        >
          {/* Background Image */}
          <img
            src={banner.bannerImage}
            alt={banner.callToActionTitle}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-101"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

          {/* Content */}
          <div className="relative flex flex-col w-full justify-center items-center gap-2 px-6 z-10">
            {banner.logoIcon && (
              <img
                src={banner.logoIcon}
                alt="Logo"
                className="w-32 h-32 object-contain rounded"
              />
            )}
            <div className="flex flex-col gap-1">
              <Link href={banner.link} target="_blank" rel="noopener noreferrer">
                <Button>
                  {banner.callToActionTitle}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )
    }
  </AnimatePresence>
};
