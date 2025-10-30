import React, { useRef } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useMentions } from "@/features/social/hooks/use-mentions";

/* -------------------------------------------------------------------------- */
/*                              Types & Interfaces                            */
/* -------------------------------------------------------------------------- */

type TextElement = HTMLInputElement | HTMLTextAreaElement;

interface MentionUser {
  fbId?: string;
  id?: string;
  username: string;
  userimage?: string;
}

interface MentionsWrapperProps {
  value: string;
  onChange: (next: string) => void;
  children: (props: {
    /** Ref that works for both <input> and <textarea> */
    ref: (instance: TextElement | null) => void;
    onMouseDown: (e: React.MouseEvent<TextElement>) => void;
    onFocus: (e: React.FocusEvent<TextElement>) => void;
    onBlur: (e: React.FocusEvent<TextElement>) => void;
  }) => React.ReactNode;
  containerClassName?: string;
  maxMentionDropdownWidth?: number | string; // e.g., 420
  mentionPlaceholder?: string;
}

/* -------------------------------------------------------------------------- */
/*                               Component                                    */
/* -------------------------------------------------------------------------- */

export const MentionsWrapper: React.FC<MentionsWrapperProps> = ({
  value,
  onChange,
  children,
  containerClassName = "",
  maxMentionDropdownWidth = 420,
  mentionPlaceholder = "Search users...",
}) => {
  /* Refs – union type is preserved for the whole lifetime */
  const textareaRef = useRef<TextElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* --------------------------------------------------------------- */
  /*   Hook – we assume it is typed to accept the union ref type.   */
  /* --------------------------------------------------------------- */
  const {
    open: mentionOpen,
    query: mentionQuery,
    setQuery: setMentionQuery,
    results: mentionResults,
    loading: mentionLoading,
    position: mentionPosition,
    portalReady,
    dropdownRef: mentionDropdownRef,
    apiForTextarea,
    handleSelect: handleSelectUser,
  } = useMentions({
    textareaRef,
    containerRef,
    getValue: () => value ?? "",
    setValue: onChange,
  });

  return (
    <div
      className={containerClassName}
      ref={containerRef}
      style={{ position: "relative" }}
    >
      {/* ---------------------------------------------------------------- */}
      {/*   Pass ref + event handlers to the wrapped input/textarea        */}
      {/* ---------------------------------------------------------------- */}
      {children({
        ref: (el) => {
          textareaRef.current = el;
        },
        onMouseDown: apiForTextarea.onMouseDown as (
          e: React.MouseEvent<TextElement>
        ) => void,
        onFocus: apiForTextarea.onFocus as (
          e: React.FocusEvent<TextElement>
        ) => void,
        onBlur: apiForTextarea.onBlur as (
          e: React.FocusEvent<TextElement>
        ) => void,
      })}

      {/* ---------------------------------------------------------------- */}
      {/*                     Mention dropdown portal                      */}
      {/* ---------------------------------------------------------------- */}
      {mentionOpen && portalReady && (
        createPortal(
          <div
            ref={mentionDropdownRef}
            className="z-[1000] w-full max-w-full md:max-w-[min(420px,100%)] rounded-2xl bg-base-200 ring-1 ring-inset ring-base-600 shadow-regular-md p-2 fixed"
            style={{
              left: mentionPosition.left,
              top: mentionPosition.top,
              maxWidth: `${maxMentionDropdownWidth}px`,
            }}
          >
            {/* Search input */}
            <div className="flex items-center gap-2 p-1">
              <Input
                value={mentionQuery}
                onChange={(e: any) => setMentionQuery(e.target.value)}
                placeholder={mentionPlaceholder}
                className="h-9"
              />
            </div>

            {/* Results list */}
            <div className="max-h-60 overflow-auto">
              {mentionLoading && (
                <div className="px-2 py-3 text-sm text-muted-foreground">
                  Searching...
                </div>
              )}

              {!mentionLoading && mentionResults.length === 0 && (
                <div className="px-2 py-3 text-sm text-muted-foreground">
                  No users found
                </div>
              )}

              {!mentionLoading &&
                mentionResults.map((user: MentionUser) => (
                  <button
                    type="button"
                    key={user.fbId ?? user.username}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-base-300 text-left"
                    onClick={() => handleSelectUser(user)}
                  >
                    <UserAvatar
                      avatar={user.userimage}
                      className="size-7"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        @{user.username}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>,
          document.body
        )
      )}
    </div>
  );
};
