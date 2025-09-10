import { useSearchParams } from "next/navigation";

export function useQueryParams(param: string): string | null;
export function useQueryParams<T>(
  param: string,
  modifier: (queryParam: string | null) => T,
): T;
export function useQueryParams<T>(
  param: string,
  modifier?: (queryParam: string | null) => T,
): T | string | null {
  const searchParams = useSearchParams();

  if (!searchParams) {
    return null;
  }

  const queryParam = searchParams.get(param);

  return modifier ? modifier(queryParam) : queryParam;
}
