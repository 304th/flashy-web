import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type Collection,
  CollectionOptimisticMutations,
  LiveOptimisticUpdater,
  liveRegistry,
} from "@/lib/query-toolkit-v2";

type LocalStorageCacheOptions<T> = {
  enabled?: boolean;
  /** Optional prefix for the storage key */
  keyPrefix?: string;
  /** Optional semantic version for cache invalidation */
  version?: number;
  /** Optional TTL in milliseconds. If expired, cache is ignored */
  ttlMs?: number;
  /** Custom comparator to detect changes */
  compare?: (a: T | undefined, b: T | undefined) => boolean;
};

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function makeCacheKey(
  prefix: string | undefined,
  name: string,
  queryKey: unknown[],
  version: number | undefined,
) {
  const v = version ?? 1;
  const p = prefix ?? "qtv2";
  // stringify queryKey defensively; fall back to toString on failure
  let qk = "";
  try {
    qk = JSON.stringify(queryKey);
  } catch {
    qk = String(queryKey);
  }
  return `${p}:${name}:v${v}:${qk}`;
}

function loadFromStorage<T>(key: string, ttlMs?: number): T | undefined {
  if (!isBrowser()) return undefined;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { data: T; ts?: number };
    if (ttlMs && parsed.ts && Date.now() - parsed.ts > ttlMs) {
      return undefined;
    }
    return parsed.data;
  } catch {
    return undefined;
  }
}

function saveToStorage<T>(key: string, data: T) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // ignore storage errors (quota, serialization, etc.)
  }
}

export const useLiveQuery = <Entity, Params = undefined>({
  queryKey,
  collection,
  options,
  getParams,
}: {
  queryKey: unknown[];
  collection: Collection<Entity, Params>;
  options?: (Record<string, any> & {
    localStorageCache?: LocalStorageCacheOptions<Entity[]>;
  });
  getParams?: () => Params;
}) => {
  const queryClient = useQueryClient();

  const cacheCfg: LocalStorageCacheOptions<Entity[]> | undefined =
    options?.localStorageCache;

  const cacheEnabled = cacheCfg?.enabled === true;
  const cacheKey = cacheEnabled
    ? makeCacheKey(
        cacheCfg?.keyPrefix,
        collection.getName(),
        queryKey,
        cacheCfg?.version,
      )
    : undefined;

  const cachedData: Entity[] | undefined = cacheEnabled && cacheKey
    ? loadFromStorage<Entity[]>(cacheKey, cacheCfg?.ttlMs)
    : undefined;

  // Do not pass our custom option into React Query
  const { localStorageCache: _omit, ...reactQueryOptions } = options ?? {};

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const params = getParams ? getParams() : undefined;

      return await collection.readData(params as any); //FIXME: fix types
    },
    // If we have cached data, surface it immediately and refetch in background
    initialData: cachedData,
    // Ensure background refetch when initialData is present unless user overrode
    staleTime:
      cachedData !== undefined
        ? reactQueryOptions?.staleTime ?? 0
        : reactQueryOptions?.staleTime,
    ...reactQueryOptions,
  });

  const optimisticUpdates = useMemo(
    () =>
      new CollectionOptimisticMutations<Entity, Entity[]>(
        queryClient,
        queryKey,
        collection as any,
        new LiveOptimisticUpdater<Entity>(collection),
      ),
    [queryClient, queryKey],
  );

  useEffect(() => {
    const entry = {
      kind: "collection" as const,
      name: collection.getName(),
      queryKey,
      queryClient,
      collection,
    };

    if (
      query.status === "success" &&
      query.data !== null &&
      query.data !== undefined
    ) {
      liveRegistry.register(entry);
    } else {
      liveRegistry.unregister(entry);
    }
  }, [queryKey, queryClient, collection, query.status, query.data]);

  // Persist latest successful data to localStorage, only when changed
  useEffect(() => {
    if (!cacheEnabled || !cacheKey) return;
    if (query.status !== "success") return;
    const latest = query.data as unknown as Entity[] | undefined;
    if (latest === undefined) return;

    const equal = cacheCfg?.compare
      ? cacheCfg.compare(loadFromStorage<Entity[]>(cacheKey, cacheCfg?.ttlMs), latest)
      : JSON.stringify(loadFromStorage<Entity[]>(cacheKey, cacheCfg?.ttlMs)) ===
        JSON.stringify(latest);

    if (!equal) {
      saveToStorage(cacheKey, latest);
    } else {
      // still refresh timestamp to extend TTL window
      saveToStorage(cacheKey, latest);
    }
  }, [cacheEnabled, cacheKey, cacheCfg?.compare, cacheCfg?.ttlMs, query.status, query.data]);

  return {
    data: query.data,
    query,
    optimisticUpdates,
  };
};
