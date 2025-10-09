"use client";

import {
  type PropsWithChildren,
  type ReactNode,
  Suspense,
  useEffect,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChannelContextProvider } from "@/features/profile/components/channel-context/channel-context";
import { ChannelHeader } from "@/features/channels/components/channel-header/channel-header";
import { ChannelPageTabs } from "@/features/channels/components/channel-page-tabs/channel-page-tabs";
import { getTabNameFromPathname } from "@/features/channels/utils/get-tab-name-from-pathname";
import { capitalize } from "media-chrome/utils/utils";
import { useQueryParams } from "@/hooks/use-query-params";
import { ChannelNotFound } from "@/features/channels/components/channel-not-found/channel-not-found";
import { useMe } from "@/features/auth/queries/use-me";
import { useChannelById } from "@/features/channels/queries/use-channel-by-id";

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
  return (
    <Suspense>
      <ChannelLayoutComponent>{children}</ChannelLayoutComponent>
    </Suspense>
  );
}

const ChannelLayoutComponent = ({ children }: PropsWithChildren<{}>) => {
  const router = useRouter();
  const pathname = usePathname();
  const channelId = useQueryParams("id");
  const { data: me } = useMe();
  const tabName = getTabNameFromPathname(pathname);
  const { data: channel, query: channelQuery } = useChannelById(channelId);

  useEffect(() => {
    if (me?.fbId === channelId) {
      router.push(`/profile/social`);
    }
  }, [me, channelId]);

  if (!channelId) {
    return <ChannelNotFound />;
  }

  return (
    <ChannelContextProvider
      channelId={channelId}
      channel={channel}
      channelQuery={channelQuery}
    >
      <div className="relative flex flex-col gap-4 w-full">
        <ChannelHeader />
        <div className="relative flex w-full justify-center items-center">
          <p className="absolute left-0 text-xl text-white font-bold">
            {capitalize(tabName)}
          </p>
          <Suspense>
            <ChannelPageTabs currentTab={tabName} tabs={channelTabs} />
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
};
