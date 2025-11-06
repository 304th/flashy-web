import config from "@/config";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { StreamFormDetails } from "./stream-form-details";
import { StreamCreateSuccess } from "./stream-create-success";
import { useCreateStream, type CreateStreamResponse } from "@/features/streams/mutations/use-create-stream";
import { AnimatePresence, motion } from "framer-motion";

export interface StreamCreateModalProps {
  onClose(): void;
}

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(
      config.content.videos.title.maxLength,
      `Title must be at most ${config.content.videos.title.maxLength} characters`,
    ),
  description: z
    .string()
    .max(
      config.content.videos.description.maxLength,
      `Description must be at most ${config.content.videos.description.maxLength} characters`,
    )
    .optional(),
  scheduledAt: z.string().optional(),
  chatEnabled: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;
type Step = "details" | "success";

export const StreamCreateModal = ({ onClose }: StreamCreateModalProps) => {
  const [step, setStep] = useState<Step>("details");
  const [createdStream, setCreatedStream] = useState<CreateStreamResponse | null>(null);
  const createStream = useCreateStream();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      chatEnabled: true,
    },
    mode: "all",
  });

  const handleSubmit = async (data: FormData) => {
    try {
      const stream = await createStream.mutateAsync({
        ...data,
        description: data.description || "",
      });
      setCreatedStream(stream);
      setStep("success");
    } catch (error) {
      console.error("Failed to create stream:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    setStep("details");
    onClose();
  };

  return (
    <ModalComponent className="bg-base-300 p-0! max-sm:min-w-unset max-w-full min-w-[600px]" onClose={onClose}>
      <div className="relative w-full max-w-2xl rounded-md bg-base-300">
        <div className="flex w-full p-4">
          <div
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <p className="text-2xl font-extrabold text-white">{step === "details" ? "Prepare to Stream" : "Stream Ready!"}</p>
            {step === "details" && (
              <p className="text-sm text-base-content/70 mt-1">Set up your stream details and get your RTMP credentials</p>
            )}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="p-4">
                  <StreamFormDetails
                    form={form}
                    isSubmitting={createStream.isPending}
                  />
                </form>
              </Form>
            </motion.div>
          )}

          {step === "success" && createdStream && (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
            >
              <StreamCreateSuccess
                stream={createdStream}
                onClose={handleClose}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ModalComponent>
  );
};
