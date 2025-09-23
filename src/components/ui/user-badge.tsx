import type { PropsWithChildren } from "react";
import { RepIcon } from "@/components/ui/icons/rep";
import { VerifiedIcon } from "@/components/ui/icons/verified";
import { ModeratorIcon } from "@/components/ui/icons/moderator";

export const UserBadge = ({
  user,
  className,
}: PropsWithChildren<{
  user: User;
  className?: string;
}>) => {
  if (user.representative) {
    return <div className={`flex scale-75 ${className}`}>
      <RepIcon />
    </div>
  }

  if (user.verified) {
    return <div className={`flex scale-75 ${className}`}>
      <VerifiedIcon />
    </div>
  }

  if (user.moderator) {
    return <div className={`flex scale-75 ${className}`}>
      <ModeratorIcon />
    </div>
  }

  return null;
};