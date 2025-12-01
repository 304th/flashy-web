import * as React from "react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                              Types & Interfaces                            */
/* -------------------------------------------------------------------------- */

export interface ContentSegment {
  type: "text" | "mention" | "hashtag" | "link";
  text: string;
  key: string;
}

export interface ContentEditableProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "onInput" | "children"
> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  noHover?: boolean;
  containerClassName?: string;
  /** Custom parser function to segment content */
  parseContent?: (text: string) => ContentSegment[];
  /** Custom renderer for segments */
  renderSegment?: (segment: ContentSegment) => React.ReactNode;
  /** Callback to prevent cursor restoration on external updates */
  skipCursorRestoration?: React.MutableRefObject<boolean>;
}

/* -------------------------------------------------------------------------- */
/*                              Default Parser                                */
/* -------------------------------------------------------------------------- */

/**
 * Default content parser that identifies mentions, hashtags, and links
 */
export const defaultParseContent = (text: string): ContentSegment[] => {
  if (!text) return [];

  // Combined regex to match mentions, hashtags, and URLs
  const regex = /(@[a-zA-Z0-9_]{1,50}|#[a-zA-Z0-9_]+|https?:\/\/[^\s]+)/g;
  const segments: ContentSegment[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        text: text.slice(lastIndex, match.index),
        key: `text-${lastIndex}`,
      });
    }

    // Add the matched segment
    const matchedText = match[0];
    let type: ContentSegment["type"] = "text";
    if (matchedText.startsWith("@")) {
      type = "mention";
    } else if (matchedText.startsWith("#")) {
      type = "hashtag";
    } else if (matchedText.startsWith("http")) {
      type = "link";
    }

    segments.push({
      type,
      text: matchedText,
      key: `${type}-${match.index}`,
    });

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: "text",
      text: text.slice(lastIndex),
      key: `text-${lastIndex}`,
    });
  }

  return segments;
};

/* -------------------------------------------------------------------------- */
/*                            Default Renderer                                */
/* -------------------------------------------------------------------------- */

/**
 * Default segment renderer with styling for mentions, hashtags, and links
 */
export const defaultRenderSegment = (segment: ContentSegment) => {
  const baseClasses = "";
  let segmentClasses = "";

  switch (segment.type) {
    case "mention":
      segmentClasses = "text-blue-500 font-medium";
      break;
    case "hashtag":
      segmentClasses = "text-blue-400 font-medium";
      break;
    case "link":
      segmentClasses = "text-blue-500 underline";
      break;
    default:
      segmentClasses = "";
  }

  return (
    <span key={segment.key} className={cn(baseClasses, segmentClasses)}>
      {segment.text}
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Component                                     */
/* -------------------------------------------------------------------------- */

const ContentEditableComponent = React.forwardRef<
  HTMLDivElement,
  ContentEditableProps
>(
  (
    {
      value = "",
      onChange,
      placeholder,
      maxLength,
      disabled = false,
      noHover = false,
      className,
      containerClassName,
      parseContent = defaultParseContent,
      renderSegment = defaultRenderSegment,
      onFocus,
      onBlur,
      onKeyDown,
      onPaste,
      skipCursorRestoration,
      ...props
    },
    forwardedRef,
  ) => {
    const innerRef = React.useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = React.useState(false);
    const isComposingRef = React.useRef(false);
    const isInternalUpdateRef = React.useRef(false);

    // Combine forwarded ref with inner ref
    React.useImperativeHandle(forwardedRef, () => innerRef.current!);

    /* ---------------------------------------------------------------------- */
    /*                         Extract Plain Text                             */
    /* ---------------------------------------------------------------------- */

    const extractPlainText = (element: HTMLElement): string => {
      let text = "";
      element.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent || "";
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          if (el.tagName === "BR") {
            text += "\n";
          } else if (el.tagName === "DIV") {
            if (text && !text.endsWith("\n")) {
              text += "\n";
            }
            text += extractPlainText(el);
            if (!text.endsWith("\n")) {
              text += "\n";
            }
          } else {
            text += extractPlainText(el);
          }
        }
      });
      return text;
    };

    /* ---------------------------------------------------------------------- */
    /*                      Save/Restore Cursor Position                      */
    /* ---------------------------------------------------------------------- */

    const saveCursorPosition = (): number => {
      const selection = window.getSelection();
      if (!selection || !innerRef.current || selection.rangeCount === 0) {
        return 0;
      }

      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(innerRef.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      return preCaretRange.toString().length;
    };

    const restoreCursorPosition = (position: number) => {
      if (!innerRef.current) return;

      const selection = window.getSelection();
      if (!selection) return;

      let currentPos = 0;
      let found = false;

      const traverseNodes = (node: Node): boolean => {
        if (node.nodeType === Node.TEXT_NODE) {
          const textLength = node.textContent?.length || 0;
          if (currentPos + textLength >= position) {
            const offset = position - currentPos;
            const range = document.createRange();
            range.setStart(node, Math.min(offset, textLength));
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            return true;
          }
          currentPos += textLength;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          for (const child of Array.from(node.childNodes)) {
            if (traverseNodes(child)) return true;
          }
        }
        return false;
      };

      traverseNodes(innerRef.current);
    };

    /* ---------------------------------------------------------------------- */
    /*                            Event Handlers                              */
    /* ---------------------------------------------------------------------- */

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      if (isComposingRef.current) return;

      const element = e.currentTarget;
      const plainText = extractPlainText(element);

      // Enforce max length
      if (maxLength && plainText.length > maxLength) {
        // Restore previous value
        if (innerRef.current) {
          innerRef.current.textContent = value;
        }
        return;
      }

      // Mark this as an internal update
      isInternalUpdateRef.current = true;

      // Call onChange with plain text
      onChange?.(plainText);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();

      const text = e.clipboardData.getData("text/plain");
      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        // Check max length
        const currentText = extractPlainText(innerRef.current!);
        const newText =
          currentText.slice(0, range.startOffset) +
          text +
          currentText.slice(range.startOffset);

        if (maxLength && newText.length > maxLength) {
          // Truncate pasted text
          const allowedLength = maxLength - currentText.length;
          const truncatedText = text.slice(0, allowedLength);
          range.insertNode(document.createTextNode(truncatedText));
        } else {
          range.insertNode(document.createTextNode(text));
        }

        // Move cursor to end of pasted text
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      // Trigger input event to update value
      handleInput({
        currentTarget: innerRef.current!,
      } as React.FormEvent<HTMLDivElement>);

      onPaste?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      // Prevent line breaks if not desired (optional)
      // if (e.key === 'Enter' && !e.shiftKey) {
      //   e.preventDefault();
      // }

      onKeyDown?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleCompositionStart = () => {
      isComposingRef.current = true;
    };

    const handleCompositionEnd = (
      e: React.CompositionEvent<HTMLDivElement>,
    ) => {
      isComposingRef.current = false;
      handleInput(e as React.FormEvent<HTMLDivElement>);
    };

    /* ---------------------------------------------------------------------- */
    /*                           Render Segments                              */
    /* ---------------------------------------------------------------------- */

    const segments = React.useMemo(() => {
      return parseContent(value);
    }, [value, parseContent]);

    const renderedContent = React.useMemo(() => {
      return segments.map((segment, idx) => (
        <React.Fragment key={segment.key || `segment-${idx}`}>
          {renderSegment(segment)}
        </React.Fragment>
      ));
    }, [segments, renderSegment]);

    /* ---------------------------------------------------------------------- */
    /*                           Sync Content                                 */
    /* ---------------------------------------------------------------------- */

    // Update content when value changes (from external or internal sources)
    React.useEffect(() => {
      if (!innerRef.current) return;

      const currentText = extractPlainText(innerRef.current);

      // If this was an internal update (user typing), don't update DOM
      if (isInternalUpdateRef.current) {
        isInternalUpdateRef.current = false;
        return;
      }

      // If value changed externally, update DOM
      if (currentText !== value) {
        // Check if we should skip cursor restoration (e.g., mention selection)
        const shouldSkipRestore = skipCursorRestoration?.current || false;
        if (shouldSkipRestore) {
          skipCursorRestoration!.current = false;
        }

        const cursorPos = shouldSkipRestore ? 0 : saveCursorPosition();
        innerRef.current.textContent = value;

        // Only restore cursor if element is focused and we shouldn't skip
        if (isFocused && !shouldSkipRestore) {
          requestAnimationFrame(() => {
            restoreCursorPosition(cursorPos);
          });
        }
      }
    }, [value, isFocused]);

    /* ---------------------------------------------------------------------- */
    /*                              Render                                    */
    /* ---------------------------------------------------------------------- */

    const showPlaceholder = !value && !isFocused;

    return (
      <div className={cn("relative w-full max-w-full", containerClassName)}>
        {/* Placeholder */}
        {showPlaceholder && (
          <div
            className="absolute inset-0 px-3 py-2 pointer-events-none
              text-muted-foreground"
            aria-hidden
          >
            {placeholder}
          </div>
        )}

        {/* Highlighted overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-1 px-3 py-2
            whitespace-pre-wrap break-words overflow-hidden max-w-full"
          style={{ overflowWrap: "anywhere" }}
          aria-hidden
        >
          {renderedContent}
        </div>

        {/* Editable area */}
        <div
          ref={innerRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          data-slot="content-editable"
          role="textbox"
          aria-multiline="true"
          aria-disabled={disabled}
          style={{ overflowWrap: "anywhere" }}
          className={cn(
            `bg-base-200 placeholder:text-muted-foreground selection:bg-primary
            dark:bg-input/30 border-base-400 flex w-full min-w-0 rounded-md
            border px-3 py-2 !text-base shadow-xs transition-colors duration-150
            outline-none disabled:pointer-events-none
            disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
            min-h-[80px] resize-none whitespace-pre-wrap break-words
            overflow-y-auto overflow-x-hidden max-w-full`,
            `focus-visible:border-ring focus-visible:ring-ring/50
            focus-visible:ring-[3px] focus-visible:bg-base-400`,
            `aria-invalid:ring-destructive/20
            dark:aria-invalid:ring-destructive/40
            aria-invalid:border-destructive`,
            noHover ? "" : "hover:bg-base-300 hover:border-base-600",
            // Make text transparent so overlay shows
            "caret-white",
            "text-transparent",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

ContentEditableComponent.displayName = "ContentEditable";

export { ContentEditableComponent as ContentEditable };
