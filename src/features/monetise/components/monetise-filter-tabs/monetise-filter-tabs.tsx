"use client";

import { ContentTabs } from "@/components/ui/content-tabs";

type FilterType = "all" | "sponsorship" | "partnership" | "affiliate";

interface MonetiseFilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filters: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sponsorship", label: "Sponsorship" },
  { value: "partnership", label: "Partnership" },
  { value: "affiliate", label: "Affiliate" },
];

export function MonetiseFilterTabs({
  activeFilter,
  onFilterChange,
}: MonetiseFilterTabsProps) {
  return (
    <ContentTabs
      tabs={filters}
      activeTab={activeFilter}
      onTabChange={onFilterChange}
    />
  );
}

export type { FilterType };
