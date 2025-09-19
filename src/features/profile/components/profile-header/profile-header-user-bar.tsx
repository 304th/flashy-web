"use client";

import { ShareIcon } from "lucide-react";
import { Loadable } from "@/components/ui/loadable";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/components/ui/user-profile";
import { useMe } from "@/features/auth/queries/use-me";

export const ProfileHeaderUserBar = ({ className }: { className?: string }) => {
  const [me, query] = useMe();

  return (
    <div
      className={`flex w-full items-center justify-between px-5 py-2
        ${className}`}
    >
      <Loadable queries={[query]}>
        {() =>
          me ? (
            <UserProfile user={me} avatarClassname="size-16">
              <Button variant="secondary" className="w-fit">
                <ShareIcon />
                Share
              </Button>
            </UserProfile>
          ) : null
        }
      </Loadable>
      <div className="flex w-1/5 flex-col items-center gap-2">
        <Button size="lg" variant="secondary" className="w-full">
          Edit Profile
        </Button>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-white">
              {(1232).toLocaleString()}
            </p>
            <p className="text-white">Followers</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-white">
              {(120).toLocaleString()}
            </p>
            <p className="text-white">Following</p>
          </div>
        </div>
      </div>
    </div>
  );
};
