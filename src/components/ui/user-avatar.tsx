import { type HTMLAttributes,  useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface UserAvatarProps {
  avatar?: string;
  className?: string;
}

export const UserAvatar = ({
  avatar,
  className,
  ...props
}: UserAvatarProps & HTMLAttributes<HTMLDivElement>) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Avatar
      className={`cursor-pointer user-select-none ${className}`}
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
  );
};
