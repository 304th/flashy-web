import { type HTMLAttributes, useState, type ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface UserAvatarProps {
  avatar?: string;
  className?: string;
  children?: ReactNode;
}

export const UserAvatar = ({
  avatar,
  className,
  children,
  ...props
}: UserAvatarProps & HTMLAttributes<HTMLDivElement>) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return <div className="relative flex">
    <Avatar
      className={`relative cursor-pointer user-select-none ${className}`}
      {...props}
    >
      {avatar && !imageError && (
        <img
          src={avatar}
          alt="avatar"
          className="aspect-square size-full object-cover"
          onError={handleImageError}
        />
      )}
      <AvatarFallback className="bg-transparent">
        <img
          src="/images/avatar.svg"
          alt="Default Avatar"
          className="aspect-square size-full object-cover"
        />
      </AvatarFallback>
    </Avatar>
    {children}

  </div>
};
