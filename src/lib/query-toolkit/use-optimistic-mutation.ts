import type { Mutation } from "@/lib/query-toolkit/mutation";
import type { OptimisticUpdate } from "@/lib/query-toolkit/optimistic-mutations/optimistic-mutations";
import { useMutation } from "@tanstack/react-query";
import { OptimisticMutations } from "@/lib/query-toolkit/optimistic-mutations/optimistic-mutations";
import { handleMutationError } from "@/lib/query-toolkit";

export const useOptimisticMutation = <Params, Response>({
  mutation,
  optimisticUpdates,
  onMutate,
  onSuccess,
  onError,
}: {
  mutation: Mutation<Params, Response>;
  optimisticUpdates?: OptimisticUpdate<Params>[];
  onMutate?: (params: Params) => void;
  onSuccess?: (data: Response) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation<
    Response,
    Error,
    Params,
    { transactions: OptimisticMutations<unknown, unknown>[] }
  >({
    mutationFn: async (params: Params) => {
      return await mutation.writeData(params);
    },
    onMutate: async (params) => {
      let transactions: OptimisticMutations<unknown, unknown>[] = [];

      try {
        if (optimisticUpdates) {
          transactions = await Promise.all(
            optimisticUpdates.map(async (update) => await update(params)),
          );
        }

        onMutate?.(params);
      } catch (error) {
        await handleMutationError(error);
      }

      return { transactions };
    },
    onSuccess: async (data, _, context) => {
      context!.transactions.forEach((transaction) => {
        if (transaction.sync) {
          transaction.sync(data);
        }
      });

      onSuccess?.(data);
    },
    onError: async (error, _, context) => {
      context!.transactions.forEach((transaction) => {
        transaction.rollback();
      });

      onError?.(error);
      await handleMutationError(error);
    },
  });
};
