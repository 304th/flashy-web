import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePrevious } from "react-use";

export const usePathnameChangedEffect = (
  handler: (pathname: string, prevPathname?: string) => void,
  { promiscuous }: { promiscuous?: boolean } = {},
) => {
  const pathname = usePathname();
  const prevPathname = usePrevious(pathname);

  useEffect(() => {
    if ((promiscuous || prevPathname) && prevPathname !== pathname) {
      handler(pathname, prevPathname);
    }
  }, [pathname, prevPathname, handler, promiscuous]);
};
