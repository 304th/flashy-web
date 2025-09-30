import { useContext, createContext, type PropsWithChildren } from "react";
import type { OptimisticUpdate } from "@/lib/query-toolkit";
import type { AddReactionParams } from "@/features/reactions/queries/use-add-reaction";
import type { RemoveReactionParams } from "@/features/reactions/queries/use-remove-reaction";
import type { RelightSocialPostParams } from "@/features/social/mutations/use-relight-social-post";
import type { VotePollParams } from "@/features/social/mutations/use-vote-poll";
import type { PinSocialPostParams } from "@/features/social/mutations/use-pin-social-post";
import type { MuteChannelParams } from "@/features/channels/mutations/use-mute-channel";
import type { UnmuteChannelParams } from "@/features/channels/mutations/use-unmute-channel";

interface SocialPostContextType {
  likeUpdates?: OptimisticUpdate<AddReactionParams>[];
  unlikeUpdates?: OptimisticUpdate<RemoveReactionParams>[];
  relightUpdates?: OptimisticUpdate<RelightSocialPostParams>[];
  votePollUpdates?: OptimisticUpdate<VotePollParams>[];
  pinUpdates?: OptimisticUpdate<PinSocialPostParams>[];
  muteUpdates?: OptimisticUpdate<MuteChannelParams>[];
  unmuteUpdates?: OptimisticUpdate<UnmuteChannelParams>[];
  onCommentsOpen?: (postId: string) => void;
  onShareOpen?: (socialPost: SocialPost) => void;
}

const SocialPostContext = createContext<SocialPostContextType>({});

export const useSocialPostContext = () => {
  const context = useContext(SocialPostContext);

  if (context === undefined) {
    throw new Error(
      "useSocialPostContext must be used within a SocialPostProvider",
    );
  }

  return context;
};

export const SocialPostProvider = ({
  likeUpdates,
  unlikeUpdates,
  relightUpdates,
  votePollUpdates,
  pinUpdates,
  muteUpdates,
  unmuteUpdates,
  onCommentsOpen,
  onShareOpen,
  children,
}: PropsWithChildren<SocialPostContextType>) => {
  return (
    <SocialPostContext.Provider
      value={{
        likeUpdates,
        unlikeUpdates,
        relightUpdates,
        votePollUpdates,
        pinUpdates,
        muteUpdates,
        unmuteUpdates,
        onCommentsOpen,
        onShareOpen,
      }}
    >
      {children}
    </SocialPostContext.Provider>
  );
};
