"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useUsersSearchByUsername } from "@/features/common/queries/use-users-search-by-username";

type TextElement = HTMLInputElement | HTMLTextAreaElement | HTMLDivElement;

export interface UseMentionsOptions {
  textareaRef: RefObject<TextElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  getValue: () => string;
  setValue: (next: string) => void;
  isContentEditable?: boolean;
  skipCursorRestorationRef?: RefObject<boolean>;
}

export const useMentions = ({
  textareaRef,
  containerRef,
  getValue,
  setValue,
  isContentEditable = false,
  skipCursorRestorationRef,
}: UseMentionsOptions) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [position, setPosition] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });
  const [portalReady, setPortalReady] = useState(false);
  const [anchorStart, setAnchorStart] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const suppressNextOpenRef = useRef(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setPortalReady(true), []);

  // Debounce the search query
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  // Use the dedicated user search hook
  const [users, searchQuery] = useUsersSearchByUsername(
    open && debouncedQuery ? debouncedQuery : undefined,
  );
  const results = useMemo(() => users || [], [users]);
  const loading = Boolean(searchQuery?.isFetching);

  const getCaretPosition = (): number => {
    const el = textareaRef.current;
    if (!el) return 0;

    if (isContentEditable) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return 0;

      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(el);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      return preCaretRange.toString().length;
    } else {
      return (el as HTMLInputElement | HTMLTextAreaElement).selectionStart ?? 0;
    }
  };

  const setCaretPosition = (position: number) => {
    const el = textareaRef.current;
    if (!el) return;

    if (isContentEditable) {
      const selection = window.getSelection();
      if (!selection) return;

      let currentPos = 0;

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

      traverseNodes(el);
    } else {
      (el as HTMLInputElement | HTMLTextAreaElement).setSelectionRange(
        position,
        position,
      );
    }
  };

  const currentMention = useMemo(() => {
    const el = textareaRef.current;
    const value = getValue() || "";
    if (!el) return null;
    const caret = getCaretPosition();
    const before = value.substring(0, caret);
    const lastSpace = Math.max(
      before.lastIndexOf(" "),
      before.lastIndexOf("\n"),
      before.lastIndexOf("\t"),
    );
    const segment = before.substring(lastSpace + 1);
    const match = segment.match(/^@([a-zA-Z0-9_]{1,50})$/);
    if (!match) return null;
    const start = caret - segment.length;
    const end = caret;
    return { query: match[1], start, end } as const;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValue(), isContentEditable]);

  const computeCaretPosition = (index?: number) => {
    const ta = textareaRef.current;
    if (!ta) return { left: 8, top: 28 };

    if (isContentEditable) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        const rect = ta.getBoundingClientRect();
        return { left: rect.left + 8, top: rect.top + 28 };
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const taRect = ta.getBoundingClientRect();
      const style = window.getComputedStyle(ta);
      const lineHeight = parseFloat(style.lineHeight || "20");

      return {
        left: rect.left || taRect.left + 8,
        top: rect.bottom || taRect.top + (isFinite(lineHeight) ? lineHeight : 20),
      };
    }

    const style = window.getComputedStyle(ta);
    const div = document.createElement("div");
    const span = document.createElement("span");
    const caret = document.createElement("span");
    const value = (ta as HTMLInputElement | HTMLTextAreaElement).value;
    const caretIndex = index ?? (ta as HTMLInputElement | HTMLTextAreaElement).selectionStart ?? value.length;

    const properties = [
      "boxSizing",
      "width",
      "height",
      "overflow",
      "borderTopWidth",
      "borderRightWidth",
      "borderBottomWidth",
      "borderLeftWidth",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "fontStyle",
      "fontVariant",
      "fontWeight",
      "fontStretch",
      "fontSize",
      "fontFamily",
      "lineHeight",
      "letterSpacing",
      "textTransform",
      "textAlign",
      "textIndent",
      "whiteSpace",
      "wordBreak",
    ];
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";
    properties.forEach((prop) => {
      // @ts-ignore
      div.style[prop] = style.getPropertyValue(prop as any);
    });
    div.style.width = ta.clientWidth + "px";

    const before = value.substring(0, caretIndex);
    const after = value.substring(caretIndex) || ".";

    span.textContent = before;
    caret.textContent = "\u200b";

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

  useEffect(() => {
    const mention = currentMention;

    if (!open) {
      if (suppressNextOpenRef.current) {
        // Don't clear the flag immediately - wait a bit to handle multiple effect runs
        setTimeout(() => {
          suppressNextOpenRef.current = false;
        }, 100);
        return;
      }

      if (mention && mention.query.length >= 1) {
        if (!isFocused) return;
        setOpen(true);
        setAnchorStart(mention.start);
        setQuery(mention.query);
        const pos = computeCaretPosition(mention.start);
        setPosition({
          left: Math.max(0, pos.left),
          top: Math.max(0, pos.top + 12),
        });
      } else {
        close();
      }
    } else {
      const el = textareaRef.current;
      const value = getValue() || "";

      if (!el || anchorStart == null) {
        return;
      }

      const caret = getCaretPosition();

      if (
        anchorStart >= value.length ||
        value[anchorStart] !== "@" ||
        caret < anchorStart
      ) {
        close();
        setAnchorStart(null);
        return;
      }

      const token = value.slice(anchorStart, caret);
      const tokenBody = token.slice(1);

      if (/^[a-zA-Z0-9_]{0,50}$/.test(tokenBody)) {
        setQuery(tokenBody);
      } else {
        close();
        setAnchorStart(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValue(), isFocused]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const listener = () => {
      const pos = computeCaretPosition(
        anchorStart == null ? undefined : anchorStart,
      );
      setPosition({
        left: Math.max(0, pos.left),
        top: Math.max(0, pos.top + 12),
      });
    };

    window.addEventListener("resize", listener);
    window.addEventListener("scroll", listener, true);

    return () => {
      window.removeEventListener("resize", listener);
      window.removeEventListener("scroll", listener, true);
    };
  }, [open, anchorStart]);


  useEffect(() => {
    if (!open) {
      return;
    }

    const handleDocumentMouseDown = (e: MouseEvent) => {
      const dropdownEl = dropdownRef.current;
      const containerEl = containerRef.current;

      if (!dropdownEl || !containerEl) {
        return;
      }

      const target = e.target as Node;

      if (!dropdownEl.contains(target) && !containerEl.contains(target)) {
        setIsFocused(false);
        suppressNextOpenRef.current = true;
        close();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    document.addEventListener("mousedown", handleDocumentMouseDown, true);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown, true);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setDebouncedQuery("");
  };

  const handleSelect = (user: Partial<User>) => {
    const el = textareaRef.current;
    const value = getValue() || "";

    if (!el) {
      return;
    }

    const caret = getCaretPosition();
    const start = anchorStart ?? caret;
    const nextValue =
      value.slice(0, start) + `@${user.username} ` + value.slice(caret);

    // Close and suppress reopening before updating value
    close();
    setAnchorStart(null);
    suppressNextOpenRef.current = true;

    // Tell ContentEditable to skip cursor restoration
    if (skipCursorRestorationRef?.current !== undefined) {
      skipCursorRestorationRef.current = true;
    }

    setValue(nextValue);
    const newCaret = (value.slice(0, start) + `@${user.username} `).length;

    // Use double RAF to ensure this runs after all React updates and effects
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (document.activeElement !== el) {
          el.focus();
        }

        // For contenteditable, use Selection API directly
        if (isContentEditable) {
          const selection = window.getSelection();
          if (!selection) return;

          // Find the text node and set cursor at exact position
          const textNode = el.firstChild;

          if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            const range = document.createRange();
            const textLength = textNode.textContent?.length || 0;
            const safePosition = Math.min(newCaret, textLength);
            range.setStart(textNode, safePosition);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        } else {
          setCaretPosition(newCaret);
        }
      });
    });
  };

  const apiForTextarea = {
    onMouseDown: () => {
      if (open) {
        close();
        setAnchorStart(null);
      }

      suppressNextOpenRef.current = true;
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  } as const;

  return {
    open,
    query,
    setQuery,
    results,
    loading,
    position,
    portalReady,
    dropdownRef,
    apiForTextarea,
    handleSelect,
  } as const;
};
