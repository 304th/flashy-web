import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SearchFilters } from "@/features/video/hooks/use-debounced-search";
import { Switch } from "@/components/ui/switch";

interface VideoSearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
}

const SORT_OPTIONS = [
  { value: "Newest", label: "Newest" },
  { value: "Oldest", label: "Oldest" },
  { value: "Most Liked", label: "Most Liked" },
  { value: "Popular", label: "Popular" },
];

const CATEGORIES = [
  { value: "action", label: "Action" },
  { value: "fantasy", label: "Fantasy" },
  { value: "funny", label: "Funny" },
  { value: "horror", label: "Horror" },
  { value: "romantic", label: "Romantic" },
  { value: "drama", label: "Drama" },
  { value: "scifi", label: "Scifi" },
  { value: "games", label: "Games" },
  { value: "poetry", label: "Poetry" },
  { value: "vlog", label: "Vlog" },
  { value: "music", label: "Music" },
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
      {showFilters && (
        <div
          className="flex flex-wrap gap-4 p-4 bg-base-200 rounded-lg border
            border-base-300"
        >
          <div className="flex w-full justify-between">
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
            <div className="flex flex-col gap-2">
              <Select.Root
                defaultValue={SORT_OPTIONS[0].value}
                value={filters.sort}
                placeholder="Select your favorite fruit..."
                onValueChange={handleSortChange}
              >
                {SORT_OPTIONS.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Root>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium text-foreground">Categories:</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category.value}
                  variant={
                    filters.categories?.includes(category.value)
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleCategoryToggle(category.value)}
                  className="text-xs"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
