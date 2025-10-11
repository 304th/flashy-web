import { type PropsWithChildren } from "react";
import { type UseInfiniteQueryResult } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner/spinner";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

export const InfiniteFeed = <TData, TError>({ query, children }: PropsWithChildren<{ query: UseInfiniteQueryResult<TData, TError> }>) => {
  const { hasNextPage, isFetchingNextPage, data } = query;

  const scrollRef = useInfiniteScroll({
    query
  });

  return <>
    {children}
    <div ref={scrollRef} className="absolute bottom-1/6" />
    {hasNextPage && isFetchingNextPage && <div className="flex w-full justify-center">
      <Spinner />
    </div>}
    {!hasNextPage && !isFetchingNextPage && (data as any)?.length > 0 && <div className="flex w-full justify-center">
      <p className="text-sm text-base-600">You've reached the end of your feed!</p>
    </div>}
  </>
}