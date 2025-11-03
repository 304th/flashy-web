"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, Clock, X } from "lucide-react";
import { useUsersSearchByUsername } from "@/features/common/queries/use-users-search-by-username";
import { useOutsideAction } from "@/hooks/use-outside-action";
import { UserProfile } from "@/components/ui/user-profile";

type RecentUser = Pick<User, "fbId" | "username" | "userimage">;

const RECENT_KEY = "recentUserSearches";
const MAX_RECENTS = 8;

export const HeaderUserSearch = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [debounced, setDebounced] = useState("");
  const [recents, setRecents] = useState<RecentUser[]>([]);

  // Load recents once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setRecents(parsed);
        }
      }
    } catch {}
  }, []);

  // Debounce input value
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value.trim()), 300);
    return () => clearTimeout(t);
  }, [value]);

  // Query users when debounced value present
  const [users, query] = useUsersSearchByUsername(debounced, {
    hideMyself: true,
  });

  // Close on outside click / ESC
  useOutsideAction(containerRef, () => setOpen(false));

  const showRecents = open && !value && recents.length > 0;
  const showResults = open && Boolean(debounced);

  const onFocus = () => setOpen(true);

  const saveRecents = useCallback((next: RecentUser[]) => {
    setRecents(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const addRecent = useCallback(
    (user: RecentUser) => {
      const existing = recents.filter((r) => r.fbId !== user.fbId);
      const next = [user, ...existing].slice(0, MAX_RECENTS);
      saveRecents(next);
    },
    [recents, saveRecents],
  );

  const clearRecents = useCallback(() => saveRecents([]), [saveRecents]);

  const results = useMemo(() => users || [], [users]);
  const isLoading = Boolean(query?.isFetching);

  return (
    <div ref={containerRef} className="relative w-full max-w-[420px]">
      <Input
        placeholder="Search users..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={onFocus}
        className="pr-10"
        trailingIcon={<Search className="h-4 w-4 text-muted-foreground" />}
      />

      {(showResults || showRecents) && (
        <div
          className="absolute left-0 right-0 mt-2 bg-base-300 border border-base-400 rounded-md shadow-md z-50 overflow-hidden"
        >
          {showResults && (
            <div className="flex flex-col max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">Searching…</div>
              ) : results.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">No users found</div>
              ) : (
                results.map((u) => (
                  <Link
                    key={u.fbId}
                    href={`/channel/social?id=${u.fbId}`}
                    onClick={() => {
                      addRecent({ fbId: u.fbId, username: u.username, userimage: u.userimage });
                      setOpen(false);
                      setValue("");
                    }}
                    className="px-2 py-1.5 hover:bg-base-400 hover:text-white"
                  >
                    <UserProfile user={u as any} isLinkable={false} />
                  </Link>
                ))
              )}
            </div>
          )}

          {showRecents && (
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Recent searches
                </div>
                <button
                  className="text-muted-foreground hover:text-foreground"
                  onClick={clearRecents}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex flex-col max-h-80 overflow-y-auto">
                {recents.map((u) => (
                  <Link
                    key={u.fbId}
                    href={`/channel/social?id=${u.fbId}`}
                    onClick={() => {
                      setOpen(false);
                      setValue("");
                    }}
                    className="px-2 py-1.5 hover:bg-base-400 hover:text-white"
                  >
                    <UserProfile user={u as any} isLinkable={false} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


