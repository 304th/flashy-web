import { useEffect, useRef } from "react";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";

interface InfiniteScrollOptions<TData, TError> {
  query: UseInfiniteQueryResult<TData, TError>;
  threshold?: number;
}

export const useInfiniteScroll = <TData, TError>({
  query,
  threshold = 0.7,
}: InfiniteScrollOptions<TData, TError>) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          query.hasNextPage &&
          !query.isFetchingNextPage
        ) {
          void query.fetchNextPage();
        }
      },
      { threshold },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [query.hasNextPage, query.isFetchingNextPage, threshold]);

  return loadMoreRef;
};
