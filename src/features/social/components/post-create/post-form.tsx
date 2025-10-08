import config from "@/config";
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
import { useCreateSocialPost } from "@/features/social/mutations/use-create-social-post";
import { useParsedPostLinkPreviews } from "@/features/social/hooks/use-parsed-post-preview-links";
import { useSocialPostImagesAttach } from "@/features/social/hooks/use-social-post-images-attach";
import { useDragAndDrop } from "@/hooks/use-drag-n-drop";
import { defaultVariants } from "@/lib/framer";

const formSchema = z.object({
  description: z.string().max(config.content.social.maxLength),
  poll: z.array(z.object({ value: z.string() })).optional(),
  images: z.array(z.custom<File>()).optional(),
  behindKey: z.boolean().optional(),
});

export const PostForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const optionsMenuRef = useRef<{ reset: () => void } | null>(null);
  const createSocialPost = useCreateSocialPost();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      poll: [],
      images: [],
      behindKey: false,
    },
    mode: "all",
  });

  const description = form.watch("description");
  const [parsedUrls, previewLinks] = useParsedPostLinkPreviews(
    description,
    500,
  );

  const { handleFilesUpload, handleFileChange } = useSocialPostImagesAttach({
    setValue: form.setValue,
    getValues: form.getValues,
    fieldName: "images",
  });

  const { isDragActive, dragHandlers } = useDragAndDrop(handleFilesUpload);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((params) => {
          createSocialPost.mutate({
            description: params.description,
            poll: params.poll?.map((poll) => poll.value) || [],
            images: params.images || [],
            behindKey: params.behindKey || false,
          });
          form.reset();
          optionsMenuRef.current?.reset();
          onSuccess?.();
        })}
        className="flex flex-col w-full gap-2"
      >
        <div
          className={`relative rounded-lg transition-all duration-150 ${
            isDragActive
              ? "p-0 border border-blue-500 border-dashed"
              : "p-0 border border-transparent"
            }`}
          onDragEnter={dragHandlers.onDragEnter}
          onDragOver={dragHandlers.onDragOver}
          onDragLeave={dragHandlers.onDragLeave}
          onDrop={dragHandlers.onDrop}
        >
          <AnimatePresence>
            {isDragActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center
                  bg-[url(/images/forest.png)] bg-contain bg-opacity-50
                  rounded-lg z-10 pointer-events-none"
              >
                <p className="text-white text-lg font-semibold">
                  Upload Images here (up to 3mb)
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <FormField
            name="description"
            render={(props) => (
              <motion.div variants={defaultVariants.child}>
                <FormItem className="m-0 p-0">
                  <Textarea
                    maxLength={config.content.social.maxLength}
                    placeholder="What ya thinking..."
                    noHover={isDragActive}
                    {...props.field}
                    className={`min-h-[120px] shadow-none focus-visible:ring-0
                    focus-visible:ring-offset-0 transition-colors duration-150
                    ${
                      isDragActive
                        ? "pointer-events-none"
                        : "border-base-400 bg-base-200"
                    }`}
                  />
                </FormItem>
              </motion.div>
            )}
          />
        </div>
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
              disabled={!form.formState.isDirty || !form.formState.isValid}
            >
              Post
            </Button>
          </div>
        </div>
        {/* Hidden file input for programmatic access */}
        <input
          id="file-upload"
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/gif"
          multiple
          tabIndex={-1}
          className="hidden"
          onChange={handleFileChange}
        />
      </form>
    </Form>
  );
};
