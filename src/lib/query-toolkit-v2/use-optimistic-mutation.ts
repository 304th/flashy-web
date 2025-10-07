import type { Mutation } from "@/lib/query-toolkit-v2/mutation";
import { EntityOptimisticMutations } from "@/lib/query-toolkit-v2/optimistic-mutations/optimistic-mutations";
import { useMutation } from "@tanstack/react-query";
import type { CollectionOptimisticMutations } from "@/lib/query-toolkit-v2/optimistic-mutations/optimistic-mutations";
import { handleMutationError } from "@/lib/query-toolkit";
import type { OptTransaction } from "@/lib/query-toolkit-v2/registry";
import { channel } from "@/lib/query-toolkit-v2/utils";

export const useOptimisticMutation = <Params, Response>({
  mutation,
  onOptimistic,
  onMutate,
  onSuccess,
  onError,
}: {
  mutation: Mutation<Params, Response>;
  onOptimistic?: (
    ch: typeof channel,
    params: Params,
  ) => Promise<OptTransaction[] | OptTransaction>;
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
        | OptTransaction
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
        | OptTransaction
      >[] = [];

      try {
        if (onOptimistic) {
          const result = await onOptimistic(channel, params);
          const list = Array.isArray(result) ? result : [result];
          transactions = transactions.concat(list);
        }

        onMutate?.(params);
      } catch (error) {
        await handleMutationError(error);
      }

      return { transactions };
    },
    onSuccess: async (data, _, context) => {
      context!.transactions.forEach((transaction) => {
        if ((transaction as any).sync) {
          (transaction as any).sync(data);
        }
      });

      onSuccess?.(data);
    },
    onError: async (error, _, context) => {
      context!.transactions.forEach((transaction) => {
        (transaction as any).rollback();
      });

      onError?.(error);
      await handleMutationError(error);
    },
  });
};
