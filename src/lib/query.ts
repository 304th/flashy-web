import {
  useQuery,
  useMutation,
  MutationFunction,
  UseMutationOptions, type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {token} from "@/services/token";
import { transformLegacyMe } from "@/features/auth/queries/useMe";

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
    toast.error(
      errorBody.error ||
        errorBody.message ||
        "Unknown error. Please try again later.",
    );
  } catch {
    toast.error("Unknown error. Please try again later.");
  }
};

export const handleAuthSuccess = (queryClient: QueryClient) => (user: LegacyMe) => {
  if (user.token.accessToken) {
    token.setAccessToken(user?.token?.accessToken);
  }

  if (user.token.refreshToken) {
    token.setRefreshToken(user?.token?.refreshToken);
  }

  void queryClient.setQueryData(["me"], () => transformLegacyMe(user));
  void queryClient.invalidateQueries({ queryKey: ["me"] });
}
