import config from "@/config";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { GoLiveDetailsForm } from "@/features/streams/components/go-live-modal/go-live-details-form";
import { useProfileStream } from "@/features/profile/queries/use-profile-stream";
import {Button} from "@/components/ui/button";

export interface GoLiveModalProps {
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

export const GoLiveModal = ({ onClose }: GoLiveModalProps) => {
  const { data: stream, query } = useProfileStream();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      chatEnabled: true,
    },
    mode: "all",
  });

  // const handleSubmit = async (data: FormData) => {
  //   try {
  //     const stream = await createStream.mutateAsync({
  //       ...data,
  //       description: data.description || "",
  //     });
  //     setCreatedStream(stream);
  //     setStep("success");
  //   } catch (error) {
  //     console.error("Failed to create stream:", error);
  //   }
  // };
  //
  // const handleClose = () => {
  //   form.reset();
  //   setStep("details");
  //   onClose();
  // };

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
            <p className="text-2xl font-extrabold text-white">Go Live</p>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(() => {})} className="p-4">
                <GoLiveDetailsForm
                  isSubmitting={createStream.isPending}
                />
              </form>
            </Form>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="submit"
            disabled={!form.formState.isValid}
            className="min-w-[120px]"
          >
            Save
          </Button>
        </div>
      </div>
    </ModalComponent>
  );
};
