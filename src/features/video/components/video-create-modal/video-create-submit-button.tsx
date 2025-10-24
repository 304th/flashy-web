import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { useSubmitNewVideo } from "@/features/video/hooks/use-submit-new-video";

export const VideoCreateSubmitButton = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const form = useFormContext();
  const submitNewVideo = useSubmitNewVideo((params) => {
    if (params.status === "published") {
      onSuccess();
    }
  });

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        disabled={!form.formState.isValid}
        pending={form.formState.isSubmitting}
        className="w-[100px]"
        role="button"
        onClick={form.handleSubmit((params) =>
          submitNewVideo({
            ...params,
            status: "draft",
          }),
        )}
      >
        Draft
      </Button>
      <Button
        disabled={!form.formState.isValid}
        pending={form.formState.isSubmitting}
        className="w-[100px]"
        role="button"
        onClick={form.handleSubmit((params) =>
          submitNewVideo({
            ...params,
            status: "published",
          }),
        )}
      >
        Publish
      </Button>
    </div>
  );
};
