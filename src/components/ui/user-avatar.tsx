import type { HTMLAttributes } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface UserAvatarProps {
  avatar?: string;
  className?: string;
}

export const UserAvatar = ({
  avatar,
  className,
  ...props
}: UserAvatarProps & HTMLAttributes<HTMLDivElement>) => {
  return (
    <Avatar className={`cursor-pointer user-select-none ${className}`} {...props}>
      <AvatarImage src={avatar || "/images/avatar.svg"} alt="avatar" />
      <AvatarFallback>
        <AvatarImage src="/images/avatar.svg" alt="defaultAvatar" />
      </AvatarFallback>
    </Avatar>
  );
};
