"use client";

import { cn } from "@/lib/utils";

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
    <div className="flex items-center gap-1">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
            activeFilter === filter.value
              ? "text-white"
              : "text-base-800 hover:text-white"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export type { FilterType };
