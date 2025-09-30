"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChannelProvider } from "@/features/profile/components/channel-context/channel-context";
import { ChannelHeader } from "@/features/channels/components/channel-header/channel-header";
import { ChannelPageTabs } from "@/features/channels/components/channel-page-tabs/channel-page-tabs";
import { getTabNameFromPathname } from "@/features/channels/utils/get-tab-name-from-pathname";
import { capitalize } from "media-chrome/utils/utils";
import { useQueryParams } from "@/hooks/use-query-params";
import { ChannelNotFound } from "@/features/channels/components/channel-not-found/channel-not-found";
import { useMe } from "@/features/auth/queries/use-me";

const channelTabs = [
  {
    key: "social",
    label: "Social",
    path: "/channel/social",
  },
  {
    key: "video",
    label: "Video",
    path: "/channel/video",
  },
  {
    key: "about",
    label: "About",
    path: "/channel/about",
  },
];

export default function ChannelLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const channelId = useQueryParams("id");
  const { data: me } = useMe();
  const tabName = getTabNameFromPathname(pathname);

  useEffect(() => {
    if (me?.fbId === channelId) {
      router.push(`/profile/social`);
    }
  }, [me, channelId]);

  if (!channelId) {
    return <ChannelNotFound />;
  }

  return (
    <ChannelProvider channelId={channelId}>
      <div className="relative flex flex-col gap-4 w-full">
        <ChannelHeader />
        <div className="relative flex w-full justify-center items-center">
          <p className="absolute left-0 text-xl text-white font-bold">
            {capitalize(tabName)}
          </p>
          <ChannelPageTabs currentTab={tabName} tabs={channelTabs} />
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
    </ChannelProvider>
  );
}
