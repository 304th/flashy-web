import { QueryClient } from "@tanstack/query-core";
import { createCollection, eq, useLiveQuery } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { api } from "@/services/api";

const queryClient = new QueryClient();
const array = [
  { id: "1", name: "test" },
  { id: "2", name: "test2" },
];

export const socialFeedCollection = createCollection<{
  id: string;
  name: string;
}>(
  queryCollectionOptions({
    queryKey: ["social"],
    queryFn: async () => {
      debugger;
      return Promise.resolve(array);
    },
    getKey: (item) => item.id,
    queryClient,
    onInsert: async ({ collection, transaction }) => {
      array.push(transaction.mutations[0].changes);
    },
  }),
);
