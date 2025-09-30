"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { SocialPost } from "@/features/social/components/social-post/social-post";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { IconButton } from "@/components/ui/icon-button";
import { CommentsFeed } from "@/features/comments/components/comments-feed/comments-feed";
import { CommentSend } from "@/features/comments/components/comment-send/comment-send";
import { SocialPostProvider } from "@/features/social/components/social-post/social-post-context";
import { useQueryParams } from "@/hooks/use-query-params";
import { useModals } from "@/hooks/use-modals";
import { useMe } from "@/features/auth/queries/use-me";
import { useSocialPostById } from "@/features/social/queries/use-social-post-by-id";
import {
  addReactionToPost,
  deleteReactionFromPost,
} from "@/features/social/hooks/use-social-feed-reaction-updates";
import { relightSocialPost } from "@/features/social/hooks/use-social-feed-relight-updates";
import { useComments } from "@/features/comments/queries/use-comments";
import { useIsSocialPostLocked } from "@/features/social/hooks/use-is-social-post-locked";

export default function SocialPostPage() {
  return (
    <Suspense>
      <SocialPostByIdPage />
    </Suspense>
  );
}

const SocialPostByIdPage = () => {
  const id = useQueryParams("id");
  const { data: socialPost, query } = useSocialPostById(id!);
  const router = useRouter();

  if (!id) {
    return <SocialPostNotFound />;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-4 items-center">
        <IconButton size="lg" onClick={() => router.back()}>
          <ArrowLeftIcon />
        </IconButton>
        <p className="text-white text-xl font-bold">Post</p>
      </div>
      <Loadable queries={[query]}>
        {() =>
          socialPost ? (
            <SocialPostDetails socialPost={socialPost} />
          ) : (
            <SocialPostNotFound />
          )
        }
      </Loadable>
    </div>
  );
};

const SocialPostDetails = ({
  socialPost,
}: {
  socialPost: Optimistic<SocialPost>;
}) => {
  const { openModal } = useModals();
  const { data: me } = useMe();
  const [replyComment, setReplyComment] = useState<CommentPost | null>(null);
  const { optimisticUpdates } = useSocialPostById(socialPost._id);
  const { optimisticUpdates: comments } = useComments(socialPost._id);
  const isLocked = useIsSocialPostLocked(socialPost);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-4 items-start w-full">
        <div className="flex flex-col w-full">
          <SocialPostProvider
            likeUpdates={[
              () => optimisticUpdates.update(addReactionToPost(me!)),
            ]}
            unlikeUpdates={[
              () => optimisticUpdates.update(deleteReactionFromPost(me!)),
            ]}
            relightUpdates={[
              (params) =>
                optimisticUpdates.update(relightSocialPost(me!, params)),
            ]}
            onShareOpen={() =>
              openModal("ShareModal", {
                id: socialPost._id,
                type: "social",
              })
            }
          >
            <SocialPost
              socialPost={socialPost}
              className="!bg-[linear-gradient(180deg,#191919_0%,#191919_0.01%,#151515_100%)]"
            />
            {isLocked ? null : (
              <>
                <CommentsFeed
                  post={socialPost}
                  className="!overflow-auto !max-h-full"
                  onCommentReply={(comment) => setReplyComment(comment)}
                />
                <div
                  className="sticky bottom-0 pb-4 w-full shrink-0 bg-[#11111180]
                    backdrop-blur-xl"
                >
                  <CommentSend
                    post={socialPost}
                    replyComment={replyComment}
                    className="rounded-br-md rounded-bl-md z-1 border"
                    sendCommentUpdates={[
                      async (params) => {
                        return await comments.prepend(params, { sync: true });
                      },
                      async () => {
                        return await optimisticUpdates.update((post) => {
                          post.commentsCount += 1;
                        });
                      },
                    ]}
                    onCloseReply={() => setReplyComment(null)}
                  />
                </div>
              </>
            )}
          </SocialPostProvider>
        </div>
      </div>
    </div>
  );
};

const SocialPostNotFound = () => (
  <NotFound>Social post does not exist.</NotFound>
);
