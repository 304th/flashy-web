import {
  useQuery,
  useMutation,
  MutationFunction,
  UseMutationOptions,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const getQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<ApiResponse<T>>,
  enabled: boolean = true,
) => {
  const query = useQuery<T | undefined>({
    queryKey,
    queryFn: async () => {
      const response = await queryFn();

      if (isSuccessResponse(response)) {
        return response.data;
      }

      throw new Error(
        (response as ErrorResponse).error ||
          "Unknown error. Please try again later.",
      );
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
  mutationFn: MutationFunction<ApiResponse<TData>, TVariables>,
  options: UseMutationOptions<TData, TError, TVariables, TContext> = {},
) => {
  return useMutation<TData, TError, TVariables, TContext>({
    mutationKey,
    mutationFn: async (...args) => {
      const response = await mutationFn(...args);

      if (isSuccessResponse(response)) {
        return response.data;
      }

      throw new Error(
        (response as ErrorResponse).error ||
          "Unknown error. Please try again later.",
      );
    },
    ...options,
  });
};

export const handleMutationError = async (error: any) => {
  try {
    const errorBody = await error?.response?.json();
    toast.error(
      errorBody.error ||
        errorBody.message ||
        "Unknown error. Please try again later.",
    );
  } catch {
    toast.error("Unknown error. Please try again later.");
  }
};

export const handleAuthSuccess = (queryClient: QueryClient) => (user: User) => {
  void queryClient.setQueryData(["me"], user);
  void queryClient.invalidateQueries({ queryKey: ["me"] });
};

const isSuccessResponse = <T>(
  response: ApiResponse<T>,
): response is SuccessResponse<T> => response.success;
