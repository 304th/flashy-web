import type { PropsWithChildren } from "react";
import Link from "next/link";
import { UserAvatar } from "@/components/ui/user-avatar";
import { UserBadge } from "@/components/ui/user-badge";
import { useMe } from "@/features/auth/queries/use-me";

export interface UserProfileProps {
  user: User;
  isLinkable?: boolean;
  withoutUsername?: boolean;
  className?: string;
  avatarClassname?: string;
}
//FIXME: Fix isLinkable styles container and non-linkable
export const UserProfile = ({
  user,
  isLinkable = true,
  withoutUsername = false,
  className,
  avatarClassname,
  children,
}: PropsWithChildren<UserProfileProps>) => {
  const { data: me } = useMe();

  if (isLinkable) {
    return (
      <Link
        href={
          user.fbId === me?.fbId
            ? `/profile/social`
            : `/channel/social?id=${user.fbId}`
        }
        className={`hover:bg-accent-alpha-lightest transition rounded-md gap-2 p-1 ${className}`}
      >
        <BaseUserProfile
          user={user}
          isLinkable={isLinkable}
          withoutUsername={withoutUsername}
          avatarClassname={avatarClassname}
          children={children}
        />
      </Link>
    );
  }

  return (
    <BaseUserProfile
      user={user}
      isLinkable={isLinkable}
      withoutUsername={withoutUsername}
      className={className}
      avatarClassname={avatarClassname}
      children={children}
    />
  );
};

const BaseUserProfile = ({
  user,
  withoutUsername,
  className,
  avatarClassname,
  children,
}: PropsWithChildren<UserProfileProps>) => (
  <div className={`flex items-center gap-2 p-[2px] ${className}`}>
    <UserAvatar
      avatar={user.userimage}
      className={`size-8 ${avatarClassname}`}
    />
    <div className="flex flex-col gap-1">
      {withoutUsername ? null : (
        <div className="flex items-center gap-1">
          <p className="text-white font-bold text-base">{user.username}</p>
          <UserBadge user={user} />
        </div>
      )}
      {children}
    </div>
  </div>
);
