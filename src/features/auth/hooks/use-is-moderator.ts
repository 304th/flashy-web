import { useMe } from "@/features/auth/queries/use-me";

export const useIsModerator = () => {
  const { data: me } = useMe();

  return Boolean(me?.moderator);
};
