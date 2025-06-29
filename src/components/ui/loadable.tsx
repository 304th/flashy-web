import { ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner/spinner";

// Assuming queries come from a library like React Query
interface Query<T> {
  isLoading: boolean;
  isSuccess: boolean;
  data: T | undefined;
  error?: Error | null;
}

interface LoadableProps<TData extends any[]> {
  queries: { [K in keyof TData]: Query<TData[K]> };
  fallback?: ReactNode | null;
  error?: ReactNode;
  children: ((data: TData) => ReactNode) | (() => ReactNode);
}

export const Loadable = <TData extends any[]>({
  queries,
  fallback = <Spinner />,
  error = "An error occurred",
  children,
}: LoadableProps<TData>) => {
  const isLoading = queries.some((query) => query.isLoading);
  const hasError = queries.some((query) => query.error);
  const data = queries.map((query) => query.data) as TData;
  const empty = queries.some(
    (query) => typeof query.data === "undefined" && query.isSuccess,
  );

  if (hasError) {
    if (typeof error === "string") {
      return <p className="text-red-500">{error}</p>;
    }

    return <>{error}</>;
  }

  if (isLoading || empty) {
    return fallback;
  }

  return <>{children(data)}</>;
};
