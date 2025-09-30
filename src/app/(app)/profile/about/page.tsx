"use client";

import { useMe } from "@/features/auth/queries/use-me";
import { ChannelAboutInfo } from "@/features/channels/components/channel-about-info/channel-about-info";

export default function ProfileSocialPage() {
  const { data: me } = useMe();

  if (!me) {
    return null;
  }

  return <ChannelAboutInfo channel={me} />;
}
