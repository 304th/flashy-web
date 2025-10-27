import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchFilters } from "@/features/video/hooks/use-debounced-search";
import { Switch } from "@/components/ui/switch";

interface VideoSearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "most_viewed", label: "Most Viewed" },
  { value: "least_viewed", label: "Least Viewed" },
  { value: "highest_price", label: "Highest Price" },
  { value: "lowest_price", label: "Lowest Price" },
];

const CATEGORIES = [
  "Entertainment",
  "Education",
  "Gaming",
  "Music",
  "Sports",
  "Technology",
  "Lifestyle",
  "Comedy",
  "News",
  "Other",
];

export const VideoSearchBar = ({
  filters,
  onFiltersChange,
  onClearFilters,
}: VideoSearchBarProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: e.target.value });
  };

  const handleSortChange = (sort: string) => {
    onFiltersChange({ sort });
  };

  const handleOnlyFreeChange = (checked: boolean) => {
    onFiltersChange({ onlyFree: checked });
  };

  const handleCategoryToggle = (category: string) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];
    onFiltersChange({ categories: newCategories });
  };

  const hasActiveFilters =
    filters.search ||
    filters.sort ||
    filters.onlyFree ||
    (filters.categories && filters.categories.length > 0);

  return (
    <div className="flex flex-col w-full gap-3">
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search videos..."
            value={filters.search || ""}
            onChange={handleSearchChange}
            className="pr-10"
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4
              w-4 text-muted-foreground"
          />
        </div>

        <Button
          variant="outline"
          size="xl"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span
              className="bg-primary text-primary-foreground rounded-full px-2
                py-0.5 text-xs"
            >
              {
                [
                  filters.search,
                  filters.sort,
                  filters.onlyFree,
                  filters.categories?.length,
                ].filter(Boolean).length
              }
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="xl"
            onClick={onClearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      {showFilters && (
        <div
          className="flex flex-wrap gap-4 p-4 bg-base-200 rounded-lg border
            border-base-300"
        >
          <div className="flex items-center gap-2">
            <label
              htmlFor="only-free"
              className="text-sm font-medium text-foreground"
            >
              Free videos only:
            </label>
            <Switch.Root
              id="only-free"
              checked={filters.onlyFree || false}
              onCheckedChange={handleOnlyFreeChange}
            />
          </div>
          {/* Categories */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={
                    filters.categories?.includes(category)
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleCategoryToggle(category)}
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-40 justify-between">
                  {SORT_OPTIONS.find((opt) => opt.value === filters.sort)
                    ?.label || "Select sort"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {SORT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={
                      filters.sort === option.value ? "bg-base-400" : ""
                    }
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </div>
  );
};
