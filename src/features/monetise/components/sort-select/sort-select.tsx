"use client";

import { Select } from "@/components/ui/select";

type SortOption = "a-z" | "z-a" | "newest" | "endDate";

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "a-z", label: "A/Z" },
  { value: "z-a", label: "Z/A" },
  { value: "newest", label: "Newest" },
  { value: "endDate", label: "End Date" },
];

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-base-800">Sort By:</span>
      <Select.Root
        value={value}
        onValueChange={(val) => onChange(val as SortOption)}
        size="xsmall"
        variant="compact"
      >
        {sortOptions.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Root>
    </div>
  );
}

export type { SortOption };
