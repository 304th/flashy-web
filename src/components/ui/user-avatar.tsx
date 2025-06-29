import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export interface UserAvatarProps {
  avatar?: string;
  className?: string;
}

export const UserAvatar = ({ avatar }: UserAvatarProps) => {
  return <Avatar>
    <AvatarImage src={avatar} alt="avatar" />
    <AvatarFallback>
      <AvatarImage src="/images/avatar.svg" alt="defaultAvatar" />
    </AvatarFallback>
  </Avatar>
}