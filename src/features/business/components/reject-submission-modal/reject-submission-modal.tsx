"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRejectSubmission } from "@/features/monetise";

const formSchema = z.object({
  feedback: z.string().min(10, "Please provide at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export interface RejectSubmissionModalProps {
  submissionId: string;
  creatorName?: string;
  onClose(): void;
  onSuccess?(): void;
}

export const RejectSubmissionModal = ({
  submissionId,
  creatorName,
  onClose,
  onSuccess,
}: RejectSubmissionModalProps) => {
  const rejectSubmission = useRejectSubmission();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    rejectSubmission.mutate(
      {
        creatorOpportunityId: submissionId,
        feedback: data.feedback,
      },
      {
        onSuccess: () => {
          toast.success("Submission rejected");
          onSuccess?.();
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to reject submission");
        },
      },
    );
  };

  return (
    <Modal onClose={onClose} className="!p-0">
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col p-6 gap-4 rounded-md"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Reject Submission</h2>
          <div onClick={onClose}>
            <CloseButton />
          </div>
        </div>

        <p className="text-sm text-base-800">
          Please provide feedback for{" "}
          <span className="text-white">{creatorName || "the creator"}</span>{" "}
          explaining why their submission is being rejected.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">
              Reason for rejection
            </label>
            <Textarea
              placeholder="Please explain what needs to be improved or why the submission doesn't meet the requirements..."
              {...register("feedback")}
              className="bg-base-200 min-h-[120px]"
            />
            {errors.feedback && (
              <p className="text-xs text-red-500">{errors.feedback.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={rejectSubmission.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={!isDirty || !isValid || rejectSubmission.isPending}
            >
              {rejectSubmission.isPending
                ? "Rejecting..."
                : "Reject Submission"}
            </Button>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`max-sm:min-w-unset min-w-[500px] !bg-base-300 !rounded-md
      max-sm:w-full shadow-2xl overflow-hidden ${props.className}`}
  />
);
