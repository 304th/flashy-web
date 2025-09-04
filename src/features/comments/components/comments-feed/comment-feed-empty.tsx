import { Separator } from "@/components/ui/separator";

export const CommentFeedEmpty = () => {
  return (
    <div className="flex w-full p-6">
      <Separator>No replies</Separator>
    </div>
  );
};
