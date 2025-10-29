import config from "@/config";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageProgress } from "@/features/social/components/post-create/message-progress";
import { PostLinkPreview } from "@/features/social/components/post-link-preview/post-link-preview";
import { PostOptions } from "@/features/social/components/post-create/post-options";
import { useCreateSocialPost } from "@/features/social/mutations/use-create-social-post";
import { useParsedPostLinkPreviews } from "@/features/social/hooks/use-parsed-post-preview-links";
import { useSocialPostImagesAttach } from "@/features/social/hooks/use-social-post-images-attach";
import { useDragAndDrop } from "@/hooks/use-drag-n-drop";
import { defaultVariants } from "@/lib/framer";
import { UserAvatar } from "@/components/ui/user-avatar";
import { api } from "@/services/api";

const formSchema = z.object({
  description: z.string().max(config.content.social.maxLength),
  poll: z.array(z.object({ value: z.string() })).optional(),
  images: z.array(z.custom<File>()).optional(),
  behindKey: z.boolean().optional(),
});

export const PostForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const optionsMenuRef = useRef<{ reset: () => void } | null>(null);
  const createSocialPost = useCreateSocialPost();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const mentionContainerRef = useRef<HTMLDivElement | null>(null);

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
  const highlightedDescription = useMemo(() => {
    const text = description || "";
    const parts = text.split(/(@[a-zA-Z0-9_]{1,20})/g);
    return parts.map((part, idx) =>
      part.startsWith("@") ? (
        <span key={idx} className="text-blue-400">
          {part}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      ),
    );
  }, [description]);
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

  // mention state
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionResults, setMentionResults] = useState<User[]>([]);
  const [mentionLoading, setMentionLoading] = useState(false);
  const mentionDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [mentionPosition, setMentionPosition] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  const [portalReady, setPortalReady] = useState(false);
  const mentionDropdownRef = useRef<HTMLDivElement | null>(null);
  const [mentionAnchorStart, setMentionAnchorStart] = useState<number | null>(null);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const suppressNextOpenRef = useRef(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const computeCaretPosition = (index?: number) => {
    const ta = textareaRef.current;
    if (!ta) return { left: 8, top: 28 };

    const style = window.getComputedStyle(ta);
    const div = document.createElement("div");
    const span = document.createElement("span");
    const caret = document.createElement("span");
    const value = ta.value;
    const caretIndex = index ?? (ta.selectionStart ?? value.length);

    const properties = [
      "boxSizing","width","height","overflow","borderTopWidth","borderRightWidth","borderBottomWidth","borderLeftWidth",
      "paddingTop","paddingRight","paddingBottom","paddingLeft","fontStyle","fontVariant","fontWeight","fontStretch",
      "fontSize","fontFamily","lineHeight","letterSpacing","textTransform","textAlign","textIndent","whiteSpace","wordBreak"
    ];
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";
    properties.forEach((prop) => {
      // @ts-ignore
      div.style[prop] = style.getPropertyValue(prop as any);
    });
    // ensure same width for wrapping calc
    div.style.width = ta.clientWidth + "px";

    const before = value.substring(0, caretIndex);
    const after = value.substring(caretIndex) || "."; // ensure height

    span.textContent = before;
    caret.textContent = "\u200b"; // zero-width space as caret marker

    div.appendChild(span);
    div.appendChild(caret);

    document.body.appendChild(div);
    const caretRect = caret.getBoundingClientRect();
    const mirrorRect = div.getBoundingClientRect();
    const taRect = ta.getBoundingClientRect();
    const lineHeight = parseFloat(style.lineHeight || "20");
    const offsetX = caretRect.left - mirrorRect.left;
    const offsetY = caretRect.top - mirrorRect.top;
    const left = taRect.left + offsetX;
    const top = taRect.top + offsetY + (isFinite(lineHeight) ? lineHeight : 20);
    document.body.removeChild(div);
    return { left, top };
  };

  const currentMention = useMemo(() => {
    const el = textareaRef.current;
    const value = description || "";
    if (!el) return null;
    const caret = el.selectionStart ?? value.length;
    const before = value.substring(0, caret);
    const lastSpace = Math.max(before.lastIndexOf(" "), before.lastIndexOf("\n"), before.lastIndexOf("\t"));
    const segment = before.substring(lastSpace + 1);
    const match = segment.match(/^@([a-zA-Z0-9_]{1,20})$/);
    if (!match) return null;
    const start = caret - segment.length;
    const end = caret;
    return { query: match[1], start, end } as const;
  }, [description]);

  const closeMentions = () => {
    setMentionOpen(false);
    setMentionQuery("");
    setMentionResults([]);
    setMentionLoading(false);
  };

  useEffect(() => {
    const mention = currentMention;
    if (!mentionOpen) {
      if (suppressNextOpenRef.current) {
        // consume the suppression and skip opening once
        suppressNextOpenRef.current = false;
        return;
      }
      if (mention && mention.query.length >= 1) {
        if (!isTextareaFocused) return; // only open when typing/focused
        setMentionOpen(true);
        setMentionAnchorStart(mention.start);
        setMentionQuery(mention.query);
        const pos = computeCaretPosition(mention.start);
        setMentionPosition({ left: Math.max(0, pos.left), top: Math.max(0, pos.top) });
      } else {
        closeMentions();
      }
    } else {
      // When open, keep position fixed to anchor and just update query while typing
      const el = textareaRef.current;
      const value = form.getValues("description") || "";
      if (!el || mentionAnchorStart == null) return;
      const caret = el.selectionStart ?? value.length;
      if (mentionAnchorStart >= value.length || value[mentionAnchorStart] !== "@" || caret < mentionAnchorStart) {
        closeMentions();
        setMentionAnchorStart(null);
        return;
      }
      const token = value.slice(mentionAnchorStart, caret);
      const tokenBody = token.slice(1); // without '@'
      if (/^[a-zA-Z0-9_]{0,20}$/.test(tokenBody)) {
        setMentionQuery(tokenBody);
      } else {
        closeMentions();
        setMentionAnchorStart(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, currentMention, mentionOpen, mentionAnchorStart, isTextareaFocused]);

  useEffect(() => {
    if (!mentionOpen) return;
    const listener = () => {
      // recompute using the last known start index if possible
      const pos = computeCaretPosition(mentionAnchorStart == null ? undefined : mentionAnchorStart);
      setMentionPosition({ left: Math.max(0, pos.left), top: Math.max(0, pos.top) });
    };
    window.addEventListener("resize", listener);
    window.addEventListener("scroll", listener, true);
    return () => {
      window.removeEventListener("resize", listener);
      window.removeEventListener("scroll", listener, true);
    };
  }, [mentionOpen, mentionAnchorStart]);

  useEffect(() => {
    if (!mentionOpen) return;
    const handleDocumentMouseDown = (e: MouseEvent) => {
      const dropdownEl = mentionDropdownRef.current;
      const containerEl = mentionContainerRef.current;
      if (!dropdownEl || !containerEl) return;
      const target = e.target as Node;
      if (!dropdownEl.contains(target) && !containerEl.contains(target)) {
        // ensure we don't immediately reopen due to focus state
        setIsTextareaFocused(false);
        suppressNextOpenRef.current = true;
        closeMentions();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMentions();
      }
    };
    document.addEventListener("mousedown", handleDocumentMouseDown, true);
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown, true);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [mentionOpen]);

  useEffect(() => {
    if (!mentionOpen) return;
    if (mentionDebounceRef.current) clearTimeout(mentionDebounceRef.current);
    mentionDebounceRef.current = setTimeout(async () => {
      try {
        setMentionLoading(true);
        const users = await api
          .get("users/search", { searchParams: { username: mentionQuery } })
          .json<User[]>();
        setMentionResults(users || []);
      } catch (e) {
        setMentionResults([]);
      } finally {
        setMentionLoading(false);
      }
    }, 250);
  }, [mentionQuery, mentionOpen]);

  const handleSelectUser = (user: User) => {
    const el = textareaRef.current;
    const value = form.getValues("description") || "";
    if (!el) return;
    const caret = el.selectionStart ?? value.length;
    const before = value.substring(0, caret);
    const lastSpace = Math.max(before.lastIndexOf(" "), before.lastIndexOf("\n"), before.lastIndexOf("\t"));
    const segment = before.substring(lastSpace + 1);
    const match = segment.match(/^@([a-zA-Z0-9_]{1,20})$/);
    const start = match ? caret - segment.length : caret;
    const end = caret;
    const nextValue = value.slice(0, start) + `@${user.username} ` + value.slice(end);
    form.setValue("description", nextValue, { shouldDirty: true, shouldValidate: true });
    const newCaret = (value.slice(0, start) + `@${user.username} `).length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newCaret, newCaret);
    });
    closeMentions();
  };

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
                  <div className="relative" ref={mentionContainerRef}>
                    {/* highlight backdrop */}
                    <div
                      aria-hidden
                      className={`pointer-events-none absolute inset-0 rounded-md px-3 py-2 whitespace-pre-wrap break-words
                      text-[inherit] leading-[inherit] font-[inherit]`}
                    >
                      {highlightedDescription}
                    </div>
                    <Textarea
                    maxLength={config.content.social.maxLength}
                    placeholder="What ya thinking..."
                    noHover={isDragActive}
                    {...props.field}
                    ref={(el) => {
                      textareaRef.current = el;
                        // react-hook-form ref
                        // @ts-ignore - RHF uses a callback ref
                        if (props.field && typeof props.field.ref === "function") {
                          // @ts-ignore
                          props.field.ref(el);
                        }
                    }}
                    onChange={(e) => {
                      props.field.onChange(e);
                    }}
                      onMouseDown={() => {
                        if (mentionOpen) {
                          closeMentions();
                          setMentionAnchorStart(null);
                        }
                        // prevent an immediate reopen on focus
                        suppressNextOpenRef.current = true;
                      }}
                      onFocus={() => setIsTextareaFocused(true)}
                      onBlur={() => setIsTextareaFocused(false)}
                      className={`min-h-[120px] shadow-none focus-visible:ring-0
                    focus-visible:ring-offset-0 transition-colors duration-150
                    ${
                      isDragActive
                        ? "pointer-events-none"
                        : "border-base-400 bg-transparent"
                    }`}
                      style={{ color: "transparent", caretColor: "white" }}
                    />
                    {mentionOpen && portalReady &&
                      createPortal(
                        <div
                          className="z-[1000] w-[min(420px,100%)] rounded-2xl bg-base-200 ring-1 ring-inset ring-base-600 shadow-regular-md p-2 fixed"
                          ref={mentionDropdownRef}
                          style={{ left: mentionPosition.left, top: mentionPosition.top }}
                        >
                          <div className="flex items-center gap-2 p-1">
                            <Input
                              value={mentionQuery}
                              onChange={(e) => setMentionQuery(e.target.value)}
                              placeholder="Search users..."
                              className="h-9"
                            />
                          </div>
                          <div className="max-h-60 overflow-auto">
                            {mentionLoading && (
                              <div className="px-2 py-3 text-sm text-muted-foreground">Searching...</div>
                            )}
                            {!mentionLoading && mentionResults.length === 0 && (
                              <div className="px-2 py-3 text-sm text-muted-foreground">No users found</div>
                            )}
                            {!mentionLoading && mentionResults.map((u) => (
                              <button
                                type="button"
                                key={u.fbId}
                                className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-base-300 text-left"
                                onClick={() => handleSelectUser(u)}
                              >
                                <UserAvatar avatar={u.userimage} className="size-7" />
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">@{u.username}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>,
                        document.body,
                      )}
                  </div>
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
