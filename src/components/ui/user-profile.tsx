import { UserAvatar } from "@/components/ui/user-avatar";
import { VerifiedIcon } from "@/components/ui/icons/verified";

export const UserProfile = ({ user }: { user: User }) => {
  return (
    <div className="flex items-center gap-2">
      <UserAvatar avatar={user.avatar} className="size-8" />
      <p className="text-white font-bold text-base">{user.username}</p>
      {user.verified && <VerifiedIcon />}
    </div>
  );
};
