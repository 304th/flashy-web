import { api } from "@/services/api";
import { getQuery } from "@/lib/query";

export const useMe = () =>
  getQuery<User>(["me"], async () => await api.get("auth/me").json());
