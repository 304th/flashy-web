"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TabMenu } from "@/components/ui/tabs/tabs";

export const ChannelPageTabs = ({
  currentTab,
  tabs,
}: {
  currentTab: string;
  tabs: { key: string; label: string; path: string }[];
}) => {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const defaultTab =
    tabs.find((tab) => tab.key === currentTab)?.label || "wallet";

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
            className="cursor-pointer z-1 hover:text-white hover:-translate-y-[0.5px]"
          >
            <Link
              href={queryString ? [path, queryString].join("?") : path}
              className="w-full h-full px-4 flex items-center"
            >
              {label}
            </Link>
          </TabMenu.Trigger>
        ))}
      </TabMenu.List>
    </TabMenu.Root>
  );
};
