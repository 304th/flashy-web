import { QueryClient } from "@tanstack/query-core";
import { createCollection, eq, useLiveQuery } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { api } from "@/services/api";

const queryClient = new QueryClient();

export const getSocialFeedCollection = (id: string) =>
  createCollection(
    queryCollectionOptions({
      queryKey: ["social", id],
      queryFn: async () => {
        return api.get("relevant-social-posts").json();
      },
      getKey: (item) => item._id,
      enabled: Boolean(id),
      queryClient,
    }),
  );
