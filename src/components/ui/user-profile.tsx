import type { MouseEvent, PropsWithChildren } from "react";
import Link from "next/link";
import { LiveTag } from "@/components/ui/live-tag";
import { UserAvatar } from "@/components/ui/user-avatar";
import { UserBadge } from "@/components/ui/user-badge";
import { useMe } from "@/features/auth/queries/use-me";
import { useModals } from "@/hooks/use-modals";

export interface UserProfileProps {
  user: User;
  stream?: Stream;
  isLive?: boolean;
  isLinkable?: boolean;
  showImage?: boolean;
  withoutUsername?: boolean;
  truncateUsername?: boolean;
  className?: string;
  avatarClassname?: string;
}
//FIXME: Fix isLinkable styles container and non-linkable
export const UserProfile = ({
  user,
  stream,
  isLive,
  isLinkable = true,
  showImage = false,
  withoutUsername = false,
  truncateUsername = false,
  className,
  avatarClassname,
  children,
}: PropsWithChildren<UserProfileProps>) => {
  const { data: me } = useMe();

  if (!user) {
    return null;
  }

  if (isLinkable) {
    return (
      <Link
        href={
          stream && stream.isLive
            ? `/stream/post?id=${stream._id}`
            : user?.fbId === me?.fbId
              ? `/profile/social`
              : `/channel/social?id=${user?.fbId}`
        }
        className={`hover:bg-accent-alpha-lightest transition rounded-md gap-2
          p-1 ${className}`}
      >
        <BaseUserProfile
          user={user}
          isLive={isLive}
          isLinkable={isLinkable}
          truncateUsername={truncateUsername}
          withoutUsername={withoutUsername}
          avatarClassname={avatarClassname}
          showImage={showImage}
          children={children}
        />
      </Link>
    );
  }

  return (
    <BaseUserProfile
      user={user}
      isLive={isLive}
      isLinkable={isLinkable}
      truncateUsername={truncateUsername}
      withoutUsername={withoutUsername}
      className={className}
      avatarClassname={avatarClassname}
      showImage={showImage}
      children={children}
    />
  );
};

const BaseUserProfile = ({
  user,
  isLive,
  withoutUsername,
  truncateUsername,
  showImage,
  className,
  avatarClassname,
  children,
}: PropsWithChildren<UserProfileProps>) => {
  const { openModal } = useModals();

  const handleImageClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!showImage || !user.userimage) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    openModal("ImageViewerModal", {
      slides: [{ src: user.userimage }],
      initialOpenIndex: 0,
    });
  };

  return (
    <div className={`relative flex items-center gap-2 p-[2px] ${className}`}>
      <div
        onClick={handleImageClick}
        className={showImage && user.userimage ? "cursor-pointer" : ""}
      >
        <UserAvatar
          avatar={user.userimage}
          className={`size-8 ${avatarClassname}
            ${isLive ? "border-3 border-red-600" : ""}`}
        >
          {isLive && (
            <LiveTag className="absolute -bottom-1 left-1/2 -translate-x-1/2" />
          )}
        </UserAvatar>
      </div>
      {withoutUsername ? null : (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <p
              className={`text-white font-bold text-base
                ${truncateUsername ? "max-w-[220px] ellipsis" : ""}`}
            >
              {user.username}
            </p>
            <UserBadge user={user} />
          </div>
          {children}
        </div>
      )}
    </div>
  );
};
