import { config } from "@/services/config";
import React, { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageProgress } from "@/features/social/components/post-create/message-progress";
import { PostLinkPreview } from "@/features/social/components/post-link-preview/post-link-preview";
import { PostOptions } from "@/features/social/components/post-create/post-options";
import { useCreateSocialPost } from "@/features/social/queries/use-create-social-post";
import { useParsedPostLinkPreviews } from "@/features/social/hooks/use-parsed-post-preview-links";
import { defaultVariants } from "@/lib/framer";

const formSchema = z.object({
  description: z.string().max(config.content.social.maxLength),
  poll: z.array(z.object({ value: z.string() })).optional(),
  images: z.array(z.custom<File>()).optional(),
});

export const PostForm = () => {
  const optionsMenuRef = useRef<{ reset: () => void } | null>(null);
  const createSocialPost = useCreateSocialPost();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      poll: [],
      images: [],
    },
    mode: "all",
  });

  const description = form.watch("description");
  const [parsedUrls, previewLinks] = useParsedPostLinkPreviews(
    description,
    500,
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((params) => {
          createSocialPost.mutate({
            description: params.description,
            poll: params.poll?.map((poll) => poll.value) || [], //FIXME: what?
            images: params.images || [],
          });
          form.reset();
          optionsMenuRef.current?.reset();
        })}
        className="flex flex-col w-full gap-2"
      >
        <FormField
          name="description"
          render={(props) => (
            <motion.div variants={defaultVariants.child}>
              <FormItem>
                <Textarea
                  maxLength={config.content.social.maxLength}
                  placeholder="What ya thinking..."
                  {...props.field}
                />
              </FormItem>
            </motion.div>
          )}
        />
        <AnimatePresence initial={false}>
          {previewLinks && parsedUrls.length > 0 && (
            <motion.div
              className="flex flex-col gap-2"
              initial="hidden"
              animate="show"
              variants={defaultVariants.container}
            >
              {previewLinks.map((link) => (
                <motion.div variants={defaultVariants.child}>
                  <PostLinkPreview
                    key={`link-preview-${link.url}`}
                    linkPreview={link}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="relative flex w-full items-center justify-between py-2">
          <PostOptions ref={optionsMenuRef} />
          <div className="absolute right-0 bottom-0 flex items-center gap-2">
            <MessageProgress
              value={description.length}
              max={config.content.social.maxLength}
              showDigits
            />
            <Button
              type="submit"
              className="w-[120px]"
              disabled={!form.formState.isDirty}
            >
              Post
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
