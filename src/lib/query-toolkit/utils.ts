import {
  type QueryClient,
  type MutationFunction,
  type UseMutationOptions,
  useQuery,
  useMutation,
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

export const handleAuthSuccess = (queryClient: QueryClient) => () => {
  void queryClient.invalidateQueries({ queryKey: ["me"] });
};
