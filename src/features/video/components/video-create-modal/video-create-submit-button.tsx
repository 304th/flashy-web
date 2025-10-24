import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import type { RefObject } from "react";

export const VideoCreateSubmitButton = ({
  submitterNameRef,
}: {
  submitterNameRef: RefObject<"draft" | "published" | null>;
}) => {
  const form = useFormContext();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        disabled={
          !form.formState.isValid ||
          (form.formState.isSubmitting && submitterNameRef.current !== "draft")
        }
        pending={
          form.formState.isSubmitting &&
          form.formState.isSubmitting &&
          submitterNameRef.current === "draft"
        }
        className="w-[100px]"
        type="submit"
        name="draft"
      >
        Draft
      </Button>
      <Button
        disabled={
          !form.formState.isValid ||
          (form.formState.isSubmitting &&
            submitterNameRef.current !== "published")
        }
        pending={
          form.formState.isSubmitting &&
          form.formState.isSubmitting &&
          submitterNameRef.current === "published"
        }
        className="w-[100px]"
        type="submit"
        name="published"
      >
        Publish
      </Button>
    </div>
  );
};
