"use client";

import { UserProfile } from "@/components/ui/user-profile";
import { PostForm } from "@/features/social/components/post-create/post-form";
import { useMe } from "@/features/auth/queries/useMe";

export const PostCreate = () => {
  const [me] = useMe();

  if (!me) return null;

  return (
    <div className="flex flex-col rounded p-4 bg-base-250 h-fit w-[600px] gap-3">
      <div className="flex items-center w-full">
        <UserProfile user={me} />
      </div>
      <PostForm />
    </div>
  );
};
