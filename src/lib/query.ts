import {
  useQuery,
  useMutation,
  MutationFunction,
  UseMutationOptions,
} from "@tanstack/react-query";
import {toast} from "sonner";

export const getQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  enabled: boolean = true,
) => {
  const query = useQuery({
    queryKey,
    queryFn,
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
    mutationFn,
    ...options,
  });
};

export const handleMutationError = async (error: any) => {
  try {
    const errorBody = await error?.response?.json();
    toast.error(errorBody.error || errorBody.message || "Unknown error. Please try again later.");
  } catch {
    toast.error("Unknown error. Please try again later.");
  }
}
