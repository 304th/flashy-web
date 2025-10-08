import { useQueryClient } from "@tanstack/react-query";
import { Authed, useAuthed } from "@/features/auth/hooks/use-authed";
import { api } from "@/services/api";
import { useLiveEntity, createEntity } from "@/lib/query-toolkit-v2";

export const meEntity = createEntity<User, Authed>({
  sourceFrom: async (params) => {
    if (params?.status === "pending") {
      throw new Error("pending");
    }

    return await api.get("auth/me/logged-in").json();
  },
  name: "me",
});

export const useMe = () => {
  const authed = useAuthed();
  const queryClient = useQueryClient();

  return useLiveEntity<User, Authed>({
    entity: meEntity,
    queryKey: ["me", authed.user?.uid],
    getParams: () => authed,
    options: {
      enabled: Boolean(authed.status === "pending" || authed.user?.uid),
      retry: (failureCount, error) => {
        if (error.message === "pending") {
          return true;
        }

        if (authed.status === "resolved" && !authed.user?.uid) {
          void queryClient.cancelQueries({
            queryKey: ["me"],
          });
        }

        return failureCount < 1;
      },
      retryDelay: 500,
    },
  });
};
