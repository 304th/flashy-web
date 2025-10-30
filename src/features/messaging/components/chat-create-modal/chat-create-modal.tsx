"use client";

import { useEffect, useMemo, useState } from "react";
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
import { api } from "@/services/api";

export interface ChatCreateModalProps {
  onClose(): void;
  onCreateChat?: (user: User) => void;
}

export const ChatCreateModal = ({
  onClose,
  onCreateChat,
  ...props
}: ChatCreateModalProps) => {
  const { data: followings, query } = useProfileFollowings();

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [searchResults, setSearchResults] = useState<User[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

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
    if (searchResults) return searchResults;
    return followings ?? null;
  }, [followings, searchResults]);

  return (
    <Modal onClose={onClose} className={"!p-0"} {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col rounded-md gap-4"
      >
        <div className="flex w-full px-4 pt-4 pb-2 gap-4 items-center">
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
          <div className="flex flex-col py-4 w-full">
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
                        onSelect={(u) => {
                          onCreateChat?.(u);
                          onClose();
                        }}
                      />
                    ))
                  )}
                </div>
              )}
            </Loadable>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
};

const UserRow = ({
  user,
  onSelect,
}: {
  user: User;
  onSelect: (u: User) => void;
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
          variant="ghost"
          aria-label={`Start chat with ${user?.username}`}
          onClick={() => onSelect(user)}
        >
          <PlusIcon />
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
