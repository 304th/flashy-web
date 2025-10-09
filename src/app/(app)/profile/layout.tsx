"use client";

import { type ReactNode, Suspense, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ProfileHeader } from "@/features/profile/components/profile-header/profile-header";
import { ChannelPageTabs } from "@/features/channels/components/channel-page-tabs/channel-page-tabs";
import { ChannelContextProvider } from "@/features/profile/components/channel-context/channel-context";
import { useAuthed } from "@/features/auth/hooks/use-authed";
import { useMe } from "@/features/auth/queries/use-me";
import { getTabNameFromPathname } from "@/features/channels/utils/get-tab-name-from-pathname";
import { capitalize } from "media-chrome/utils/utils";

const profileTabs = [
  {
    key: "social",
    label: "Social",
    path: "/profile/social",
  },
  {
    key: "video",
    label: "Video",
    path: "/profile/video",
  },
  {
    key: "about",
    label: "About",
    path: "/profile/about",
  },
  {
    key: "wallet",
    label: "Wallet",
    path: "/profile/wallet",
  },
];

export default function ProfileLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const tabName = getTabNameFromPathname(pathname);
  const authed = useAuthed();
  const { data: channel, query: channelQuery } = useMe();

  useEffect(() => {
    if (authed.status === "resolved" && !authed.user) {
      router.push("/");
    }
  }, [authed]);

  return (
    <ChannelContextProvider
      channelId={authed.user?.uid}
      channel={channel}
      channelQuery={channelQuery}
    >
      <div className="relative flex flex-col gap-4 w-full">
        <ProfileHeader />
        <div className="relative flex w-full justify-center items-center">
          <p className="absolute left-0 text-xl text-white font-bold">
            {capitalize(tabName)}
          </p>
          <Suspense>
            <ChannelPageTabs currentTab={tabName} tabs={profileTabs} />
          </Suspense>
        </div>
        <AnimatePresence initial={false}>
          <motion.div
            key={pathname}
            className="flex w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </ChannelContextProvider>
  );
}
