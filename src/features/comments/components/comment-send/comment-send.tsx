import { config } from "@/services/config";
import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { IconButton } from "@/components/ui/icon-button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "@/components/ui/icons/send";
import { MessageProgress } from "@/features/social/components/post-create/message-progress";
import { useCreateComment } from "@/features/comments/queries/useCreateComment";
import { useCreateCommentMutate } from "@/features/comments/hooks/useCreateCommentMutate";
import { defaultVariants } from "@/lib/framer";
import { OptimisticUpdater } from "@/lib/query";

const formSchema = z.object({
  message: z.string().max(500),
});

export interface CommentSendProps {
  post: Reactable;
  className?: string;
  optimisticUpdates?: OptimisticUpdater[];
}

export const CommentSend = ({ post, optimisticUpdates }: CommentSendProps) => {
  const createCommentMutate = useCreateCommentMutate(post._id, optimisticUpdates);
  const sendComment = useCreateComment({
    onMutate: createCommentMutate,
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
    mode: "all",
  });

  const message = form.watch("message");

  const onSubmit = (params: { message: string }) => {
    sendComment.mutate(
      {
        postId: post._id,
        postType: "post",
        message: params.message,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form
        className="flex items-center w-full border-t"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="message"
          render={(props) => (
            <motion.div
              className="flex w-full"
              variants={defaultVariants.child}
            >
              <FormItem className="w-full">
                <Textarea
                  maxLength={500}
                  placeholder="What do you think about this?"
                  className="border-none rounded-tl-none rounded-tr-none
                    rounded-br-none w-full focus-visible:ring-0"
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
        <div className="flex items-center gap-2 p-4">
          <MessageProgress
            value={message.length}
            max={config.content.comments.maxLength}
            showDigits
          />
          <IconButton type="submit" variant="default" size="lg" disabled={!form.formState.isDirty}>
            <SendIcon />
          </IconButton>
        </div>
      </form>
    </Form>
  );
};
