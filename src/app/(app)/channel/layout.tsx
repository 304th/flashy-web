"use client";

import {
  type PropsWithChildren,
  type ReactNode,
  Suspense,
  useEffect,
  useState,
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
import {useProfileStream} from "@/features/profile/queries/use-profile-stream";
import {useChannelStream} from "@/features/channels/queries/use-channel-stream";

const channelTabs = [
  {
    key: "streams",
    label: "Streams",
    path: "/channel/streams",
  },
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
    key: "playlists",
    label: "Playlists",
    path: "/channel/playlists",
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
  const channelUsername = useQueryParams("username");
  const { data: me } = useMe();
  const { data: channel, query: channelQuery } = useChannelById(
    channelId ?? channelUsername,
  );
  const { data: stream } = useChannelStream({
    channelId,
  });
  const tabName = getTabNameFromPathname(pathname);
  const [effectiveChannelId, setEffectiveChannelId] = useState<
    string | undefined
  >(channelId ?? channelUsername);

  // Only update effectiveChannelId if channelId not in query, username exists, and fetched channel has fbId
  useEffect(() => {
    if (
      !channelId &&
      channelUsername &&
      channel?.fbId &&
      effectiveChannelId !== channel.fbId
    ) {
      setEffectiveChannelId(channel.fbId);
    }
  }, [channelId, channelUsername, channel?.fbId, effectiveChannelId]);

  useEffect(() => {
    if (me?.fbId && effectiveChannelId && me.fbId === effectiveChannelId) {
      router.push(`/profile/social`);
    }
  }, [me, effectiveChannelId]);

  if (!effectiveChannelId && !channelUsername) {
    return <ChannelNotFound />;
  }

  return (
    <ChannelContextProvider
      channelId={effectiveChannelId}
      channel={channel}
      channelQuery={channelQuery}
      stream={stream}
    >
      <div className="relative flex flex-col gap-4 w-full max-w-page">
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
