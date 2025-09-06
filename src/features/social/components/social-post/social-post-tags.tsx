import { MiniPinIcon } from "@/components/ui/icons/mini-pin";

export const SocialPostTags = ({ socialPost }: { socialPost: SocialPost }) => {
  if (!socialPost.pinned) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 border-t">
      {socialPost.pinned && <PinnedEvent socialPost={socialPost} />}
    </div>
  );
};

const PinnedEvent = ({ socialPost }: { socialPost: SocialPost }) => {
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
