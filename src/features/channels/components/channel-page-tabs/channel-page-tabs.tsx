"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TabMenu } from "@/components/ui/tabs/tabs";

const tabs = [
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

export const ChannelPageTabs = () => {
  const pathname = usePathname();
  const defaultTab =
    tabs.find((tab) => tab.path === pathname)?.label || "wallet";

  return (
    <TabMenu.Root
      defaultValue={defaultTab}
      className="border p-1 rounded-[100px] w-fit bg-base-200 overflow-hidden"
    >
      <TabMenu.List className="gap-1 h-10 overflow-hidden">
        {tabs.map(({ key, label, path }) => (
          <TabMenu.Trigger
            key={key}
            value={label}
            className="cursor-pointer z-1"
          >
            <Link href={path} className="w-full h-full px-4 flex items-center">
              {label}
            </Link>
          </TabMenu.Trigger>
        ))}
      </TabMenu.List>
    </TabMenu.Root>
  );
};
