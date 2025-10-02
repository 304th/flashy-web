import Link from 'next/link';
import { UserProfile } from "@/components/ui/user-profile";
import { SocialPostMenu } from "@/features/social/components/social-post/social-post-menu";
import { useSocialPostContext } from "@/features/social/components/social-post/social-post-context";
import { SocialPostContent}  from "@/features/social/components/social-post/social-post-content";
import { timeAgo } from "@/lib/utils";

export const SocialPost = ({
  socialPost,
  isLinkable,
  className,
}: {
  socialPost: Optimistic<SocialPost>;
  isLinkable?: boolean;
  className?: string;
}) => {
  const { onCommentsOpen } = useSocialPostContext();

  return (
    <article
      className={`relative flex flex-col p-4 gap-3 h-fit w-full transition
        rounded
        bg-[linear-gradient(180deg,#151515_0%,#151515_0.01%,#19191920_100%)]
        ${isLinkable ? 'hover:bg-base-200' : ''}
        ${className}
        ${socialPost._optimisticStatus === "pending" ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="flex items-center justify-between">
        <UserProfile
          user={{
            fbId: socialPost.userId,
            username: socialPost.username,
            userimage: socialPost.userimage,
          }}
        />
        <div className="flex gap-2 items-center">
          <p>{timeAgo(socialPost.createdAt)}</p>
          {/* FIXME: fix this bullshit logic */}
          {onCommentsOpen && <SocialPostMenu socialPost={socialPost} />}
        </div>
      </div>
      {
        isLinkable ? (
          <Link href={`/social/post?id=${socialPost._id}`}>
            <SocialPostContent socialPost={socialPost} />
          </Link>
        ) : <SocialPostContent socialPost={socialPost} />
      }
    </article>
  );
};