import type { PropsWithChildren } from "react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { VerifiedIcon } from "@/components/ui/icons/verified";

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
  return (
    <div className="flex items-center gap-2">
      <UserAvatar
        avatar={user.userimage}
        className={`size-8 ${avatarClassname}`}
      />
      <div className="flex flex-col gap-1">
        {withoutUsername ? null : (
          <>
            <p className="text-white font-bold text-base">{user.username}</p>
            {user.verified && <VerifiedIcon />}
          </>
        )}
        {children}
      </div>
    </div>
  );
};
