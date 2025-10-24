import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";

export const VideoCreateSubmitButton = () => {
  const form = useFormContext();
  const status = form.watch("status");

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        disabled={
          !form.formState.isValid ||
          (form.formState.isSubmitting && status !== "draft")
        }
        pending={form.formState.isSubmitting && status === "draft"}
        className="w-[100px]"
        role="button"
        onClick={() => form.setValue("status", "draft")}
      >
        Draft
      </Button>
      <Button
        disabled={
          !form.formState.isValid ||
          (form.formState.isSubmitting && status !== "published")
        }
        pending={form.formState.isSubmitting && status === "published"}
        className="w-[100px]"
        role="button"
        onClick={() => form.setValue("status", "published")}
      >
        Publish
      </Button>
    </div>
  );
};
