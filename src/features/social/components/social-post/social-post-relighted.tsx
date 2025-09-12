import { UserProfile } from "@/components/ui/user-profile";
import { timeAgo } from "@/lib/utils";
import { SocialPostDescription } from "@/features/social/components/social-post/social-post-description";

export const SocialPostRelighted = ({
  relightedPost,
}: {
  relightedPost?: SocialPost;
}) => {
  if (!relightedPost) {
    return null;
  }

  return (
    <div className="flex px-2">
      <div className="flex flex-col p-3 w-full border-y rounded">
        <div className="flex items-center justify-between w-full">
          <UserProfile
            user={{
              fbId: relightedPost.userId,
              username: relightedPost.username,
              userimage: relightedPost.userimage,
            }}
            avatarClassname="size-6"
          />
          <div className="flex gap-2 items-center">
            <p>{timeAgo(relightedPost.createdAt)}</p>
          </div>
        </div>
        <SocialPostDescription socialPost={relightedPost} />
      </div>
    </div>
  );
};
