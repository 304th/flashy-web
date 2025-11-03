"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SearchIcon } from "lucide-react";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { ConversationCreateMessageUser } from "@/features/messaging/components/conversation-create-modal/conversation-create-message-user";
import { useProfileFollowings } from "@/features/profile/queries/use-profile-followings";
import { useDebouncedValue } from "@tanstack/react-pacer/debouncer";
import { useUsersSearchByUsername } from "@/features/common/queries/use-users-search-by-username";
import { useCreateConversation } from "@/features/messaging/mutations/use-create-conversation";
import { useProfileFollowers } from "@/features/profile/queries/use-profile-followers";
import { uniqBy } from "@/lib/utils";

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
  const { data: followerUsers, query: followersQuery } = useProfileFollowers();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, { wait: 500 });
  const [foundUsers, usersSearchQuery] = useUsersSearchByUsername(
    debouncedSearch,
    { hideMyself: true },
  );
  const createConversation = useCreateConversation();
  const subs = useMemo(
    () =>
      uniqBy(
        [...(followerUsers || []), ...(followingUsers || [])],
        (user) => user?.fbId,
      ),
    [followingUsers, followerUsers],
  );

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
          <div className="flex flex-col w-full gap-4">
            {debouncedSearch && (
              <div className="flex flex-col w-full gap-2">
                <Separator>Search results:</Separator>
                <Loadable queries={[usersSearchQuery]} fullScreenForDefaults>
                  {() =>
                    foundUsers && foundUsers.length ? (
                      foundUsers.map((foundUser) => (
                        <ConversationCreateMessageUser
                          key={foundUser.fbId}
                          user={foundUser}
                          onStartConversation={() => {
                            createConversation.mutate({
                              members: [foundUser],
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
            )}
            <div className="flex flex-col w-full gap-2">
              <Separator>Your subs and followers:</Separator>
              <div className="flex flex-col w-full">
                <Loadable
                  queries={[followingsQuery, followersQuery] as any}
                  fullScreenForDefaults
                >
                  {() =>
                    subs && subs?.length > 0 ? (
                      subs.map((sub) => (
                        <ConversationCreateMessageUser
                          key={sub.fbId}
                          user={sub}
                          onStartConversation={() => {
                            createConversation.mutate({
                              members: [sub],
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
        </div>
      </motion.div>
    </Modal>
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
