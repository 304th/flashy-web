import config from "@/config";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";

// UI Components
import { Form, FormField, FormItem } from "@/components/ui/form";
import { ContentEditable } from "@/components/ui/content-editable";
import { Button } from "@/components/ui/button";
import { MentionsWrapper } from "@/components/ui/mentions-wrapper";

// Feature Components
import { MessageProgress } from "@/features/social/components/post-create/message-progress";
import { PostLinkPreview } from "@/features/social/components/post-link-preview/post-link-preview";
import { PostOptions } from "@/features/social/components/post-create/post-options";

// Hooks
import { useCreateSocialPost } from "@/features/social/mutations/use-create-social-post";
import { useParsedPostLinkPreviews } from "@/features/social/hooks/use-parsed-post-preview-links";
import { useSocialPostImagesAttach } from "@/features/social/hooks/use-social-post-images-attach";
import { useDragAndDrop } from "@/hooks/use-drag-n-drop";
import { useExtractedMentions } from "@/features/common/hooks/use-extracted-mentions";

// Utils
import { defaultVariants } from "@/lib/framer";

// Types
const formSchema = z.object({
  description: z.string().max(config.content.social.maxLength),
  poll: z.array(z.object({ value: z.string() })).optional(),
  images: z.array(z.custom<File>()).optional(),
  behindKey: z.boolean().optional(),
  mentionedUsers: z.array(z.custom<Partial<User>>()).optional(),
});

type PostFormValues = z.infer<typeof formSchema>;

interface PostFormProps {
  onSuccess?: () => void;
}

// Main Component
export const PostForm = ({ onSuccess }: PostFormProps) => {
  const optionsMenuRef = useRef<{ reset: () => void } | null>(null);
  const createSocialPost = useCreateSocialPost();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      poll: [],
      images: [],
      behindKey: false,
      mentionedUsers: [],
    },
    mode: "all",
  });

  const description = form.watch("description");

  useExtractedMentions(description, (mentions) => {
    form.setValue(
      "mentionedUsers",
      mentions.map((username) => ({ username })),
    );
  });

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

  const handleSubmit = (params: PostFormValues) => {
    createSocialPost.mutate({
      description: params.description,
      poll: params.poll?.map((poll) => poll.value) || [],
      images: params.images || [],
      behindKey: params.behindKey || false,
      mentionedUsers: params.mentionedUsers || [],
    });

    form.reset();
    optionsMenuRef.current?.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col w-full gap-2"
      >
        <DragDropArea isDragActive={isDragActive} dragHandlers={dragHandlers}>
          <DescriptionField isDragActive={isDragActive} />
        </DragDropArea>

        <LinkPreviewsSection
          previewLinks={previewLinks}
          parsedUrls={parsedUrls}
        />

        <FormFooter
          optionsMenuRef={optionsMenuRef}
          descriptionLength={description.length}
          isFormDirty={form.formState.isDirty}
          isFormValid={form.formState.isValid}
        />

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

// Sub-components
interface DragDropAreaProps {
  isDragActive: boolean;
  dragHandlers: {
    onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  };
  children: React.ReactNode;
}

const DragDropArea = ({
  isDragActive,
  dragHandlers,
  children,
}: DragDropAreaProps) => {
  const dragAreaClassName = `relative rounded-lg transition-all duration-150 ${
    isDragActive
      ? "p-0 border border-blue-500 border-dashed"
      : "p-0 border border-transparent"
  }`;

  return (
    <div
      className={dragAreaClassName}
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
              bg-[url(/images/forest.png)] bg-contain bg-opacity-50 rounded-lg
              z-10 pointer-events-none"
          >
            <p className="text-white text-lg font-semibold">
              Upload Images here (up to 3mb)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

interface DescriptionFieldProps {
  isDragActive: boolean;
}

const DescriptionField = ({ isDragActive }: DescriptionFieldProps) => {
  const contentEditableClassName = `min-h-[120px] shadow-none
    focus-visible:ring-0 focus-visible:ring-offset-0
    transition-colors duration-150 ${
      isDragActive ? "pointer-events-none" : "border-base-400"
    }`;

  return (
    <FormField
      name="description"
      render={(props) => (
        <motion.div variants={defaultVariants.child}>
          <FormItem className="m-0 p-0">
            <MentionsWrapper
              value={props.field.value ?? ""}
              onChange={(val) => props.field.onChange(val)}
              containerClassName=""
              isContentEditable={true}
            >
              {(mentionsProps) => (
                <ContentEditable
                  maxLength={config.content.social.maxLength}
                  placeholder="What ya thinking..."
                  noHover={isDragActive}
                  value={props.field.value ?? ""}
                  onChange={(val) => props.field.onChange(val)}
                  ref={(el) => {
                    mentionsProps.ref(el);
                    if (typeof props.field.ref === "function") {
                      props.field.ref(el);
                    }
                  }}
                  onMouseDown={mentionsProps.onMouseDown}
                  onFocus={mentionsProps.onFocus}
                  onBlur={mentionsProps.onBlur}
                  skipCursorRestoration={mentionsProps.skipCursorRestoration}
                  className={contentEditableClassName}
                />
              )}
            </MentionsWrapper>
          </FormItem>
        </motion.div>
      )}
    />
  );
};

interface LinkPreviewsSectionProps {
  previewLinks: any[] | null | undefined;
  parsedUrls: string[];
}

const LinkPreviewsSection = ({
  previewLinks,
  parsedUrls,
}: LinkPreviewsSectionProps) => {
  if (!previewLinks || parsedUrls.length === 0) {
    return null;
  }

  return (
    <AnimatePresence initial={false}>
      <motion.div
        className="flex flex-col gap-2"
        initial="hidden"
        animate="show"
        variants={defaultVariants.container}
      >
        {previewLinks.map((link) => (
          <motion.div
            key={`link-preview-${link.url}`}
            variants={defaultVariants.child}
          >
            <PostLinkPreview linkPreview={link} />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

interface FormFooterProps {
  optionsMenuRef: React.RefObject<{ reset: () => void } | null>;
  descriptionLength: number;
  isFormDirty: boolean;
  isFormValid: boolean;
}

const FormFooter = ({
  optionsMenuRef,
  descriptionLength,
  isFormDirty,
  isFormValid,
}: FormFooterProps) => {
  return (
    <div className="relative flex w-full items-center justify-between py-2">
      <PostOptions ref={optionsMenuRef} />
      <div className="absolute right-0 bottom-0 flex items-center gap-2">
        <MessageProgress
          value={descriptionLength}
          max={config.content.social.maxLength}
          showDigits
        />
        <Button
          type="submit"
          className="w-[120px]"
          disabled={!isFormDirty || !isFormValid}
        >
          Post
        </Button>
      </div>
    </div>
  );
};
