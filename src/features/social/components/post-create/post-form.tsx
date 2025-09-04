import { config } from "@/services/config";
import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageProgress } from "@/features/social/components/post-create/message-progress";
import { PostOptions } from "@/features/social/components/post-create/post-options";
import { useCreateSocialPost } from "@/features/social/queries/useCreateSocialPost";
import { defaultVariants } from "@/lib/framer";

const formSchema = z.object({
  description: z.string().max(config.content.social.maxLength),
});

export const PostForm = () => {
  const createSocialPost = useCreateSocialPost();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
    mode: "all",
  });

  const description = form.watch("description");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((params) => {
          createSocialPost.mutate(
            {
              description: params.description,
            },
            {
              onSuccess: () => {
                form.reset();
              },
            },
          );
        })}
        className="flex flex-col w-full gap-3"
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
        <div className="flex items-center justify-between">
          <PostOptions />
          <div className="flex items-center gap-2">
            <MessageProgress
              value={description.length}
              max={config.content.social.maxLength}
              showDigits
            />
            <Button
              type="submit"
              className="w-[120px]"
              disabled={!form.formState.isValid}
              pending={createSocialPost.isPending}
            >
              Post
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
