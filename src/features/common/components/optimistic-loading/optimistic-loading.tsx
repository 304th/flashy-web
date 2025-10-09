import { Spinner } from "@/components/ui/spinner/spinner";
import { useOptimisticSpinner } from "@/features/common/hooks/use-optimistic-spinner";

export const OptimisticLoading = ({
  entity,
  className,
}: {
  entity: Optimistic<unknown>;
  className?: string;
}) => {
  const showSpinner = useOptimisticSpinner(entity);
  const loading = entity._optimisticStatus === "pending";

  if (!loading) {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 flex justify-center items-center
        cursor-progress z-20 ${className}`}
    >
      {showSpinner && <Spinner className="text-white relative z-1" />}
      <div className="absolute inset-0 bg-base-100 opacity-60" />
    </div>
  );
};
