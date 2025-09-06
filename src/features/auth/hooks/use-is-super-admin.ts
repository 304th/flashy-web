import { useMe } from "@/features/auth/queries/useMe";

export const useIsSuperAdmin = () => {
  const [me] = useMe();

  return Boolean(me?.superAdmin);
};
