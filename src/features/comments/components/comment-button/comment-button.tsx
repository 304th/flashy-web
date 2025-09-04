import { MessageIcon } from "@/components/ui/icons/message";

export const CommentButton = ({
  commentsCount,
  onComment,
}: {
  commentsCount: number;
  onComment?: () => void;
}) => {
  return (
    <div
      className="group flex rounded-md items-center gap-1 px-1 py-[2px]
        cursor-pointer transition hover:text-[#1d9bf0] hover:bg-[#1d9bf010]"
      onClick={onComment}
    >
      <div className="relative flex rounded-full">
        <MessageIcon />
      </div>
      <p className="transition">{commentsCount}</p>
    </div>
  );
};
