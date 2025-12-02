import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { businessAccountsCollection } from "@/features/business/collections/business-accounts";
import { myBusinessAccountCollection } from "@/features/business/collections/my-business-account.collection";

const createBusinessAccountMutation = createMutation<
  CreateBusinessAccountParams,
  BusinessAccount
>({
  write: async (params) => {
    return api
      .post("business-account", {
        json: params,
      })
      .json<BusinessAccount>();
  },
});

export const useCreateBusinessAccount = () => {
  return useOptimisticMutation<CreateBusinessAccountParams, BusinessAccount>({
    mutation: createBusinessAccountMutation,
    onOptimistic: (ch, params) => {
      return ch(myBusinessAccountCollection).prepend(params, {
        sync: true,
      })
      // return Promise.all([
      //   ch(myBusinessAccountCollection).prepend(params, {
      //     sync: true,
      //   }),
      //   ch(businessAccountsCollection).prepend(params, { sync: true }),
      // ]);
    },
  });
};
