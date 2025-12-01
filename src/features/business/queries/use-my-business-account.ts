import { useLiveQuery } from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { myBusinessAccountCollection } from "@/features/business/collections/my-business-account.collection";

export const useMyBusinessAccount = () => {
  const { data: me } = useMe();

  return useLiveQuery({
    collection: myBusinessAccountCollection,
    queryKey: ["me", "my-business-account"],
    options: {
      enabled: Boolean(me?.fbId),
    },
  });
};
