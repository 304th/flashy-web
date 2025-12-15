import { useMe } from "@/features/auth/queries/use-me";

export const useIsManager = () => {
  const { data: me } = useMe();

  return Boolean(me?.manager);
};
