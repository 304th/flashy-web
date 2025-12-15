"use client";

import { usePathname, useRouter } from "next/navigation";
import { ContentTabs } from "@/components/ui/content-tabs";

type TabId = "agreements" | "favourites";

const tabs: { value: TabId; label: string; href: string }[] = [
  {
    value: "agreements",
    label: "Agreements",
    href: "/monetise/creator-dashboard/agreements",
  },
  {
    value: "favourites",
    label: "Watchlist",
    href: "/monetise/creator-dashboard/favourites",
  },
];

export function CreatorDashboardTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab =
    (tabs.find((tab) => pathname.includes(tab.value))?.value as TabId) ||
    "agreements";

  const handleTabChange = (tabId: TabId) => {
    const tab = tabs.find((t) => t.value === tabId);
    if (tab) {
      router.push(tab.href);
    }
  };

  return (
    <ContentTabs<TabId>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    />
  );
}
