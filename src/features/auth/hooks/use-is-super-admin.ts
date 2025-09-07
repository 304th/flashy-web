import { useMe } from "@/features/auth/queries/use-me";

export const useIsSuperAdmin = () => {
  const [me] = useMe();

  return Boolean(me?.superAdmin);
};
