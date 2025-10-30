"use client";

import { useEffect, useMemo, useState } from "react";
// import { useForm } from 'react-hook-form'
import { motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { PlusIcon, CheckIcon, SearchIcon } from "lucide-react";
import { useProfileFollowings } from "@/features/profile/queries/use-profile-followings";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { useCreateConversation } from "@/features/messaging/mutations/use-create-conversation";
import { api } from "@/services/api";

export interface ConversationCreateModalProps {
  onClose(): void;
  onCreateChat?: (user: User) => void;
}

export const ConversationCreateModal = ({
  onClose,
  onCreateChat,
  ...props
}: ConversationCreateModalProps) => {
  const { data: followings, query } = useProfileFollowings();

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [searchResults, setSearchResults] = useState<User[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pinnedUsers, setPinnedUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const createConversation = useCreateConversation();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const run = async () => {
      if (!debounced) {
        setSearchResults(null);
        return;
      }
      setSearchLoading(true);
      try {
        const users = await api
          .get("users/search", { searchParams: { username: debounced } })
          .json<User[]>();
        setSearchResults(users);
      } catch (e) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };
    run();
  }, [debounced]);

  const list: User[] | null = useMemo(() => {
    const base = searchResults ?? followings ?? null;
    if (!base && pinnedUsers.length === 0) return base;

    // Merge pinned users at the top, then the rest without duplicates
    const dedupe = new Map<string, User>();
    for (const u of pinnedUsers) dedupe.set(u.fbId, u);
    if (base) {
      for (const u of base) if (!dedupe.has(u.fbId)) dedupe.set(u.fbId, u);
    }
    return Array.from(dedupe.values());
  }, [followings, searchResults, pinnedUsers]);

  return (
    <Modal onClose={onClose} className={"!p-0"} {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col rounded-md"
      >
        <div className="flex w-full p-4 gap-4 items-center">
          <div className="absolute right-2 top-2" onClick={onClose}>
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <p className="text-2xl font-extrabold text-white">Add a Chat</p>
          </div>
        </div>
        <div className="flex flex-col w-full px-4">
          <Input
            value={search}
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
            placeholder="Search your friends..."
            trailingIcon={
              <SearchIcon className="size-5 text-muted-foreground" />
            }
            containerClassname="w-full"
          />
          <div className="flex flex-col w-full">
            <Loadable queries={[query] as any} fullScreenForDefaults>
              {() => (
                <div
                  className="flex flex-col w-full divide-y divide-base-400/60"
                >
                  {searchLoading ? (
                    <div
                      className="flex items-center justify-center
                        text-muted-foreground"
                    >
                      Searching…
                    </div>
                  ) : !list || list.length === 0 ? (
                    <NotFound>No users found</NotFound>
                  ) : (
                    list.map((user) => (
                      <UserRow
                        key={user.fbId}
                        user={user}
                        selected={selectedIds.has(user.fbId)}
                        onSelect={(u, isSelected) => {
                          if (isSelected) {
                            // Unselect and unpin
                            setSelectedIds((prev) => {
                              const next = new Set(prev);
                              next.delete(u.fbId);
                              return next;
                            });
                            setPinnedUsers((prev) =>
                              prev.filter((p) => p.fbId !== u.fbId),
                            );
                          } else {
                            // Select and pin
                            setSelectedIds((prev) => new Set(prev).add(u.fbId));
                            setPinnedUsers((prev) => {
                              if (prev.find((p) => p.fbId === u.fbId))
                                return prev;
                              return [u, ...prev];
                            });
                            onCreateChat?.(u);
                          }
                        }}
                      />
                    ))
                  )}
                </div>
              )}
            </Loadable>
          </div>
        </div>
        <div className="flex justify-end w-full p-4 border-t">
          <Button
            disabled={selectedIds.size === 0}
            pending={createConversation.isPending}
            className="w-[80px]"
            onClick={() => {
              createConversation.mutate(
                {
                  members: [...selectedIds],
                },
                {
                  onSuccess: onClose,
                },
              );
            }}
          >
            Create
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

const UserRow = ({
  user,
  onSelect,
  selected,
}: {
  user: User;
  onSelect: (u: User, selected: boolean) => void;
  selected?: boolean;
}) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3 min-w-0">
        <UserAvatar avatar={user?.userimage} className="size-10" />
        <div className="flex flex-col min-w-0">
          <p className="text-white font-medium truncate">{user?.username}</p>
          <p className="text-muted-foreground text-sm truncate">
            @{user?.username}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <Button
          size="icon"
          variant={selected ? "secondary" : "ghost"}
          aria-label={`Start chat with ${user?.username}`}
          onClick={() => onSelect(user, Boolean(selected))}
        >
          {selected ? <CheckIcon /> : <PlusIcon />}
        </Button>
      </div>
    </div>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className="!p-0 w-[600px] bg-base-300 max-sm:w-[calc(100%-2rem)]"
    header={null}
    footer={null}
  />
);
