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
import { useSocialPostById } from "@/features/social/queries/use-social-post-by-id";
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
  const [replyComment, setReplyComment] = useState<CommentPost | null>(null);
  const isLocked = useIsSocialPostLocked(socialPost);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-4 items-start w-full">
        <div className="flex flex-col w-full">
          <SocialPostProvider
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
              withMenu
            />
            {isLocked ? null : (
              <>
                <CommentsFeed
                  post={socialPost}
                  className="!overflow-auto !max-h-full"
                  onCommentReply={(comment) => setReplyComment(comment)}
                />
                <div
                  className="sticky -bottom-4 pb-4 w-full shrink-0 bg-[#11111180]
                    backdrop-blur-xl"
                >
                  <CommentSend
                    post={socialPost}
                    replyComment={replyComment}
                    className="rounded-br-md rounded-bl-md z-1 border"
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
