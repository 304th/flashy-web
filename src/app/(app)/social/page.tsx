import { PostCreate } from "@/features/social/components/post-create/post-create";
import { SocialFeed } from "@/features/social/components/social-feed/social-feed";

export default function Social() {
  return (
    <div className="flex flex-col gap-4 w-[600px]">
      <PostCreate />
      <SocialFeed />
    </div>
  );
}
