import type { PropsWithChildren } from "react";
import Link from "next/link";
import { UserAvatar } from "@/components/ui/user-avatar";
import { UserBadge } from "@/components/ui/user-badge";
import { useMe } from "@/features/auth/queries/use-me";

export const UserProfile = ({
  user,
  withoutUsername = false,
  avatarClassname,
  children,
}: PropsWithChildren<{
  user: User;
  withoutUsername?: boolean;
  avatarClassname?: string;
}>) => {
  const { data: me } = useMe();

  return (
    <Link
      href={
        user.fbId === me?.fbId
          ? `/profile/social`
          : `/channel/social?id=${user.fbId}`
      }
    >
      <div className="flex items-center gap-2 hover:bg-base-300 transition p-[2px] rounded-md">
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
    </Link>
  );
};
