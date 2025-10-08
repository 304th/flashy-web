import { MiniPinIcon } from "@/components/ui/icons/mini-pin";
import { MiniRelightIcon } from "@/components/ui/icons/mini-relight";
import { MiniKeyIcon } from "@/components/ui/icons/mini-key";

export const SocialPostTags = ({ socialPost, className }: { socialPost: SocialPost, className?: string }) => {
  if (!socialPost.pinned && !socialPost.relightedPost && !socialPost.unlocked) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 border-t ${className}`}>
      {socialPost.pinned && <PinnedTag socialPost={socialPost} />}
      {socialPost.relightedBy && <RelightedTag socialPost={socialPost} />}
      {socialPost.unlocked && <UnlockedTag />}
    </div>
  );
};

const PinnedTag = ({ socialPost }: { socialPost: SocialPost }) => {
  return (
    <div className="flex items-center gap-1 pt-2">
      <div className="flex scale-70">
        <MiniPinIcon />
      </div>
      <p className="text-sm">
        Pinned by{" "}
        <span className="text-white font-bold">
          @{socialPost.pinnedBy?.username}
        </span>
      </p>
    </div>
  );
};

const RelightedTag = ({ socialPost }: { socialPost: SocialPost }) => {
  return (
    <div className="flex items-center pt-2">
      <div className="flex scale-70">
        <MiniRelightIcon />
      </div>
      <p className="text-sm">
        Relighted by{" "}
        <span className="text-white font-bold">@{socialPost?.username}</span>
      </p>
    </div>
  );
};

const UnlockedTag = () => {
  return (
    <div className="flex items-center gap-1 pt-2">
      <MiniKeyIcon />
      <p className="text-sm">Unlocked</p>
    </div>
  );
};
