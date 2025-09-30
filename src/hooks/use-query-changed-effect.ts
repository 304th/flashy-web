import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePrevious } from "react-use";

export const useQueryChangedEffect = (
  paramKey: string,
  handler: (pathname: string, prevPathname?: string | null) => void,
) => {
  const params = useSearchParams();
  const curParam = params.get(paramKey);
  const prevParam = usePrevious(curParam);

  useEffect(() => {
    if (prevParam !== curParam) {
      handler(curParam || "", prevParam);
    }
  }, [curParam, prevParam, handler]);
};
