"use client";

import { Suspense } from "react";
import { useChannelById } from "@/features/channels/queries/use-channel-by-id";
import { useQueryParams } from "@/hooks/use-query-params";
import { ChannelNotFound } from "@/features/channels/components/channel-not-found/channel-not-found";
import { ChannelAboutInfo } from "@/features/channels/components/channel-about-info/channel-about-info";

export default function ChannelAboutPage() {
  return (
    <Suspense>
      <ChannelByIdAboutPage />
    </Suspense>
  );
}

const ChannelByIdAboutPage = () => {
  const id = useQueryParams("id");
  const { data: channel } = useChannelById(id);

  if (!id) {
    return <ChannelNotFound />;
  }

  if (!channel) {
    return null;
  }

  return <ChannelAboutInfo channel={channel} />;
};
