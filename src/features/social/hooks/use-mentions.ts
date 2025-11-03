"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { api } from "@/services/api";

type TextElement = HTMLInputElement | HTMLTextAreaElement;

export interface UseMentionsOptions {
  textareaRef: RefObject<TextElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  getValue: () => string;
  setValue: (next: string) => void;
}

export const useMentions = ({
  textareaRef,
  containerRef,
  getValue,
  setValue,
}: UseMentionsOptions) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });
  const [portalReady, setPortalReady] = useState(false);
  const [anchorStart, setAnchorStart] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const suppressNextOpenRef = useRef(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => setPortalReady(true), []);

  const currentMention = useMemo(() => {
    const el = textareaRef.current;
    const value = getValue() || "";
    if (!el) return null;
    const caret = el.selectionStart ?? value.length;
    const before = value.substring(0, caret);
    const lastSpace = Math.max(
      before.lastIndexOf(" "),
      before.lastIndexOf("\n"),
      before.lastIndexOf("\t"),
    );
    const segment = before.substring(lastSpace + 1);
    const match = segment.match(/^@([a-zA-Z0-9_]{1,20})$/);
    if (!match) return null;
    const start = caret - segment.length;
    const end = caret;
    return { query: match[1], start, end } as const;
  }, [getValue(), textareaRef.current?.selectionStart]);

  const computeCaretPosition = (index?: number) => {
    const ta = textareaRef.current;
    if (!ta) return { left: 8, top: 28 };

    const style = window.getComputedStyle(ta);
    const div = document.createElement("div");
    const span = document.createElement("span");
    const caret = document.createElement("span");
    const value = ta.value;
    const caretIndex = index ?? ta.selectionStart ?? value.length;

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
        suppressNextOpenRef.current = false;
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

      const caret = el.selectionStart ?? value.length;

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

      if (/^[a-zA-Z0-9_]{0,20}$/.test(tokenBody)) {
        setQuery(tokenBody);
      } else {
        close();
        setAnchorStart(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValue(), textareaRef.current?.selectionStart, isFocused]);

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

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const users = await api
          .get("users/search", { searchParams: { username: query } })
          .json<User[]>();
        setResults(users || []);
      } catch (e) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
  }, [open, query]);

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
    setResults([]);
    setLoading(false);
  };

  const handleSelect = (user: Partial<User>) => {
    const el = textareaRef.current;
    const value = getValue() || "";

    if (!el) {
      return;
    }

    const caret = el.selectionStart ?? value.length;
    const start = anchorStart ?? caret;
    const nextValue =
      value.slice(0, start) + `@${user.username} ` + value.slice(caret);
    setValue(nextValue);
    const newCaret = (value.slice(0, start) + `@${user.username} `).length;

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newCaret, newCaret);
    });
    close();
    setAnchorStart(null);
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




