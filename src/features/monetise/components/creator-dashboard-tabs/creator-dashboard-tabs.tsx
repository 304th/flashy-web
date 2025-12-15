"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "analytics",
    label: "Analytics",
    href: "/monetise/creator-dashboard/analytics",
  },
  {
    id: "agreements",
    label: "Agreements",
    href: "/monetise/creator-dashboard/agreements",
  },
  {
    id: "payments",
    label: "Payments",
    href: "/monetise/creator-dashboard/payments",
  },
  {
    id: "watchlist",
    label: "Watchlist",
    href: "/monetise/creator-dashboard/favourites",
  },
];

export function CreatorDashboardTabs() {
  const pathname = usePathname();

  const activeTab =
    tabs.find((tab) => pathname.includes(tab.id))?.id || "agreements";

  return (
    <div className="flex items-center gap-6">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={cn(
            "text-lg font-medium transition-colors",
            activeTab === tab.id
              ? "text-white"
              : "text-base-700 hover:text-white",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
