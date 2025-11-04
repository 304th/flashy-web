import { ReactNode } from "react";
import { TriangleAlertIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner/spinner";
import {env} from "@/config";

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
  defaultFallbackClassname?: string;
  noFallback?: boolean;
  error?: ReactNode;
  fullScreenForDefaults?: boolean;
  /** If true, do not show loading UI when any query already has data */
  skipLoadingIfDataPresent?: boolean;
  children: ((data: TData) => ReactNode) | (() => ReactNode);
}

export const Loadable = <TData extends any[]>({
  queries,
  fallback,
  fullScreenForDefaults = false,
  defaultFallbackClassname,
  noFallback = false,
  error = "Network Error",
  skipLoadingIfDataPresent = false,
  children,
}: LoadableProps<TData>) => {
  const isLoading = queries.some((query) => query.isLoading);
  const queryError = queries.some((query) => query.error);
  const data = queries.map((query) => query.data) as TData;
  const empty = queries.some(
    (query) => typeof query.data === "undefined" && query.isSuccess,
  );
  const hasAnyData = queries.some((query) => typeof query.data !== "undefined");

  if (queryError) {
    return <LoadableError error={error} fullScreen={fullScreenForDefaults} />;
  }

  if ((isLoading || empty) && !(skipLoadingIfDataPresent && hasAnyData)) {
    if (noFallback) {
      return null;
    }

    if (fallback) {
      return fallback;
    }

    if (fullScreenForDefaults) {
      return (
        <div className="flex w-full h-full justify-center items-center">
          <Spinner className={defaultFallbackClassname} />
        </div>
      );
    }

    return <Spinner className={defaultFallbackClassname} />;
  }

  return <>{children(data)}</>;
};

export const LoadableError = ({
  error,
  fullScreen,
}: {
  error: LoadableProps<any>["error"];
  fullScreen?: LoadableProps<any>["fullScreenForDefaults"];
}) => {
  if (typeof error === "string") {
    if (fullScreen) {
      return (
        <div className="flex w-full h-full justify-center items-center">
          <div className="flex justify-center items-center p-2 gap-1 rounded bg-[#ff000010] text-red-500">
            <TriangleAlertIcon size={16} />
            <p>{error}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-center items-center p-2 gap-1 rounded bg-[#ff000010] text-red-500">
        <TriangleAlertIcon size={16} />
        <p>{error}</p>
      </div>
    );
  }

  return fullScreen ? (
    <div className="flex w-full h-full justify-center items-center">
      {error}
    </div>
  ) : (
    <>{error}</>
  );
};
