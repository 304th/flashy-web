import { PropsWithChildren, useMemo } from "react";
import { RepIcon } from "@/components/ui/icons/rep";
import { VerifiedIcon } from "@/components/ui/icons/verified";
import { ModeratorIcon } from "@/components/ui/icons/moderator";
import { useRepsAndMods } from "@/features/channels/queries/use-reps-and-mods";

export const UserBadge = ({
  user,
  className,
}: PropsWithChildren<{
  user: User;
  className?: string;
}>) => {
  const [repsAndMods] = useRepsAndMods();
  const foundUser = useMemo(() => {
    if (!repsAndMods) {
      return null;
    }

    return repsAndMods[user.fbId];
  }, [repsAndMods, user]);

  if (foundUser?.representative) {
    return (
      <div className={`flex scale-60 ${className}`}>
        <RepIcon />
      </div>
    );
  }

  if (foundUser?.verified) {
    return (
      <div className={`flex scale-60 ${className}`}>
        <VerifiedIcon />
      </div>
    );
  }

  if (foundUser?.moderator) {
    return (
      <div className={`flex scale-60 ${className}`}>
        <ModeratorIcon />
      </div>
    );
  }

  return null;
};
