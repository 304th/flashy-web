import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  MutationFunction,
  UseMutationOptions,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export type OptimisticUpdater = (variables: any) => Promise<{ optimisticUpdates: any[] }>;

export const getQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  enabled: boolean = true,
) => {
  const query = useQuery<T | undefined>({
    queryKey,
    queryFn: async () => {
      return await queryFn();
    },
    enabled,
  });

  return [query.data, query] as const;
};

export const getMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown,
>(
  mutationKey: string[],
  mutationFn: MutationFunction<TData, TVariables>,
  options: UseMutationOptions<TData, TError, TVariables, TContext> = {},
) => {
  return useMutation<TData, TError, TVariables, TContext>({
    mutationKey,
    mutationFn: async (...args) => {
      return await mutationFn(...args);
    },
    ...options,
  });
};

export const getInfiniteQuery = <T>(
  queryKey: string[],
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<T>,
  enabled: boolean = true,
) => {
  const query = useInfiniteQuery<T, unknown, T, string[], number>({
    queryKey,
    queryFn: async ({ pageParam }) => {
      return await queryFn({ pageParam });
    },
    select: (data) => {
      return data.pages.flat() as any;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (Array.isArray(lastPage) && lastPage.length > 0) {
        return allPages.length + 1;
      }

      return undefined;
    },
    initialPageParam: 1,
    enabled,
  });

  return [query.data, query] as const;
};

export const handleMutationError = async (error: any) => {
  try {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      const errorBody = (await error?.response?.json()) || error.message;

      toast.error(
        errorBody.error ||
          errorBody.message ||
          "Unknown error. Please try again later.",
      );
    }
  } catch {
    toast.error("Unknown error. Please try again later.");
  }
};

export const handleOptimisticUpdate =
  <S, T>(queryClient: QueryClient) =>
  ({
    queryKey,
    mutate,
  }: {
    queryKey: unknown[];
    mutate: (state: S, variables: T) => S;
  }) =>
  async (variables: T): Promise<{ optimisticUpdates: any[] }> => {
    await queryClient.cancelQueries({ queryKey });
    const previous = queryClient.getQueryData(queryKey) as S;
    queryClient.setQueryData(queryKey, (state: S) => mutate(state, variables));

    return { optimisticUpdates: [[queryKey, previous]] };
  };

export const handleOptimisticUpdateError = (queryClient: QueryClient) => (error: any, _: any, context: any) => {
  if (Array.isArray(context.optimisticUpdates)) {
    context.optimisticUpdates.map(([queryKey, previousData]: any) => {
      queryClient.setQueryData(
        queryKey,
        previousData,
      );
    })
  }

  return handleMutationError(error);
}

export const handleAuthSuccess = (queryClient: QueryClient) => (user: User) => {
  void queryClient.setQueryData(["me"], user);
  void queryClient.invalidateQueries({ queryKey: ["me"] });
};

export const combineOptimisticUpdates = <T>(updates: Array<OptimisticUpdater>) => async (variables: T): Promise<{
  optimisticUpdates: any[];
}> => {
  const results = await Promise.all(updates.map(update => update(variables)));

  return results.reduce((acc, result) => {
    acc.optimisticUpdates.push(result.optimisticUpdates[0])

    return acc;
  }, { optimisticUpdates: [] } as {
    optimisticUpdates: any[];
  })
}
