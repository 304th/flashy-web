import { useMemo } from "react";
import { CircularProgress } from "@/components/ui/circular-progress";

export const MessageProgress = ({
  value,
  max,
  showDigits,
}: {
  value: number;
  max: number;
  showDigits: boolean;
}) => {
  const percentage = useMemo(() => value / max, [value, max]);

  return (
    <div className="flex items-center gap-1">
      {showDigits && (
        <div className="flex justify-end w-15">
          <p className="text-sm">
            {value}/{max}
          </p>
        </div>
      )}
      <CircularProgress
        value={percentage}
        diameter={20}
        color="#8CFFD5"
        strokeWidth={2}
      />
    </div>
  );
};
