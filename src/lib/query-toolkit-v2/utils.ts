import {
  type QueryClient,
  type MutationFunction,
  type UseMutationOptions,
  useQuery,
  useMutation, UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const getQuery = <T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  enabled: (() => boolean) | boolean = true,
  options?: Record<string, any>,
) => {
  const query = useQuery<T | undefined>({
    queryKey,
    queryFn: async () => {
      return await queryFn();
    },
    enabled: typeof enabled === "function" ? enabled() : enabled,
    ...options,
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

export const getLocalStorageQuery = <T,>(queryKey: unknown[], options?: Omit<UseQueryOptions<unknown, unknown, T>, 'queryKey' | 'queryFn'>) => {
  const query = useQuery<any, any, T>({
    queryKey,
    queryFn: () => {
      const data = localStorage.getItem(JSON.stringify(queryKey));

      if (data) {
        try {
          return JSON.parse(data);
        } catch {
          return data;
        }
      }
    },
    ...options,
  });

  return [
    query.data,
    (data: T) => {
      localStorage.setItem(JSON.stringify(queryKey), JSON.stringify(data));
    }
  ] as const;
}

export const handleMutationError = async (error: any) => {
  try {
    if (typeof error === "string") {
      return toast.error(error);
    }

    const errorBody = (await error?.response?.json()) || error.message;

    toast.error(
      errorBody.error ||
        errorBody.message ||
        (typeof errorBody === "string"
          ? errorBody
          : "Unknown error. Please try again later."),
    );
  } catch {
    toast.error("Unknown error. Please try again later.");
  }
};

export const handleAuthSuccess = (queryClient: QueryClient) => () => {
  void queryClient.invalidateQueries({ queryKey: ["me"] });
};
