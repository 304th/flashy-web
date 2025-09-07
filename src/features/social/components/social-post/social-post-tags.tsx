import { MiniPinIcon } from "@/components/ui/icons/mini-pin";
import {MiniRelightIcon} from "@/components/ui/icons/mini-relight";

export const SocialPostTags = ({ socialPost }: { socialPost: SocialPost }) => {
  if (!socialPost.pinned && !socialPost.relightedPost) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 border-t">
      {socialPost.pinned && <PinnedTag socialPost={socialPost} />}
      {socialPost.relightedPost && socialPost.relightedBy && <RelightedTag socialPost={socialPost} />}
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
        <span className="text-white font-bold">
          @{socialPost.relightedBy?.username}
        </span>
      </p>
    </div>
  );
}
