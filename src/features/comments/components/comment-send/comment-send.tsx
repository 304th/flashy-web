import { config } from "@/services/config";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { IconButton } from "@/components/ui/icon-button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "@/components/ui/icons/send";
import { ReplyToComment } from "@/features/comments/components/comment-send/reply-to-comment";
import { MessageProgress } from "@/features/social/components/post-create/message-progress";
import {
  type CreateCommentParams,
  useCreateComment,
} from "@/features/comments/mutations/use-create-comment";
import {
  type CreateReplyParams,
  useCreateReply,
} from "@/features/comments/mutations/use-create-reply";
import type { OptimisticUpdate } from "@/lib/query-toolkit";
import { defaultVariants } from "@/lib/framer";
import { useReplies } from "@/features/comments/queries/use-replies";
import { useComments } from "@/features/comments/queries/use-comments";

const formSchema = z.object({
  message: z.string().max(500),
});

export interface CommentSendProps {
  post: Reactable;
  replyComment: CommentPost | null;
  className?: string;
  sendCommentUpdates?: OptimisticUpdate<CreateCommentParams>[];
  onCloseReply?: () => void;
}

export const CommentSend = ({
  post,
  replyComment,
  className,
  sendCommentUpdates,
  onCloseReply,
}: CommentSendProps) => {
  const { optimisticUpdates: replies } = useReplies(replyComment?._id);
  const { optimisticUpdates: comments } = useComments(post._id);
  const sendComment = useCreateComment({
    optimisticUpdates: sendCommentUpdates,
  });
  const sendReply = useCreateReply({
    optimisticUpdates: [
      async (params) => replies.prepend(params, { sync: true }),
      async () =>
        comments.update(replyComment?._id!, (comment) => {
          comment.repliesCount += 1;
        }),
    ],
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
    mode: "all",
  });

  useEffect(() => {
    if (post._id) {
      form.setFocus("message");
    }
  }, [post._id]);

  useEffect(() => {
    if (replyComment) {
      form.setFocus("message");
    }
  }, [replyComment]);

  const message = form.watch("message");

  const onSubmit = (params: { message: string }) => {
    if (replyComment) {
      sendReply.mutate(
        {
          commentId: replyComment._id,
          text: params.message,
          mentionedUsers: [],
        },
        {
          onSuccess: () => {
            form.reset();
          },
        },
      );
    } else {
      sendComment.mutate(
        {
          postId: post._id,
          postType: "post",
          text: params.message,
          mentionedUsers: [],
        },
        {
          onSuccess: () => {
            form.reset();
          },
        },
      );
    }
  };

  return (
    <div className={`relative flex flex-col w-full bg-base-200 ${className}`}>
      {replyComment && (
        <ReplyToComment comment={replyComment} onClose={onCloseReply} />
      )}
      <Form {...form}>
        <form
          className="flex items-center w-full"
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
                    placeholder="What do you think about this?"
                    className="border-none rounded w-full focus-visible:ring-0
                      min-h-[50px]"
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
            <MessageProgress
              value={message.length}
              max={config.content.comments.maxLength}
              showDigits
            />
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
