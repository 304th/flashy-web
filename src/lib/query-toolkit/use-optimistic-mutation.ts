import type { Mutation } from "@/lib/query-toolkit/mutation";
import {
  EntityOptimisticMutations,
  OptimisticUpdate,
} from "@/lib/query-toolkit/optimistic-mutations/optimistic-mutations";
import { useMutation } from "@tanstack/react-query";
import type { CollectionOptimisticMutations } from "@/lib/query-toolkit/optimistic-mutations/optimistic-mutations";
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
    {
      transactions: Awaited<
        | CollectionOptimisticMutations<unknown, unknown>
        | EntityOptimisticMutations<any>
      >[];
    }
  >({
    mutationFn: async (params: Params) => {
      return await mutation.writeData(params);
    },
    onMutate: async (params) => {
      let transactions: Awaited<
        | CollectionOptimisticMutations<unknown, unknown>
        | EntityOptimisticMutations<any>
      >[] = [];

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
