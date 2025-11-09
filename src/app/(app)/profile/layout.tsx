"use client";

import { type ReactNode, Suspense } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ProfileHeader } from "@/features/profile/components/profile-header/profile-header";
import { ChannelPageTabs } from "@/features/channels/components/channel-page-tabs/channel-page-tabs";
import { ChannelContextProvider } from "@/features/profile/components/channel-context/channel-context";
import { useAuthed } from "@/features/auth/hooks/use-authed";
import { useMe } from "@/features/auth/queries/use-me";
import { getTabNameFromPathname } from "@/features/channels/utils/get-tab-name-from-pathname";
import { useProtectedRedirect } from "@/features/auth/hooks/use-protected-redirect";
import { capitalize } from "media-chrome/utils/utils";
import { useProfileStream } from "@/features/profile/queries/use-profile-stream";

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
    key: "playlists",
    label: "Playlists",
    path: "/profile/playlists",
  },
  {
    key: "streams",
    label: "Streams",
    path: "/profile/streams",
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
  useProtectedRedirect();
  const pathname = usePathname();
  const tabName = getTabNameFromPathname(pathname);
  const authed = useAuthed();
  const { data: channel, query: channelQuery } = useMe();
  const { data: stream } = useProfileStream();

  return (
    <ChannelContextProvider
      channelId={authed.user?.uid}
      channel={channel}
      channelQuery={channelQuery}
      stream={stream}
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
