'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
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
  const defaultTab = tabs.find(tab => tab.path === pathname)?.label || "wallet";

  return (
    <TabMenu.Root defaultValue={defaultTab} className="border p-1 rounded-[100px] w-fit bg-base-200 overflow-hidden">
      <TabMenu.List className="gap-1 h-10 ">
        {tabs.map(({ key, label, path }) => (
            <TabMenu.Trigger key={key} value={label} className="px-4 cursor-pointer z-1">
              <Link href={path}>
                {label}
              </Link>
            </TabMenu.Trigger>
        ))}
      </TabMenu.List>
    </TabMenu.Root>
  );
};
