import type { Mutation } from "@/lib/query-toolkit-v2/mutation";
import { useMutation } from "@tanstack/react-query";
import {
  channel,
  EntityOptimisticMutations,
  type OptTransaction,
  type CollectionOptimisticMutations,
  handleMutationError,
} from "@/lib/query-toolkit-v2";

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
  ) => Promise<OptTransaction[][] | OptTransaction[]>;
  onMutate?: (params: Params) => void;
  onSuccess?: (data: Response, ch: typeof channel, params: Params) => void;
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
      return await mutation.write(params);
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

          transactions = transactions.concat(...list);
        }

        onMutate?.(params);
      } catch (error) {
        await handleMutationError(error);
      }

      return { transactions };
    },
    onSuccess: async (data, params, context) => {
      context!.transactions.forEach((transaction) => {
        if ((transaction as any).sync) {
          (transaction as any).sync(data);
        }
      });

      onSuccess?.(data, channel, params);
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
