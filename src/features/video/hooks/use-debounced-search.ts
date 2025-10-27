import { useState, useEffect, useCallback } from "react";

export interface SearchFilters {
  search?: string;
  sort?: string;
  onlyFree?: boolean;
  categories?: string[];
}

export const useDebouncedSearch = (delay: number = 300) => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [debouncedFilters, setDebouncedFilters] = useState<SearchFilters>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, delay);

    return () => clearTimeout(timer);
  }, [filters, delay]);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setDebouncedFilters({});
  }, []);

  return {
    filters,
    debouncedFilters,
    updateFilters,
    clearFilters,
  };
};


