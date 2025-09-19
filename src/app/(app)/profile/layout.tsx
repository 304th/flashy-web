import { ReactNode } from "react";
import { ProfileHeader } from "@/features/profile/components/profile-header/profile-header";
import { ChannelPageTabs } from "@/features/channels/components/channel-page-tabs/channel-page-tabs";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="relative flex flex-col gap-4 w-full">
      <ProfileHeader />
      <div className="flex w-full justify-center items-center">
        <ChannelPageTabs />
      </div>
      {children}
    </div>
  );
}
