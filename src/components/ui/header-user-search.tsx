"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Clock, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUsersSearchByUsername } from "@/features/common/queries/use-users-search-by-username";
import { useOutsideAction } from "@/hooks/use-outside-action";
import { UserProfile } from "@/components/ui/user-profile";

// Constants
const RECENT_KEY = "recentUserSearches";
const MAX_RECENTS = 8;
const DEBOUNCE_DELAY = 300;

// Types
type RecentUser = Pick<User, "fbId" | "username" | "userimage">;

interface UserItemProps {
  user: RecentUser;
  onClick: () => void;
}

interface SearchResultsProps {
  isLoading: boolean;
  results: RecentUser[];
  onUserClick: (user: RecentUser) => void;
}

interface RecentSearchesProps {
  recents: RecentUser[];
  onUserClick: () => void;
  onClear: () => void;
}

// Sub-components
const UserItem = ({ user, onClick }: UserItemProps) => (
  <Link
    href={`/channel/social?id=${user.fbId}`}
    onClick={onClick}
    className="p-2 transition hover:bg-base-400 hover:text-white"
  >
    <UserProfile user={user} isLinkable={false} />
  </Link>
);

const SearchResults = ({
  isLoading,
  results,
  onUserClick,
}: SearchResultsProps) => (
  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col max-h-80 overflow-y-auto">
    {isLoading ? (
      <div className="p-4 flex items-center justify-center text-sm text-muted-foreground"><Spinner /></div>
    ) : results.length === 0 ? (
      <div className="px-3 py-2 text-sm text-muted-foreground">
        No users found
      </div>
    ) : (
      results.map((user) => (
        <UserItem
          key={user.fbId}
          user={user}
          onClick={() => onUserClick(user)}
        />
      ))
    )}
  </motion.div>
);

const RecentSearches = ({
  recents,
  onUserClick,
  onClear,
}: RecentSearchesProps) => (
  <div className="flex flex-col">
    <div
      className="flex items-center justify-between px-3 py-2 text-xs
        text-muted-foreground"
    >
      <div className="flex items-center gap-2">
        <Clock className="h-3.5 w-3.5" />
        Recent searches
      </div>
      <Button
        variant="ghost"
        size="xs"
        className="text-muted-foreground hover:text-foreground"
        onClick={onClear}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
    <div className="flex flex-col max-h-80 overflow-y-auto">
      {recents.map((user) => (
        <UserItem key={user.fbId} user={user} onClick={onUserClick} />
      ))}
    </div>
  </div>
);

// Main Component
export const HeaderUserSearch = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [debounced, setDebounced] = useState("");
  const [recents, setRecents] = useState<RecentUser[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setRecents(parsed);
        }
      }
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(
      () => setDebounced(value.trim()),
      DEBOUNCE_DELAY,
    );
    return () => clearTimeout(timeout);
  }, [value]);

  // Fetch users based on debounced search value
  const [users, query] = useUsersSearchByUsername(debounced);

  // Close dropdown on outside click
  useOutsideAction(containerRef as React.RefObject<HTMLElement>, () =>
    setOpen(false),
  );

  // Computed values
  const showRecents = open && !value && recents.length > 0;
  const showResults = open && Boolean(debounced);
  const results = useMemo(() => users || [], [users]);
  const isLoading = Boolean(query?.isFetching);

  // Event handlers
  const handleFocus = () => setOpen(true);

  const saveRecents = useCallback((next: RecentUser[]) => {
    setRecents(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // Silently fail if localStorage is unavailable
    }
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

  const handleUserClick = (user: RecentUser) => {
    addRecent({
      fbId: user.fbId,
      username: user.username,
      userimage: user.userimage,
    });
    setOpen(false);
    setValue("");
  };

  const handleRecentClick = () => {
    setOpen(false);
    setValue("");
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-[420px]">
      <Input
        placeholder="Search users..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={handleFocus}
        className="pr-10"
        trailingIcon={<Search className="h-4 w-4 text-muted-foreground" />}
      />

      {(showResults || showRecents) && (
        <div
          className="absolute left-0 right-0 mt-2 bg-base-300 border
            border-base-400 rounded-md shadow-md z-50 overflow-hidden"
        >
          {showResults && (
            <SearchResults
              isLoading={isLoading}
              results={results}
              onUserClick={handleUserClick}
            />
          )}

          {showRecents && (
            <RecentSearches
              recents={recents}
              onUserClick={handleRecentClick}
              onClear={clearRecents}
            />
          )}
        </div>
      )}
    </div>
  );
};
