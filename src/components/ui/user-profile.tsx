import { UserAvatar } from "@/components/ui/user-avatar";
import { VerifiedIcon } from "@/components/ui/icons/verified";

export const UserProfile = ({
  user,
  withoutUsername = false,
  avatarClassname,
}: {
  user: User;
  withoutUsername?: boolean;
  avatarClassname?: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <UserAvatar
        avatar={user.userimage}
        className={`size-8 ${avatarClassname}`}
      />
      {withoutUsername ? null : (
        <>
          <p className="text-white font-bold text-base">{user.username}</p>
          {user.verified && <VerifiedIcon />}
        </>
      )}
    </div>
  );
};
