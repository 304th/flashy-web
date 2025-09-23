'use client';

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProfileHeader } from "@/features/profile/components/profile-header/profile-header";
import { ChannelPageTabs } from "@/features/channels/components/channel-page-tabs/channel-page-tabs";
import { usePathname } from "next/navigation";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname()

  return (
    <div className="relative flex flex-col gap-4 w-full">
      <ProfileHeader />
      <div className="flex w-full justify-center items-center">
        <ChannelPageTabs />
      </div>
      <AnimatePresence initial={false}>
        <motion.div key={pathname} className="flex w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
