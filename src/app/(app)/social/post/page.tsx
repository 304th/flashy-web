"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { SocialPost } from "@/features/social/components/social-post/social-post";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { IconButton } from "@/components/ui/icon-button";
import { useSocialPostById } from "@/features/social/queries/use-social-post-by-id";
import { useQueryParams } from "@/hooks/use-query-params";
import { CommentsFeed } from "@/features/comments/components/comments-feed/comments-feed";
import { CommentSend } from "@/features/comments/components/comment-send/comment-send";
import { useModals } from "@/hooks/use-modals";

export default function SocialPostPage() {
  return <Suspense>
    <SocialPostByIdPage />
  </Suspense>
}

const SocialPostByIdPage = () => {
  const id = useQueryParams("id");
  const [socialPost, socialPostQuery] = useSocialPostById(id!);

  if (!id) {
    return <SocialPostNotFound />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Loadable queries={[socialPostQuery]}>
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
}

const SocialPostDetails = ({
  socialPost,
}: {
  socialPost: Optimistic<SocialPost>;
}) => {
  const router = useRouter();
  const { openModal } = useModals();
  const [replyComment, setReplyComment] = useState<CommentPost | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-start">
        <IconButton size="lg" onClick={() => router.back()}>
          <ArrowLeftIcon />
        </IconButton>
        <div className="flex flex-col">
          <SocialPost
            socialPost={socialPost}
            className="!bg-[linear-gradient(180deg,#191919_0%,#191919_0.01%,#151515_100%)]"
            onShareOpen={() =>
              openModal("ShareModal", {
                post: socialPost,
              })
            }
          />

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
              // onCommentSend={() => handleCommentCountUpdate}
              onCloseReply={() => setReplyComment(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialPostNotFound = () => (
  <NotFound>Social post does not exist.</NotFound>
);
