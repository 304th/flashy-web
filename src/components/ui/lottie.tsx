import { Suspense, lazy, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { type LottieComponentProps } from "lottie-react";

const LazyLottieComponent = lazy(() => import("lottie-react"));

interface LottieProps<T extends Record<string, unknown>> {
  id: string;
  getAnimationData: () => Promise<T>;
  fallback?: ReactNode | null;
}

export function Lottie<T extends Record<string, unknown>>({
  id,
  getAnimationData,
  fallback = null,
  ref,
  ...props
}: LottieProps<T> & Omit<LottieComponentProps, "animationData">) {
  const { data } = useQuery({
    queryKey: ["lottie", "animation", id],
    queryFn: async () => {
      void import("lottie-react"); // Trigger the library lazy load even if the animationData is not ready
      return getAnimationData();
    },
    enabled: typeof window !== "undefined",
  });

  if (!data) {
    if (fallback) {
      return fallback;
    }
  }

  return (
    <Suspense fallback={fallback}>
      <LazyLottieComponent animationData={data} {...props} />
    </Suspense>
  );
}
