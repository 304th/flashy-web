"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
// import { useForm } from 'react-hook-form'
import { PlusIcon, CheckIcon, SearchIcon, ArrowRightIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Separator } from "@/components/ui/separator";
import { useProfileFollowings } from "@/features/profile/queries/use-profile-followings";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { useDebouncedValue } from "@tanstack/react-pacer/debouncer";
// import { useCreateConversation } from "@/features/messaging/mutations/use-create-conversation";
// import { api } from "@/services/api";
import { useUsersSearchByUsername } from "@/features/common/queries/use-users-search-by-username";
import { useNewConversationUser } from "@/features/messaging/hooks/use-new-conversation-user";
import { useCreateConversation } from "@/features/messaging/mutations/use-create-conversation";

export interface ConversationCreateModalProps {
  onClose(): void;
  onCreateChat?: (user: User) => void;
}

export const ConversationCreateModal = ({
  onClose,
  onCreateChat,
  ...props
}: ConversationCreateModalProps) => {
  const { data: followingUsers, query: followingsQuery } =
    useProfileFollowings();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, { wait: 500 });
  const [foundUsers, usersSearchQuery] =
    useUsersSearchByUsername(debouncedSearch);
  const createConversation = useCreateConversation();

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
        <div className="flex flex-col w-full gap-4 p-4">
          <Input
            value={search}
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
            placeholder="Search your friends..."
            trailingIcon={
              <SearchIcon className="size-5 text-muted-foreground" />
            }
            containerClassname="w-full"
          />
          <div className="flex flex-col w-full gap-2">
            <Separator>Your subscriptions</Separator>
            <div className="flex flex-col w-full">
              <Loadable
                queries={[followingsQuery] as any}
                fullScreenForDefaults
              >
                {() =>
                  followingUsers && followingUsers?.length > 0 ? (
                    followingUsers.map((followingUser) => (
                      <MessageUser
                        key={followingUser.fbId}
                        user={followingUser}
                        onStartConversation={() => {
                          createConversation.mutate({
                            members: [followingUser],
                          });
                          onClose();
                        }}
                      />
                    ))
                  ) : (
                    <NotFound>No users found</NotFound>
                  )
                }
              </Loadable>
            </div>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
};

const MessageUser = ({
  user,
  onStartConversation,
}: {
  user: User;
  onStartConversation: () => void;
}) => {
  return (
    <div
      className="group relative flex items-center justify-between p-2 rounded-md
        cursor-pointer transition hover:bg-base-250 overflow-hidden"
      onClick={onStartConversation}
    >
      <div className="flex items-center gap-3 min-w-0">
        <UserAvatar avatar={user?.userimage} className="size-10" />
        <div className="flex flex-col min-w-0">
          <p className="text-white font-medium truncate">{user?.username}</p>
          <p className="text-muted-foreground text-sm truncate">
            @{user?.username}
          </p>
        </div>
      </div>
      <div
        className="opacity-0 transition translate-x-[8px]
          group-hover:opacity-100 group-hover:translate-0
          group-hover:text-white"
      >
        <ArrowRightIcon />
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
