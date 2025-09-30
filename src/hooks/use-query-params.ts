import { useSearchParams } from "next/navigation";

export function useQueryParams(param: string): string | undefined;
export function useQueryParams<T>(
  param: string,
  modifier: (queryParam: string | undefined) => T,
): T;
export function useQueryParams<T>(
  param: string,
  modifier?: (queryParam: string | undefined) => T,
): T | string | undefined {
  const searchParams = useSearchParams();

  if (!searchParams) {
    return undefined;
  }

  const queryParam = searchParams.get(param) || undefined;

  if (!queryParam) {
    return undefined;
  }

  return modifier ? modifier(queryParam) : queryParam;
}
