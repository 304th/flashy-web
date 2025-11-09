import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { IconButton } from "@/components/ui/icon-button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "@/components/ui/icons/send";
import { useSendChatMessage } from "@/features/streams/mutations/use-send-chat-message";
import { defaultVariants } from "@/lib/framer";

const formSchema = z.object({
  message: z.string().max(500),
  tipAmount: z.number().min(0).optional(),
  mentionedUsers: z.array(z.custom<Partial<User>>()).optional(),
});

export const StreamLiveChatSendMessage = ({ stream }: { stream: Stream }) => {
  const sendMessage = useSendChatMessage();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      mentionedUsers: [],
    },
    mode: "all",
  });

  const onSubmit = (params: any) => {
    sendMessage.mutate({
      streamId: stream._id,
      message: params.message.trim(),
    });
    form.reset();
  };

  if (!stream) {
    return null;
  }

  return (
    <div className={"relative flex flex-col w-full bg-base-300 rounded-md"}>
      <Form {...form}>
        <form
          className="flex items-center w-full gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="message"
            render={(props) => (
              <motion.div
                className="flex w-full p-1"
                variants={defaultVariants.child}
              >
                <FormItem className="w-full">
                  <Textarea
                    maxLength={500}
                    placeholder="Message here..."
                    className="border-none w-full focus-visible:ring-0
                      !min-h-[10px]"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    {...props.field}
                  />
                </FormItem>
              </motion.div>
            )}
          />
          <div className="flex items-center gap-2 py-3 pr-3">
            <IconButton
              type="submit"
              variant="default"
              size="lg"
              disabled={!form.formState.isDirty}
            >
              <SendIcon />
            </IconButton>
          </div>
        </form>
      </Form>
    </div>
  );
};
